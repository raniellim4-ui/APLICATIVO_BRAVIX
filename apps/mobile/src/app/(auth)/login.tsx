import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { TextField } from '@components/TextField';
import { PrimaryButton } from '@components/PrimaryButton';
import { colors, spacing } from '@constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = 'Informe o e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'E-mail inválido';
    if (!password) next.password = 'Informe a senha';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace('/(app)/home');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Credenciais inválidas. Tente novamente.';
      setFormError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Inspeção Veicular</Text>
          <Text style={styles.subtitle}>Entre com sua conta para continuar</Text>
        </View>

        <TextField
          label="E-mail"
          placeholder="seu@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <TextField
          label="Senha"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        {!!formError && <Text style={styles.formError}>{formError}</Text>}

        <PrimaryButton
          title="Entrar"
          loading={submitting}
          onPress={onSubmit}
          style={styles.submit}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <Link href="/(auth)/register" style={styles.link}>
            Criar conta
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
  },
  formError: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  submit: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    color: colors.textMuted,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});
