import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';
import { BrandLogo } from '@/components/BrandLogo';

const loginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginForm) => {
    setFormError('');
    try {
      await login(values.email.trim(), values.password);
      router.replace('/');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Credenciais inválidas. Tente novamente.';
      setFormError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <>
      <Head>
        <title>Entrar — BRAVIX Frota</title>
      </Head>
      <main className="grid min-h-screen lg:grid-cols-2">
        {/* Left / brand panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r p-12 lg:flex">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_circle_at_30%_20%,rgba(245,165,36,0.10),transparent_60%)]" />
          <div className="flex items-center gap-3">
            <BrandLogo width={132} height={44} />
          </div>

          <div className="max-w-md">
            <p className="label-eyebrow mb-4">Sistema de inspeção veicular</p>
            <h1 className="text-5xl font-extrabold leading-[1.05]">
              Controle total da sua{' '}
              <span className="text-amber">frota</span>, em tempo real.
            </h1>
            <p className="mt-5 leading-relaxed text-muted">
              Inspeções, saúde dos veículos, motoristas e manutenção — centralizados
              em um só painel de comando.
            </p>
          </div>

          <div className="flex gap-8 font-mono text-sm text-muted">
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">30+</div>
              rotas de API
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">RBAC</div>
              4 perfis
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">JWT</div>
              seguro
            </div>
          </div>
        </section>

        {/* Right / form */}
        <section className="flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <BrandLogo width={120} height={40} />
            </div>

            <p className="label-eyebrow mb-2">Acesso restrito</p>
            <h2 className="mb-1 text-3xl font-bold">Entrar</h2>
            <p className="mb-8 text-sm text-muted">
              Use suas credenciais para acessar o painel.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="label-eyebrow mb-2 block">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className="field"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label-eyebrow mb-2 block">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="field"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {formError && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {formError}
                </p>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-amber w-full">
                {isSubmitting ? 'Entrando...' : 'Entrar →'}
              </button>
            </form>

            <div className="mt-8 rounded-lg border border-dashed px-4 py-3 font-mono text-xs text-muted">
              <span className="text-amber">demo</span> · admin@vehicleinspection.com /
              Admin@123456
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
