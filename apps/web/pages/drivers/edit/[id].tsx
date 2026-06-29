import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { driversApi } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  cnh: z.string().min(5, 'CNH inválida').max(20, 'CNH inválida'),
  cnhExpiration: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  totalKm: z.coerce.number().int().min(0, 'KM inválido'),
  fuelEfficiency: z.coerce.number().min(0, 'Valor inválido'),
  inspectionQualityScore: z.coerce.number().min(0).max(5, '0 a 5'),
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

export default function EditDriverPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await driversApi.getOne(id);
        const d = res.data;
        reset({
          name: d.name ?? '',
          cnh: d.cnh ?? '',
          cnhExpiration: d.cnhExpiration
            ? String(d.cnhExpiration).slice(0, 10)
            : '',
          phone: d.phone ?? '',
          email: d.email ?? '',
          totalKm: Number(d.totalKm) || 0,
          fuelEfficiency: Number(d.fuelEfficiency) || 0,
          inspectionQualityScore: Number(d.inspectionQualityScore) || 0,
        });
      } catch {
        setServerError('Não foi possível carregar o motorista.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await driversApi.update(id, {
        ...data,
        email: data.email || undefined,
      });
      router.replace(`/drivers/${id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg || 'Não foi possível salvar as alterações.',
      );
    }
  };

  return (
    <>
      <Head>
        <title>Editar motorista — BRAVIX Frota</title>
      </Head>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href={`/drivers/${id}`}
          className="font-mono text-xs text-amber hover:underline"
        >
          ← detalhe
        </Link>
        <p className="label-eyebrow mb-1 mt-3">Edição</p>
        <h1 className="mb-8 text-4xl font-extrabold">Editar motorista</h1>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="panel space-y-5 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nome" error={errors.name?.message}>
                <input className="field" {...register('name')} />
              </Field>
              <Field label="CNH" error={errors.cnh?.message}>
                <input className="field font-mono" {...register('cnh')} />
              </Field>
              <Field label="Validade da CNH" error={errors.cnhExpiration?.message}>
                <input className="field" type="date" {...register('cnhExpiration')} />
              </Field>
              <Field label="Telefone" error={errors.phone?.message}>
                <input className="field" {...register('phone')} />
              </Field>
              <Field label="E-mail" error={errors.email?.message}>
                <input className="field" type="email" {...register('email')} />
              </Field>
              <Field label="KM total" error={errors.totalKm?.message}>
                <input className="field" type="number" {...register('totalKm')} />
              </Field>
              <Field label="Eficiência (km/l)" error={errors.fuelEfficiency?.message}>
                <input
                  className="field"
                  type="number"
                  step="0.1"
                  {...register('fuelEfficiency')}
                />
              </Field>
              <Field
                label="Qualidade (0-5)"
                error={errors.inspectionQualityScore?.message}
              >
                <input
                  className="field"
                  type="number"
                  step="0.1"
                  {...register('inspectionQualityScore')}
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
                {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
              </button>
              <Link href={`/drivers/${id}`} className="btn-ghost">
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
