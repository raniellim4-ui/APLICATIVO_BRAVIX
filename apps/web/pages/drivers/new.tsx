import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { driversApi, vehiclesApi } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  cnh: z.string().min(5, 'CNH inválida').max(20, 'CNH inválida'),
  cnhExpiration: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email('E-mail inválido')
    .optional()
    .or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-eyebrow mb-1.5 block">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

export default function NewDriverPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      // companyId: reaproveita o da frota existente; se não houver, gera um.
      let companyId: string;
      const existing = await vehiclesApi.getAll();
      const first = existing.data?.vehicles?.[0];
      companyId =
        first?.companyId ??
        (globalThis.crypto?.randomUUID
          ? globalThis.crypto.randomUUID()
          : '00000000-0000-4000-8000-000000000000');

      const payload = {
        ...data,
        email: data.email || undefined,
        companyId,
      };
      const res = await driversApi.create(payload);
      const id = res.data?.id;
      router.replace(id ? `/drivers/${id}` : '/drivers');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg || 'Não foi possível cadastrar o motorista.',
      );
    }
  };

  return (
    <>
      <Head>
        <title>Novo motorista — BRAVIX Frota</title>
      </Head>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/drivers"
          className="font-mono text-xs text-amber hover:underline"
        >
          ← motoristas
        </Link>
        <p className="label-eyebrow mb-1 mt-3">Cadastro</p>
        <h1 className="mb-8 text-4xl font-extrabold">Novo motorista</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="panel space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome" error={errors.name?.message}>
              <input
                className="field"
                placeholder="João Silva"
                {...register('name')}
              />
            </Field>
            <Field label="CNH" error={errors.cnh?.message}>
              <input
                className="field font-mono"
                placeholder="12345678901"
                {...register('cnh')}
              />
            </Field>
            <Field label="Validade da CNH" error={errors.cnhExpiration?.message}>
              <input
                className="field"
                type="date"
                {...register('cnhExpiration')}
              />
            </Field>
            <Field label="Telefone" error={errors.phone?.message}>
              <input
                className="field"
                placeholder="11 99999-9999"
                {...register('phone')}
              />
            </Field>
            <Field label="E-mail (opcional)" error={errors.email?.message}>
              <input
                className="field"
                type="email"
                placeholder="motorista@empresa.com"
                {...register('email')}
              />
            </Field>
          </div>

          {serverError && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {serverError}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={isSubmitting} className="btn-amber">
              {isSubmitting ? 'Salvando…' : 'Cadastrar motorista'}
            </button>
            <Link href="/drivers" className="btn-ghost">
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
