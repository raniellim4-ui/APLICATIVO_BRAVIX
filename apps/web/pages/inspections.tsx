import Head from 'next/head';
import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { inspectionsApi, vehiclesApi } from '@/lib/api';

interface Inspection {
  id: string;
  vehicleId: string;
  driverId: string | null;
  inspectionDate: string;
  inspectionType: string;
  status: string;
  totalPhotos: number;
  aiQualityScore: number | string;
  damageCount: number;
}

interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
}

const typeLabels: Record<string, string> = {
  pre_trip: 'Pré-viagem',
  post_trip: 'Pós-viagem',
  periodic: 'Periódica',
  maintenance_check: 'Manutenção',
};

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  completed: 'Concluída',
  reviewed: 'Revisada',
  approved: 'Aprovada',
};

function statusClasses(status: string): string {
  switch (status) {
    case 'approved':
    case 'completed':
      return 'border-green-500/30 bg-green-500/10 text-green-300';
    case 'reviewed':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    default:
      return 'border-white/15 bg-white/5 text-muted';
  }
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function InspectionsPage() {
  const router = useRouter();
  const inspectionsQuery = useQuery({
    queryKey: ['inspections'],
    queryFn: async () => {
      const res = await inspectionsApi.getAll();
      return res.data as { total: number; inspections: Inspection[] };
    },
  });

  const vehiclesQuery = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await vehiclesApi.getAll();
      return res.data as { total: number; vehicles: Vehicle[] };
    },
  });

  const vehicleMap = useMemo(() => {
    const map = new Map<string, Vehicle>();
    (vehiclesQuery.data?.vehicles ?? []).forEach((v) => map.set(v.id, v));
    return map;
  }, [vehiclesQuery.data]);

  const inspections = inspectionsQuery.data?.inspections ?? [];
  const isLoading = inspectionsQuery.isLoading;
  const isError = inspectionsQuery.isError;
  const isFetching = inspectionsQuery.isFetching;

  return (
    <>
      <Head>
        <title>Inspeções — BRAVIX Fleet</title>
      </Head>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <Link href="/" className="font-mono text-xs text-amber hover:underline">
              ← dashboard
            </Link>
            <p className="label-eyebrow mb-1 mt-3">Operações</p>
            <h1 className="text-4xl font-extrabold">Inspeções</h1>
          </div>
          <button
            onClick={() => inspectionsQuery.refetch()}
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
            <p className="mb-4 text-red-300">
              Não foi possível carregar as inspeções.
            </p>
            <button onClick={() => inspectionsQuery.refetch()} className="btn-amber">
              Tentar novamente
            </button>
          </div>
        ) : inspections.length === 0 ? (
          <div className="panel p-12 text-center text-muted">
            Nenhuma inspeção registrada ainda. Use o app mobile para iniciar uma
            inspeção.
          </div>
        ) : (
          <>
            <div className="panel overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="label-eyebrow border-b text-left">
                    <th className="px-5 py-3 font-semibold">Veículo</th>
                    <th className="px-5 py-3 font-semibold">Tipo</th>
                    <th className="px-5 py-3 font-semibold">Data</th>
                    <th className="px-5 py-3 text-center font-semibold">Fotos</th>
                    <th className="px-5 py-3 text-center font-semibold">Qualidade</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((insp) => {
                    const vehicle = vehicleMap.get(insp.vehicleId);
                    const quality = Number(insp.aiQualityScore) || 0;
                    return (
                      <tr
                        key={insp.id}
                        onClick={() => router.push(`/inspections/${insp.id}`)}
                        className="cursor-pointer border-b border-[var(--border)] transition last:border-0 hover:bg-white/[0.03]"
                      >
                        <td className="px-5 py-4">
                          {vehicle ? (
                            <span className="font-mono font-bold tracking-widest text-amber">
                              {vehicle.plate}
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-muted">
                              {insp.vehicleId.slice(0, 8)}…
                            </span>
                          )}
                          {vehicle && (
                            <div className="mt-0.5 text-xs text-muted">
                              {vehicle.make} {vehicle.model}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {typeLabels[insp.inspectionType] ?? insp.inspectionType}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-muted">
                          {formatDate(insp.inspectionDate)}
                        </td>
                        <td className="px-5 py-4 text-center font-mono">
                          {insp.totalPhotos}
                        </td>
                        <td className="px-5 py-4 text-center font-mono">
                          {quality > 0 ? `${Math.round(quality * 100)}%` : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-xs font-bold ${statusClasses(insp.status)}`}
                          >
                            {statusLabels[insp.status] ?? insp.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-6 font-mono text-xs text-muted">
              {inspectionsQuery.data?.total} inspeção(ões) registrada(s)
            </p>
          </>
        )}
      </main>
    </>
  );
}
