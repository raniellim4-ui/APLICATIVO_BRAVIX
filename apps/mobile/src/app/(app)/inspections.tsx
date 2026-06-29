import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '@services/api';
import { Inspection, Vehicle } from '@/types';
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

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function InspectionsScreen() {
  const router = useRouter();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [insp, veh] = await Promise.all([
        apiService.getInspections(),
        apiService.getVehicles(),
      ]);
      setInspections(insp.inspections ?? insp ?? []);
      setVehicles(veh.vehicles ?? veh ?? []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Não foi possível carregar as inspeções.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const vehicleMap = useMemo(() => {
    const map = new Map<string, Vehicle>();
    vehicles.forEach((v) => map.set(v.id, v));
    return map;
  }, [vehicles]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Inspeções</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={load} style={styles.retry}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={inspections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const vehicle = vehicleMap.get(item.vehicleId);
            const quality = Number(item.aiQualityScore) || 0;
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => router.push(`/(app)/inspections/${item.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.plate}>
                    {vehicle ? vehicle.plate : item.vehicleId.slice(0, 8) + '…'}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      { borderColor: statusColor(item.status) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: statusColor(item.status) },
                      ]}
                    >
                      {statusLabels[item.status] ?? item.status}
                    </Text>
                  </View>
                </View>
                {vehicle && (
                  <Text style={styles.vehicleName}>
                    {vehicle.make} {vehicle.model}
                  </Text>
                )}
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>
                    {typeLabels[item.inspectionType] ?? item.inspectionType}
                  </Text>
                  <Text style={styles.meta}>{formatDate(item.inspectionDate)}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>{item.totalPhotos} fotos</Text>
                  <Text style={styles.meta}>
                    {quality > 0 ? `${Math.round(quality * 100)}% IA` : '—'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.empty}>
                Nenhuma inspeção registrada ainda.
              </Text>
            </View>
          }
        />
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
  list: { padding: spacing.lg, gap: spacing.md },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  plate: { color: colors.text, fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  badge: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, fontWeight: '800' },
  vehicleName: { color: colors.textMuted, fontSize: 15, marginBottom: spacing.sm },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  meta: { color: colors.textMuted, fontSize: 13 },
  errorText: { color: colors.danger, textAlign: 'center', marginBottom: spacing.md },
  retry: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: { color: colors.text, fontWeight: '700' },
  empty: { color: colors.textMuted, fontSize: 15 },
});
