import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { vehiclesApi } from '@/lib/api';

const schema = z.object({
  plate: z.string().min(6, 'Placa muito curta').max(10, 'Placa muito longa'),
  make: z.string().min(1, 'Obrigatório'),
  model: z.string().min(1, 'Obrigatório'),
  year: z.coerce.number().int('Ano inválido').min(1990).max(2100),
  vin: z.string().length(17, 'VIN deve ter 17 caracteres'),
  registrationDate: z.string().min(1, 'Obrigatório'),
  currentKm: z.coerce.number().int().min(0, 'KM inválido'),
  healthScore: z.coerce.number().min(0).max(100, '0 a 100'),
  crlvNumber: z.string().optional(),
  renavam: z.string().optional(),
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

export default function EditVehiclePage() {
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
        const res = await vehiclesApi.getOne(id);
        const v = res.data;
        reset({
          plate: v.plate ?? '',
          make: v.make ?? '',
          model: v.model ?? '',
          year: Number(v.year) || new Date().getFullYear(),
          vin: v.vin ?? '',
          registrationDate: v.registrationDate
            ? String(v.registrationDate).slice(0, 10)
            : '',
          currentKm: Number(v.currentKm) || 0,
          healthScore: Number(v.healthScore) || 0,
          crlvNumber: v.crlvNumber ?? '',
          renavam: v.renavam ?? '',
        });
      } catch {
        setServerError('Não foi possível carregar o veículo.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await vehiclesApi.update(id, {
        ...data,
        plate: data.plate.toUpperCase(),
        vin: data.vin.toUpperCase(),
      });
      router.replace(`/vehicles/${id}`);
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
        <title>Editar veículo — BRAVIX Fleet</title>
      </Head>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href={`/vehicles/${id}`}
          className="font-mono text-xs text-amber hover:underline"
        >
          ← detalhe
        </Link>
        <p className="label-eyebrow mb-1 mt-3">Edição</p>
        <h1 className="mb-8 text-4xl font-extrabold">Editar veículo</h1>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="panel space-y-5 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Placa" error={errors.plate?.message}>
                <input className="field font-mono uppercase" {...register('plate')} />
              </Field>
              <Field label="Ano" error={errors.year?.message}>
                <input className="field" type="number" {...register('year')} />
              </Field>
              <Field label="Marca" error={errors.make?.message}>
                <input className="field" {...register('make')} />
              </Field>
              <Field label="Modelo" error={errors.model?.message}>
                <input className="field" {...register('model')} />
              </Field>
              <Field label="VIN (chassi)" error={errors.vin?.message}>
                <input
                  className="field font-mono uppercase"
                  maxLength={17}
                  {...register('vin')}
                />
              </Field>
              <Field label="Data de registro" error={errors.registrationDate?.message}>
                <input className="field" type="date" {...register('registrationDate')} />
              </Field>
              <Field label="KM atual" error={errors.currentKm?.message}>
                <input className="field" type="number" {...register('currentKm')} />
              </Field>
              <Field label="Saúde (%)" error={errors.healthScore?.message}>
                <input className="field" type="number" {...register('healthScore')} />
              </Field>
              <Field label="CRLV (opcional)" error={errors.crlvNumber?.message}>
                <input className="field" {...register('crlvNumber')} />
              </Field>
              <Field label="RENAVAM (opcional)" error={errors.renavam?.message}>
                <input className="field" {...register('renavam')} />
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
              <Link href={`/vehicles/${id}`} className="btn-ghost">
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
