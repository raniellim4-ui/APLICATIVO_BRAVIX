import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { maintenanceApi, vehiclesApi } from '@/lib/api';

interface VehicleDetail {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  currentKm: number;
  healthScore: number | string;
  lastInspectionAt?: string | null;
  registrationDate?: string;
  crlvNumber?: string | null;
  renavam?: string | null;
  purchasePrice?: number | string | null;
  expectedLifespanYears?: number | null;
  isActive?: boolean;
}

interface MaintenanceAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  component: string;
  message: string;
  daysRemaining?: number;
  kmRemaining?: number;
}

function healthClasses(score: number): string {
  if (score >= 85) return 'border-green-500/30 bg-green-500/10 text-green-300';
  if (score >= 70) return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  return 'border-red-500/30 bg-red-500/10 text-red-300';
}

function alertClasses(severity: string): string {
  if (severity === 'critical') return 'border-red-500/30 bg-red-500/10 text-red-300';
  if (severity === 'warning') return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR', {
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

export default function VehicleDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';

  const vehicleQuery = useQuery({
    queryKey: ['vehicle', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await vehiclesApi.getOne(id);
      return res.data as VehicleDetail;
    },
  });

  const alertsQuery = useQuery({
    queryKey: ['vehicle-alerts', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await maintenanceApi.getAlertsByVehicle(id);
      return res.data as { alerts: MaintenanceAlert[] };
    },
  });

  const vehicle = vehicleQuery.data;
  const score = Number(vehicle?.healthScore) || 0;
  const alerts = alertsQuery.data?.alerts ?? [];

  const [deleting, setDeleting] = useState(false);
  const onDelete = async () => {
    if (!vehicle) return;
    if (
      !window.confirm(
        `Excluir o veículo ${vehicle.plate}? Esta ação não pode ser desfeita.`,
      )
    )
      return;
    setDeleting(true);
    try {
      await vehiclesApi.delete(vehicle.id);
      router.replace('/vehicles');
    } catch {
      setDeleting(false);
      window.alert('Não foi possível excluir o veículo.');
    }
  };

  return (
    <>
      <Head>
        <title>
          {vehicle ? `${vehicle.plate} — BRAVIX Fleet` : 'Veículo — BRAVIX Fleet'}
        </title>
      </Head>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/vehicles" className="font-mono text-xs text-amber hover:underline">
          ← veículos
        </Link>

        {vehicleQuery.isLoading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          </div>
        ) : vehicleQuery.isError || !vehicle ? (
          <div className="panel mt-8 p-8 text-center">
            <p className="mb-4 text-red-300">Veículo não encontrado.</p>
            <Link href="/vehicles" className="btn-amber">
              Voltar à lista
            </Link>
          </div>
        ) : (
          <div className="stagger mt-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label-eyebrow mb-1">Detalhe do veículo</p>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-mono text-4xl font-extrabold tracking-widest">
                    {vehicle.plate}
                  </h1>
                  <span
                    className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${healthClasses(score)}`}
                  >
                    {score.toFixed(0)}% saúde
                  </span>
                  {vehicle.isActive === false && (
                    <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-300">
                      inativo
                    </span>
                  )}
                </div>
                <p className="mt-2 font-display text-2xl font-bold">
                  {vehicle.make} {vehicle.model}
                </p>
                <p className="mt-1 text-sm text-muted">Ano {vehicle.year}</p>
              </div>
              <button
                onClick={onDelete}
                disabled={deleting}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
              >
                {deleting ? 'Excluindo…' : 'Excluir'}
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="panel p-5 lg:col-span-2">
                <p className="label-eyebrow mb-4">Identificação</p>
                <DetailRow label="Placa" value={vehicle.plate} />
                <DetailRow label="VIN" value={vehicle.vin || '—'} />
                <DetailRow label="CRLV" value={vehicle.crlvNumber || '—'} />
                <DetailRow label="RENAVAM" value={vehicle.renavam || '—'} />
                <DetailRow
                  label="Registro"
                  value={formatDate(vehicle.registrationDate)}
                />
              </div>

              <div className="panel p-5">
                <p className="label-eyebrow mb-4">Operação</p>
                <div className="mb-4 font-mono text-4xl font-bold text-amber">
                  {Number(vehicle.currentKm).toLocaleString('pt-BR')}
                  <span className="ml-1 text-base text-muted">km</span>
                </div>
                <DetailRow
                  label="Última inspeção"
                  value={formatDate(vehicle.lastInspectionAt)}
                />
                <DetailRow
                  label="Valor de aquisição"
                  value={formatCurrency(vehicle.purchasePrice)}
                />
                <DetailRow
                  label="Vida útil prevista"
                  value={
                    vehicle.expectedLifespanYears
                      ? `${vehicle.expectedLifespanYears} anos`
                      : '—'
                  }
                />
              </div>
            </div>

            <section className="panel mt-4 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="label-eyebrow">Alertas de manutenção</p>
                {alertsQuery.isFetching && (
                  <span className="font-mono text-xs text-muted">Atualizando…</span>
                )}
              </div>
              {alertsQuery.isError ? (
                <p className="text-sm text-muted">
                  Não foi possível carregar os alertas.
                </p>
              ) : alerts.length === 0 ? (
                <p className="text-sm text-muted">Nenhum alerta pendente.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-lg border p-4 ${alertClasses(alert.severity)}`}
                    >
                      <div className="font-mono text-xs uppercase tracking-wider opacity-80">
                        {alert.component}
                      </div>
                      <p className="mt-2 text-sm">{alert.message}</p>
                      {(alert.kmRemaining != null || alert.daysRemaining != null) && (
                        <p className="mt-2 font-mono text-xs opacity-80">
                          {alert.kmRemaining != null &&
                            `${Number(alert.kmRemaining).toLocaleString('pt-BR')} km`}
                          {alert.kmRemaining != null && alert.daysRemaining != null && ' · '}
                          {alert.daysRemaining != null && `${alert.daysRemaining} dias`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
