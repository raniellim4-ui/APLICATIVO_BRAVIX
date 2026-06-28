import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '@/lib/api';

interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  currentKm: number;
  healthScore: number | string;
}

function healthClasses(score: number): string {
  if (score >= 85) return 'border-green-500/30 bg-green-500/10 text-green-300';
  if (score >= 70) return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  return 'border-red-500/30 bg-red-500/10 text-red-300';
}

export default function VehiclesPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await vehiclesApi.getAll();
      return res.data as { total: number; vehicles: Vehicle[] };
    },
  });

  const vehicles = data?.vehicles ?? [];

  return (
    <>
      <Head>
        <title>Veículos — BRAVIX Fleet</title>
      </Head>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <Link href="/" className="font-mono text-xs text-amber hover:underline">
              ← dashboard
            </Link>
            <p className="label-eyebrow mb-1 mt-3">Frota</p>
            <h1 className="text-4xl font-extrabold">Veículos</h1>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-ghost text-sm"
          >
            {isFetching ? 'Atualizando…' : '↻ Atualizar'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="panel p-8 text-center">
            <p className="mb-4 text-red-300">Não foi possível carregar os veículos.</p>
            <button onClick={() => refetch()} className="btn-amber">
              Tentar novamente
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="panel p-12 text-center text-muted">
            Nenhum veículo cadastrado.
          </div>
        ) : (
          <>
            <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => {
                const score = Number(v.healthScore) || 0;
                return (
                  <Link
                    key={v.id}
                    href={`/vehicles/${v.id}`}
                    className="panel block p-5 transition hover:border-[var(--border-strong)] hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-bold tracking-widest">
                        {v.plate}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${healthClasses(score)}`}
                      >
                        {score.toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-3 font-display text-lg font-bold">
                      {v.make}
                    </div>
                    <div className="text-sm text-muted">{v.model}</div>
                    <div className="mt-4 flex items-center justify-between border-t pt-3 font-mono text-xs text-muted">
                      <span>ANO {v.year}</span>
                      <span>{Number(v.currentKm).toLocaleString('pt-BR')} KM</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            {data && (
              <p className="mt-6 font-mono text-xs text-muted">
                {data.total} veículo(s) na frota
              </p>
            )}
          </>
        )}
      </main>
    </>
  );
}
