import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { BrandLogo } from '@/components/BrandLogo';
import { vehiclesApi, inspectionsApi, maintenanceApi } from '@/lib/api';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gestor de Frota',
  driver: 'Motorista',
  mechanic: 'Mecânico',
};

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="panel p-5">
      <div className="label-eyebrow">{label}</div>
      <div
        className={`mt-3 font-mono text-4xl font-bold ${accent ? 'text-amber' : ''}`}
      >
        {value}
      </div>
      <div className="mt-2 text-xs text-muted">{hint}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await vehiclesApi.getAll();
      return res.data as { total: number; vehicles: any[] };
    },
  });

  const { data: inspData } = useQuery({
    queryKey: ['inspections'],
    queryFn: async () => {
      const res = await inspectionsApi.getAll();
      return res.data as { total: number; inspections: any[] };
    },
  });

  const { data: maintData } = useQuery({
    queryKey: ['maintenance-alerts'],
    queryFn: async () => {
      const res = await maintenanceApi.getAllAlerts();
      return res.data as {
        total: number;
        criticalAlerts: number;
        warningAlerts: number;
        infoAlerts: number;
      };
    },
  });

  const onLogout = () => {
    logout();
    router.replace('/login');
  };

  const total = data?.total;
  const avgHealth =
    data && data.vehicles.length
      ? Math.round(
          data.vehicles.reduce((s, v) => s + (Number(v.healthScore) || 0), 0) /
            data.vehicles.length,
        )
      : undefined;

  const inspTotal = inspData?.total;
  const inspCompleted = inspData?.inspections.filter(
    (i) => i.status === 'completed' || i.status === 'approved',
  ).length;

  const maintTotal = maintData?.total;
  const maintCritical = maintData?.criticalAlerts;

  return (
    <>
      <Head>
        <title>Painel — BRAVIX Fleet</title>
        <meta name="description" content="Fleet management control room" />
      </Head>

      <header className="sticky top-0 z-10 border-b bg-[var(--bg)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo width={112} height={36} />
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-amber">
                  {roleLabels[user.role] ?? user.role}
                </div>
              </div>
            )}
            <button onClick={onLogout} className="btn-ghost text-sm">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="label-eyebrow mb-2">Centro de comando</p>
          <h1 className="text-4xl font-extrabold">
            Olá, {user?.name?.split(' ')[0] ?? 'operador'}.
          </h1>
          <p className="mt-2 text-muted">Visão geral da frota e operações.</p>
        </div>

        <div className="stagger mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat
            label="Veículos"
            value={total !== undefined ? String(total) : '—'}
            hint="na frota"
            accent
          />
          <Stat
            label="Saúde média"
            value={avgHealth !== undefined ? `${avgHealth}%` : '—'}
            hint="índice da frota"
          />
          <Stat
            label="Inspeções"
            value={inspTotal !== undefined ? String(inspTotal) : '—'}
            hint={
              inspCompleted !== undefined
                ? `${inspCompleted} concluída(s)`
                : 'registradas'
            }
          />
          <Stat
            label="Manutenções"
            value={maintTotal !== undefined ? String(maintTotal) : '—'}
            hint={
              maintCritical
                ? `${maintCritical} crítica(s)`
                : 'alertas ativos'
            }
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Link
            href="/vehicles"
            className="panel group flex items-center justify-between p-6 transition hover:border-[var(--border-strong)] hover:bg-white/[0.03]"
          >
            <div>
              <div className="font-display text-lg font-bold">Veículos</div>
              <div className="mt-1 text-sm text-muted">
                Frota cadastrada, placas e saúde
              </div>
            </div>
            <span className="text-2xl text-amber transition group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            href="/inspections"
            className="panel group flex items-center justify-between p-6 transition hover:border-[var(--border-strong)] hover:bg-white/[0.03]"
          >
            <div>
              <div className="font-display text-lg font-bold">Inspeções</div>
              <div className="mt-1 text-sm text-muted">
                Registros, fotos e qualidade
              </div>
            </div>
            <span className="text-2xl text-amber transition group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            href="/analytics"
            className="panel group flex items-center justify-between p-6 transition hover:border-[var(--border-strong)] hover:bg-white/[0.03]"
          >
            <div>
              <div className="font-display text-lg font-bold">Análises</div>
              <div className="mt-1 text-sm text-muted">
                Indicadores e conformidade da frota
              </div>
            </div>
            <span className="text-2xl text-amber transition group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </main>
    </>
  );
}
