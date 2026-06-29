import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '@/lib/api';

interface Driver {
  id: string;
  name: string;
  cnh: string;
  phone?: string | null;
  email?: string | null;
  totalKm: number | string;
  inspectionQualityScore: number | string;
  inspectionsCompleted: number;
  isActive?: boolean;
}

function qualityClasses(score: number): string {
  if (score >= 4.5) return 'border-green-500/30 bg-green-500/10 text-green-300';
  if (score >= 3.5) return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  return 'border-red-500/30 bg-red-500/10 text-red-300';
}

export default function DriversPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const res = await driversApi.getAll();
      return res.data as { total: number; drivers: Driver[] };
    },
  });

  const drivers = data?.drivers ?? [];

  return (
    <>
      <Head>
        <title>Motoristas — BRAVIX Frota</title>
      </Head>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <Link href="/" className="font-mono text-xs text-amber hover:underline">
              ← painel
            </Link>
            <p className="label-eyebrow mb-1 mt-3">Equipe</p>
            <h1 className="text-4xl font-extrabold">Motoristas</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="btn-ghost text-sm"
            >
              {isFetching ? 'Atualizando…' : '↻ Atualizar'}
            </button>
            <Link href="/drivers/new" className="btn-amber text-sm">
              + Novo motorista
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="panel p-8 text-center">
            <p className="mb-4 text-red-300">Não foi possível carregar os motoristas.</p>
            <button onClick={() => refetch()} className="btn-amber">
              Tentar novamente
            </button>
          </div>
        ) : drivers.length === 0 ? (
          <div className="panel p-12 text-center text-muted">
            Nenhum motorista cadastrado.
          </div>
        ) : (
          <>
            <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {drivers.map((d) => {
                const score = Number(d.inspectionQualityScore) || 0;
                return (
                  <Link
                    key={d.id}
                    href={`/drivers/${d.id}`}
                    className="panel block p-5 transition hover:border-[var(--border-strong)] hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-lg font-bold">{d.name}</span>
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${qualityClasses(score)}`}
                      >
                        {score.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-2 font-mono text-sm tracking-wider text-muted">
                      CNH {d.cnh}
                    </div>
                    {d.isActive === false && (
                      <span className="mt-2 inline-block rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-300">
                        inativo
                      </span>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t pt-3 font-mono text-xs text-muted">
                      <span>{d.inspectionsCompleted ?? 0} inspeção(ões)</span>
                      <span>{Number(d.totalKm).toLocaleString('pt-BR')} KM</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            {data && (
              <p className="mt-6 font-mono text-xs text-muted">
                {data.total} motorista(s) na equipe
              </p>
            )}
          </>
        )}
      </main>
    </>
  );
}
