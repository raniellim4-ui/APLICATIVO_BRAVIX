import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiService, resolvePhotoUrl } from '@services/api';
import { colors, radius, spacing } from '@constants/theme';

const typeLabels: Record<string, string> = {
  pre_trip: 'Pré-viagem',
  post_trip: 'Pós-viagem',
  periodic: 'Periódica',
  maintenance_check: 'Manutenção',
};

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  completed: 'Concluída',
  reviewed: 'Revisada',
  approved: 'Aprovada',
};

function statusColor(status: string): string {
  if (status === 'completed' || status === 'approved') return colors.success;
  if (status === 'reviewed') return '#f59e0b';
  return colors.textMuted;
}

function formatDateTime(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function InspectionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [inspection, setInspection] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setError('');
    try {
      const insp = await apiService.getInspection(id);
      setInspection(insp);
      if (insp?.vehicleId) {
        try {
          setVehicle(await apiService.getVehicle(insp.vehicleId));
        } catch {
          // veículo pode não existir mais; segue sem
        }
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Não foi possível carregar a inspeção.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const quality = Number(inspection?.aiQualityScore) || 0;
  const photos: string[] = inspection?.photos ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Inspeção</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error || !inspection ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || 'Inspeção não encontrada.'}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.kind}>
              {typeLabels[inspection.inspectionType] ?? inspection.inspectionType}
            </Text>
            <View
              style={[styles.badge, { borderColor: statusColor(inspection.status) }]}
            >
              <Text
                style={[styles.badgeText, { color: statusColor(inspection.status) }]}
              >
                {statusLabels[inspection.status] ?? inspection.status}
              </Text>
            </View>
          </View>
          {vehicle && (
            <Text style={styles.vehicle}>
              {vehicle.plate} · {vehicle.make} {vehicle.model}
            </Text>
          )}

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Resumo</Text>
            <Row label="Data" value={formatDateTime(inspection.inspectionDate)} />
            <Row label="Fotos" value={String(inspection.totalPhotos ?? photos.length)} />
            <Row
              label="Qualidade IA"
              value={quality > 0 ? `${Math.round(quality * 100)}%` : '—'}
            />
            <Row label="Danos" value={String(inspection.damageCount ?? 0)} />
            <Row
              label="Odômetro"
              value={
                inspection.odometerReading != null
                  ? `${Number(inspection.odometerReading).toLocaleString('pt-BR')} km`
                  : '—'
              }
            />
            <Row
              label="Assinatura"
              value={inspection.signatureDigital ? 'Registrada' : '—'}
            />
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>
              Fotos {photos.length > 0 ? `(${photos.length})` : ''}
            </Text>
            {photos.length === 0 ? (
              <Text style={styles.empty}>Nenhuma foto registrada.</Text>
            ) : (
              <View style={styles.grid}>
                {photos.map((p, i) => {
                  const uri = resolvePhotoUrl(p);
                  return (
                    <View key={i} style={styles.photoCell}>
                      {uri ? (
                        <Image source={{ uri }} style={styles.photo} />
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <Text style={styles.photoIcon}>📷</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const GAP = spacing.sm;

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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  kind: { color: colors.text, fontSize: 24, fontWeight: '800' },
  badge: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, fontWeight: '800' },
  vehicle: { color: colors.textMuted, fontSize: 15, marginBottom: spacing.lg },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  panelLabel: {
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  photoCell: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoIcon: { fontSize: 24 },
  empty: { color: colors.textMuted, fontSize: 14 },
  errorText: { color: colors.danger, textAlign: 'center' },
});
