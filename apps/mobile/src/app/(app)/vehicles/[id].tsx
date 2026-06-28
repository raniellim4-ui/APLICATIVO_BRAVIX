import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiService } from '@services/api';
import { PrimaryButton } from '@components/PrimaryButton';
import { Vehicle } from '@/types';
import { colors, radius, spacing } from '@constants/theme';

interface MaintenanceAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  component: string;
  message: string;
  daysRemaining?: number;
  kmRemaining?: number;
}

function healthColor(score: number): string {
  if (score >= 85) return colors.success;
  if (score >= 70) return '#f59e0b';
  return colors.danger;
}

function alertColor(severity: string): string {
  if (severity === 'critical') return colors.danger;
  if (severity === 'warning') return '#f59e0b';
  return '#60a5fa';
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR');
}

function formatCurrency(value?: number | string | null): string {
  if (value == null || value === '') return '—';
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function VehicleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setError('');
    try {
      const [vehicleData, alertsData] = await Promise.all([
        apiService.getVehicle(id),
        apiService.getMaintenanceAlerts(id),
      ]);
      setVehicle(vehicleData);
      setAlerts(alertsData?.alerts ?? []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Não foi possível carregar o veículo.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const score = Number(vehicle?.healthScore) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhe</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error || !vehicle ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || 'Veículo não encontrado.'}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.retry}>
            <Text style={styles.retryText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <Text style={styles.plate}>{vehicle.plate}</Text>
              <View style={[styles.badge, { backgroundColor: healthColor(score) }]}>
                <Text style={styles.badgeText}>{score.toFixed(0)}%</Text>
              </View>
            </View>
            <Text style={styles.vehicleName}>
              {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.subtitle}>Ano {vehicle.year}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identificação</Text>
            <DetailRow label="VIN" value={vehicle.vin || '—'} />
            <DetailRow label="CRLV" value={vehicle.crlvNumber || '—'} />
            <DetailRow label="RENAVAM" value={vehicle.renavam || '—'} />
            <DetailRow
              label="Registro"
              value={formatDate(vehicle.registrationDate)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Operação</Text>
            <Text style={styles.kmValue}>
              {Number(vehicle.currentKm).toLocaleString('pt-BR')}
              <Text style={styles.kmUnit}> km</Text>
            </Text>
            <DetailRow
              label="Última inspeção"
              value={formatDate(vehicle.lastInspectionAt)}
            />
            <DetailRow
              label="Valor de aquisição"
              value={formatCurrency(vehicle.purchasePrice)}
            />
            <DetailRow
              label="Vida útil prevista"
              value={
                vehicle.expectedLifespanYears
                  ? `${vehicle.expectedLifespanYears} anos`
                  : '—'
              }
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertas de manutenção</Text>
            {alerts.length === 0 ? (
              <Text style={styles.emptyAlerts}>Nenhum alerta pendente.</Text>
            ) : (
              alerts.map((alert) => (
                <View
                  key={alert.id}
                  style={[
                    styles.alertCard,
                    { borderLeftColor: alertColor(alert.severity) },
                  ]}
                >
                  <Text style={styles.alertComponent}>{alert.component}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  {(alert.kmRemaining != null || alert.daysRemaining != null) && (
                    <Text style={styles.alertMeta}>
                      {alert.kmRemaining != null &&
                        `${Number(alert.kmRemaining).toLocaleString('pt-BR')} km`}
                      {alert.kmRemaining != null && alert.daysRemaining != null && ' · '}
                      {alert.daysRemaining != null && `${alert.daysRemaining} dias`}
                    </Text>
                  )}
                </View>
              ))
            )}
          </View>

          <PrimaryButton
            title="Iniciar inspeção"
            onPress={() =>
              router.push({
                pathname: '/(app)/inspection/[vehicleId]',
                params: { vehicleId: id, plate: vehicle.plate },
              })
            }
            style={{ marginTop: spacing.sm }}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  back: { color: colors.primary, fontSize: 16, fontWeight: '600', width: 60 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  plate: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  badge: { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  badgeText: { color: '#0f172a', fontSize: 12, fontWeight: '800' },
  vehicleName: { color: colors.text, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.textMuted, fontSize: 13, flex: 1 },
  rowValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  kmValue: { color: colors.primary, fontSize: 32, fontWeight: '800', marginBottom: spacing.sm },
  kmUnit: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  emptyAlerts: { color: colors.textMuted, fontSize: 14 },
  alertCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
  },
  alertComponent: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  alertMessage: { color: colors.text, fontSize: 14, marginTop: 4 },
  alertMeta: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  errorText: { color: colors.danger, textAlign: 'center', marginBottom: spacing.md },
  retry: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: { color: colors.onPrimary, fontWeight: '700' },
});
