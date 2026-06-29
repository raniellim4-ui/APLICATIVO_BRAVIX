import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { analyticsApi, vehiclesApi } from '@/lib/api';

interface Fleet {
  period: string;
  totalVehicles: number;
  avgHealthScore: number;
  totalKmTraveled: number;
  totalFuelExpense: number;
  avgFuelEfficiency: number;
  inspectionsCompleted: number;
  maintenanceAlerts: number;
  criticalAlerts: number;
  complianceRate: number;
}

interface Vehicle {
  id: string;
  plate: string;
  healthScore: number | string;
}

function healthHex(score: number): string {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#f5a524';
  return '#ef4444';
}

function Metric({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="panel p-5">
      <div className="label-eyebrow">{label}</div>
      <div
        className={`mt-2 font-mono text-3xl font-bold ${accent ? 'text-amber' : ''}`}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}

export default function AnalyticsPage() {
  const fleetQuery = useQuery({
    queryKey: ['analytics-fleet'],
    queryFn: async () => (await analyticsApi.getFleet()).data as Fleet,
  });

  const vehiclesQuery = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () =>
      (await vehiclesApi.getAll()).data as { vehicles: Vehicle[] },
  });

  const complianceQuery = useQuery({
    queryKey: ['analytics-compliance'],
    queryFn: async () =>
      (await analyticsApi.getComplianceReport()).data as {
        inspectionCompliance: number;
        maintenanceCompliance: number;
        overallCompliance: number;
      },
  });

  const fleet = fleetQuery.data;
  const chartData = (vehiclesQuery.data?.vehicles ?? []).map((v) => ({
    plate: v.plate,
    health: Number(v.healthScore) || 0,
  }));
  const compliance = complianceQuery.data;

  const brl = (n: number) =>
    n.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });

  return (
    <>
      <Head>
        <title>Análises — BRAVIX Frota</title>
      </Head>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link href="/" className="font-mono text-xs text-amber hover:underline">
            ← painel
          </Link>
          <p className="label-eyebrow mb-1 mt-3">Inteligência da frota</p>
          <h1 className="text-4xl font-extrabold">Análises</h1>
          {fleet && (
            <p className="mt-2 text-sm text-muted">Período: {fleet.period}</p>
          )}
        </div>

        {fleetQuery.isLoading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          </div>
        ) : fleetQuery.isError || !fleet ? (
          <div className="panel p-8 text-center">
            <p className="mb-4 text-red-300">
              Não foi possível carregar as análises.
            </p>
            <button onClick={() => fleetQuery.refetch()} className="btn-amber">
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="stagger space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Metric
                label="Veículos"
                value={String(fleet.totalVehicles)}
                hint="na frota"
                accent
              />
              <Metric
                label="Saúde média"
                value={`${fleet.avgHealthScore}%`}
                hint="índice da frota"
              />
              <Metric
                label="KM total"
                value={fleet.totalKmTraveled.toLocaleString('pt-BR')}
                hint="rodados"
              />
              <Metric
                label="Combustível"
                value={brl(fleet.totalFuelExpense)}
                hint={`${fleet.avgFuelEfficiency} km/l médio`}
              />
              <Metric
                label="Inspeções"
                value={String(fleet.inspectionsCompleted)}
                hint="concluídas no período"
              />
              <Metric
                label="Alertas manut."
                value={String(fleet.maintenanceAlerts)}
                hint={`${fleet.criticalAlerts} crítico(s)`}
              />
              <Metric
                label="Compliance"
                value={`${fleet.complianceRate}%`}
                hint="veículos saudáveis"
              />
              <Metric
                label="Eficiência"
                value={`${fleet.avgFuelEfficiency}`}
                hint="km/l (média)"
              />
            </div>

            <div className="panel p-5">
              <p className="label-eyebrow mb-4">Saúde por veículo</p>
              {chartData.length === 0 ? (
                <p className="text-sm text-muted">Sem dados de veículos.</p>
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
                    >
                      <XAxis
                        dataKey="plate"
                        tick={{ fill: '#8b919e', fontSize: 11 }}
                        axisLine={{ stroke: '#23262f' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: '#8b919e', fontSize: 11 }}
                        axisLine={{ stroke: '#23262f' }}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        contentStyle={{
                          background: '#161922',
                          border: '1px solid #2e323d',
                          borderRadius: 8,
                          color: '#e9ebf0',
                        }}
                        formatter={(v: any) => [`${v}%`, 'Saúde']}
                      />
                      <Bar dataKey="health" radius={[4, 4, 0, 0]}>
                        {chartData.map((d, i) => (
                          <Cell key={i} fill={healthHex(d.health)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="panel p-5">
              <p className="label-eyebrow mb-4">Conformidade</p>
              {compliance ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { l: 'Inspeções', v: compliance.inspectionCompliance },
                    { l: 'Manutenção', v: compliance.maintenanceCompliance },
                    { l: 'Geral', v: compliance.overallCompliance },
                  ].map((row) => (
                    <div key={row.l}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted">{row.l}</span>
                        <span className="font-mono font-bold">{row.v}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
                        <div
                          className="h-full rounded-full bg-[var(--amber)]"
                          style={{ width: `${row.v}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">Carregando conformidade…</p>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
