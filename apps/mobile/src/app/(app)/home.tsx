import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { PrimaryButton } from '@components/PrimaryButton';
import { colors, radius, spacing } from '@constants/theme';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gestor de Frota',
  driver: 'Motorista',
  mechanic: 'Mecânico',
};

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Olá, {user?.name ?? 'usuário'} 👋</Text>
      <Text style={styles.subtitle}>Bem-vindo ao painel de inspeção veicular</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Conta</Text>
        <Text style={styles.cardValue}>{user?.email}</Text>
        <Text style={styles.cardLabel}>Função</Text>
        <Text style={styles.cardValue}>
          {user?.role ? roleLabels[user.role] ?? user.role : '-'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.85}
        onPress={() => router.push('/(app)/vehicles')}
      >
        <View>
          <Text style={styles.actionTitle}>Inspeção</Text>
          <Text style={styles.actionSubtitle}>Selecione um veículo e capture fotos</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.85}
        onPress={() => router.push('/(app)/vehicles')}
      >
        <View>
          <Text style={styles.actionTitle}>Inspeção</Text>
          <Text style={styles.actionSubtitle}>Selecione um veículo e capture fotos</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.85}
        onPress={() => router.push('/(app)/vehicles')}
      >
        <View>
          <Text style={styles.actionTitle}>Veículos</Text>
          <Text style={styles.actionSubtitle}>Ver a frota cadastrada</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      <PrimaryButton title="Sair" variant="ghost" onPress={onLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  greeting: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  cardValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  actionCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  actionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  actionArrow: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '700',
  },
});
