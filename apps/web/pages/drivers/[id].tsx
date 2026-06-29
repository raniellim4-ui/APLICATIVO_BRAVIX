import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, driversApi } from '@/lib/api';

interface DriverDetail {
  id: string;
  name: string;
  cnh: string;
  cnhExpiration?: string | null;
  phone?: string | null;
  email?: string | null;
  totalKm: number | string;
  fuelExpense: number | string;
  fuelEfficiency: number | string;
  inspectionQualityScore: number | string;
  avgInspectionTimeMinutes?: number;
  inspectionsCompleted?: number;
  isActive?: boolean;
}

interface DriverAnalytics {
  period: string;
  totalKm: number;
  fuelExpense: number;
  fuelEfficiency: number;
  inspectionsCompleted: number;
  inspectionsCompletedTotal: number;
  avgInspectionTime: number;
  qualityScore: number;
}

function qualityClasses(score: number): string {
  if (score >= 4.5) return 'border-green-500/30 bg-green-500/10 text-green-300';
  if (score >= 3.5) return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  return 'border-red-500/30 bg-red-500/10 text-red-300';
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(value?: number | string | null): string {
  if (value == null || value === '') return '—';
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] py-3 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <span className="text-right font-mono text-sm text-[var(--text)]">{value}</span>
    </div>
  );
}

export default function DriverDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';

  const driverQuery = useQuery({
    queryKey: ['driver', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await driversApi.getOne(id);
      return res.data as DriverDetail;
    },
  });

  const analyticsQuery = useQuery({
    queryKey: ['driver-analytics', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await analyticsApi.getDriver(id);
      return res.data as DriverAnalytics;
    },
  });

  const driver = driverQuery.data;
  const score = Number(driver?.inspectionQualityScore) || 0;
  const analytics = analyticsQuery.data;

  const [deleting, setDeleting] = useState(false);
  const onDelete = async () => {
    if (!driver) return;
    if (
      !window.confirm(
        `Excluir o motorista ${driver.name}? Esta ação não pode ser desfeita.`,
      )
    )
      return;
    setDeleting(true);
    try {
      await driversApi.delete(driver.id);
      router.replace('/drivers');
    } catch {
      setDeleting(false);
      window.alert('Não foi possível excluir o motorista.');
    }
  };

  return (
    <>
      <Head>
        <title>
          {driver ? `${driver.name} — BRAVIX Frota` : 'Motorista — BRAVIX Frota'}
        </title>
      </Head>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/drivers" className="font-mono text-xs text-amber hover:underline">
          ← motoristas
        </Link>

        {driverQuery.isLoading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          </div>
        ) : driverQuery.isError || !driver ? (
          <div className="panel mt-8 p-8 text-center">
            <p className="mb-4 text-red-300">Motorista não encontrado.</p>
            <Link href="/drivers" className="btn-amber">
              Voltar à lista
            </Link>
          </div>
        ) : (
          <div className="stagger mt-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label-eyebrow mb-1">Detalhe do motorista</p>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-4xl font-extrabold">
                    {driver.name}
                  </h1>
                  <span
                    className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${qualityClasses(score)}`}
                  >
                    {score.toFixed(1)} qualidade
                  </span>
                  {driver.isActive === false && (
                    <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-300">
                      inativo
                    </span>
                  )}
                </div>
                <p className="mt-2 font-mono text-sm tracking-wider text-muted">
                  CNH {driver.cnh}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/drivers/edit/${driver.id}`}
                  className="btn-ghost text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={onDelete}
                  disabled={deleting}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                >
                  {deleting ? 'Excluindo…' : 'Excluir'}
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="panel p-5 lg:col-span-2">
                <p className="label-eyebrow mb-4">Identificação</p>
                <DetailRow label="Nome" value={driver.name} />
                <DetailRow label="CNH" value={driver.cnh} />
                <DetailRow
                  label="Validade da CNH"
                  value={formatDate(driver.cnhExpiration)}
                />
                <DetailRow label="Telefone" value={driver.phone || '—'} />
                <DetailRow label="E-mail" value={driver.email || '—'} />
              </div>

              <div className="panel p-5">
                <p className="label-eyebrow mb-4">Operação</p>
                <div className="mb-4 font-mono text-4xl font-bold text-amber">
                  {Number(driver.totalKm).toLocaleString('pt-BR')}
                  <span className="ml-1 text-base text-muted">km</span>
                </div>
                <DetailRow
                  label="Gasto com combustível"
                  value={formatCurrency(driver.fuelExpense)}
                />
                <DetailRow
                  label="Eficiência"
                  value={`${Number(driver.fuelEfficiency) || 0} km/l`}
                />
                <DetailRow
                  label="Inspeções concluídas"
                  value={String(driver.inspectionsCompleted ?? 0)}
                />
              </div>
            </div>

            <section className="panel mt-4 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="label-eyebrow">
                  Desempenho{analytics ? ` · ${analytics.period}` : ''}
                </p>
                {analyticsQuery.isFetching && (
                  <span className="font-mono text-xs text-muted">Atualizando…</span>
                )}
              </div>
              {analyticsQuery.isError ? (
                <p className="text-sm text-muted">
                  Não foi possível carregar o desempenho.
                </p>
              ) : !analytics ? (
                <p className="text-sm text-muted">Carregando desempenho…</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div>
                    <div className="label-eyebrow">Inspeções no período</div>
                    <div className="mt-2 font-mono text-3xl font-bold text-amber">
                      {analytics.inspectionsCompleted}
                    </div>
                  </div>
                  <div>
                    <div className="label-eyebrow">Total de inspeções</div>
                    <div className="mt-2 font-mono text-3xl font-bold">
                      {analytics.inspectionsCompletedTotal}
                    </div>
                  </div>
                  <div>
                    <div className="label-eyebrow">Tempo médio</div>
                    <div className="mt-2 font-mono text-3xl font-bold">
                      {analytics.avgInspectionTime}
                      <span className="ml-1 text-base text-muted">min</span>
                    </div>
                  </div>
                  <div>
                    <div className="label-eyebrow">Qualidade</div>
                    <div className="mt-2 font-mono text-3xl font-bold">
                      {analytics.qualityScore}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
