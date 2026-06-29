import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { vehiclesApi } from '@/lib/api';

const schema = z.object({
  plate: z
    .string()
    .min(6, 'Placa muito curta')
    .max(10, 'Placa muito longa'),
  make: z.string().min(1, 'Obrigatório'),
  model: z.string().min(1, 'Obrigatório'),
  year: z.coerce
    .number()
    .int('Ano inválido')
    .min(1990, 'Ano inválido')
    .max(2100, 'Ano inválido'),
  vin: z.string().length(17, 'VIN deve ter 17 caracteres'),
  registrationDate: z.string().min(1, 'Obrigatório'),
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

export default function NewVehiclePage() {
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
        plate: data.plate.toUpperCase(),
        vin: data.vin.toUpperCase(),
        companyId,
      };
      const res = await vehiclesApi.create(payload);
      const id = res.data?.id;
      router.replace(id ? `/vehicles/${id}` : '/vehicles');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg || 'Não foi possível cadastrar o veículo.',
      );
    }
  };

  return (
    <>
      <Head>
        <title>Novo veículo — BRAVIX Fleet</title>
      </Head>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/vehicles"
          className="font-mono text-xs text-amber hover:underline"
        >
          ← veículos
        </Link>
        <p className="label-eyebrow mb-1 mt-3">Cadastro</p>
        <h1 className="mb-8 text-4xl font-extrabold">Novo veículo</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="panel space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Placa" error={errors.plate?.message}>
              <input
                className="field font-mono uppercase"
                placeholder="ABC-1234"
                {...register('plate')}
              />
            </Field>
            <Field label="Ano" error={errors.year?.message}>
              <input
                className="field"
                type="number"
                placeholder="2024"
                {...register('year')}
              />
            </Field>
            <Field label="Marca" error={errors.make?.message}>
              <input
                className="field"
                placeholder="Volvo"
                {...register('make')}
              />
            </Field>
            <Field label="Modelo" error={errors.model?.message}>
              <input
                className="field"
                placeholder="FH16"
                {...register('model')}
              />
            </Field>
            <Field label="VIN (chassi)" error={errors.vin?.message}>
              <input
                className="field font-mono uppercase"
                placeholder="17 caracteres"
                maxLength={17}
                {...register('vin')}
              />
            </Field>
            <Field label="Data de registro" error={errors.registrationDate?.message}>
              <input
                className="field"
                type="date"
                {...register('registrationDate')}
              />
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-amber"
            >
              {isSubmitting ? 'Salvando…' : 'Cadastrar veículo'}
            </button>
            <Link href="/vehicles" className="btn-ghost">
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
