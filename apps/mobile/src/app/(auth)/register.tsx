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

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) next.name = 'Informe seu nome';
    if (!email.trim()) next.email = 'Informe o e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'E-mail inválido';
    if (!password) next.password = 'Informe a senha';
    else if (password.length < 8) next.password = 'Mínimo de 8 caracteres';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(email.trim(), password, name.trim());
      router.replace('/(app)/home');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Não foi possível criar a conta.';
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
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para começar</Text>
        </View>

        <TextField
          label="Nome"
          placeholder="Seu nome"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
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
          placeholder="Mínimo de 8 caracteres"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        {!!formError && <Text style={styles.formError}>{formError}</Text>}

        <PrimaryButton
          title="Criar conta"
          loading={submitting}
          onPress={onSubmit}
          style={styles.submit}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <Link href="/(auth)/login" style={styles.link}>
            Entrar
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
