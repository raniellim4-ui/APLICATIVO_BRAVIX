import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          As telas de veículos e inspeção serão adicionadas nas próximas etapas.
        </Text>
      </View>

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
  placeholder: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
