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
  if (score >= 85) return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
  if (score >= 70) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
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
        <title>Veículos - Vehicle Inspection</title>
      </Head>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                href="/"
                className="text-sm text-blue-600 hover:underline"
              >
                ‹ Voltar ao dashboard
              </Link>
              <h1 className="text-3xl font-bold mt-1">Veículos</h1>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-60"
            >
              {isFetching ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : isError ? (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/40 p-6 text-center">
              <p className="text-red-700 dark:text-red-300 mb-3">
                Não foi possível carregar os veículos.
              </p>
              <button
                onClick={() => refetch()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="rounded-lg bg-white dark:bg-slate-900 p-10 text-center text-slate-500">
              Nenhum veículo cadastrado.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Placa</th>
                    <th className="px-4 py-3 font-semibold">Marca / Modelo</th>
                    <th className="px-4 py-3 font-semibold">Ano</th>
                    <th className="px-4 py-3 font-semibold">KM atual</th>
                    <th className="px-4 py-3 font-semibold">Saúde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {vehicles.map((v) => {
                    const score = Number(v.healthScore) || 0;
                    return (
                      <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-semibold tracking-wide">{v.plate}</td>
                        <td className="px-4 py-3">
                          {v.make} {v.model}
                        </td>
                        <td className="px-4 py-3">{v.year}</td>
                        <td className="px-4 py-3">
                          {Number(v.currentKm).toLocaleString('pt-BR')} km
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${healthClasses(score)}`}
                          >
                            {score.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {data && (
            <p className="mt-4 text-sm text-slate-500">
              Total: {data.total} veículo(s)
            </p>
          )}
        </div>
      </main>
    </>
  );
}
