import { useCallback, useEffect, useState } from 'react';
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
import { Vehicle } from '@/types';
import { colors, radius, spacing } from '@constants/theme';

function healthColor(score: number): string {
  if (score >= 85) return colors.success;
  if (score >= 70) return '#f59e0b';
  return colors.danger;
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const score = Number(vehicle.healthScore) || 0;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.plate}>{vehicle.plate}</Text>
        <View style={[styles.badge, { backgroundColor: healthColor(score) }]}>
          <Text style={styles.badgeText}>{score.toFixed(0)}%</Text>
        </View>
      </View>
      <Text style={styles.vehicleName}>
        {vehicle.make} {vehicle.model}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Ano {vehicle.year}</Text>
        <Text style={styles.meta}>
          {Number(vehicle.currentKm).toLocaleString('pt-BR')} km
        </Text>
      </View>
    </View>
  );
}

export default function VehiclesScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await apiService.getVehicles();
      setVehicles(data.vehicles ?? data ?? []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Não foi possível carregar os veículos.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
        <Text style={styles.title}>Veículos</Text>
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
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VehicleCard vehicle={item} />}
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
              <Text style={styles.empty}>Nenhum veículo cadastrado.</Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
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
  badge: { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  badgeText: { color: '#0f172a', fontSize: 12, fontWeight: '800' },
  vehicleName: { color: colors.textMuted, fontSize: 15, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
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
