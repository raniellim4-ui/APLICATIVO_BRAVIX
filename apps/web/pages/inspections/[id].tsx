import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { inspectionsApi, vehiclesApi, assetUrl } from '@/lib/api';

interface InspectionDetail {
  id: string;
  vehicleId: string;
  driverId: string | null;
  inspectionDate: string;
  inspectionType: string;
  status: string;
  totalPhotos: number;
  aiQualityScore: number | string;
  damageCount: number;
  odometerReading?: number | null;
  signatureDigital?: string | null;
  photos?: string[];
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

function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

export default function InspectionDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';

  const inspectionQuery = useQuery({
    queryKey: ['inspection', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await inspectionsApi.getOne(id);
      return res.data as InspectionDetail;
    },
  });

  const insp = inspectionQuery.data;

  const vehicleQuery = useQuery({
    queryKey: ['vehicle', insp?.vehicleId],
    enabled: !!insp?.vehicleId,
    queryFn: async () => {
      const res = await vehiclesApi.getOne(insp!.vehicleId);
      return res.data as Vehicle;
    },
  });

  const vehicle = vehicleQuery.data;
  const quality = Number(insp?.aiQualityScore) || 0;
  const photos = insp?.photos ?? [];

  return (
    <>
      <Head>
        <title>Inspeção — BRAVIX Fleet</title>
      </Head>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/inspections"
          className="font-mono text-xs text-amber hover:underline"
        >
          ← inspeções
        </Link>

        {inspectionQuery.isLoading ? (
          <div className="flex justify-center py-24">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          </div>
        ) : inspectionQuery.isError || !insp ? (
          <div className="panel mt-8 p-8 text-center">
            <p className="mb-4 text-red-300">Inspeção não encontrada.</p>
            <Link href="/inspections" className="btn-amber">
              Voltar à lista
            </Link>
          </div>
        ) : (
          <div className="stagger mt-6">
            <div className="mb-8">
              <p className="label-eyebrow mb-1">Detalhe da inspeção</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-extrabold">
                  {typeLabels[insp.inspectionType] ?? insp.inspectionType}
                </h1>
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-bold ${statusClasses(insp.status)}`}
                >
                  {statusLabels[insp.status] ?? insp.status}
                </span>
              </div>
              {vehicle && (
                <p className="mt-2 text-sm text-muted">
                  Veículo{' '}
                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="font-mono font-bold tracking-widest text-amber hover:underline"
                  >
                    {vehicle.plate}
                  </Link>{' '}
                  · {vehicle.make} {vehicle.model}
                </p>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="panel p-5 lg:col-span-1">
                <p className="label-eyebrow mb-4">Resumo</p>
                <DetailRow label="Data" value={formatDateTime(insp.inspectionDate)} />
                <DetailRow label="Fotos" value={String(insp.totalPhotos)} />
                <DetailRow
                  label="Qualidade IA"
                  value={quality > 0 ? `${Math.round(quality * 100)}%` : '—'}
                />
                <DetailRow label="Danos" value={String(insp.damageCount ?? 0)} />
                <DetailRow
                  label="Odômetro"
                  value={
                    insp.odometerReading != null
                      ? `${Number(insp.odometerReading).toLocaleString('pt-BR')} km`
                      : '—'
                  }
                />
                <DetailRow
                  label="Assinatura"
                  value={insp.signatureDigital ? 'Registrada' : '—'}
                />
              </div>

              <section className="panel p-5 lg:col-span-2">
                <p className="label-eyebrow mb-4">
                  Fotos {photos.length > 0 && `(${photos.length})`}
                </p>
                {photos.length === 0 ? (
                  <p className="text-sm text-muted">Nenhuma foto registrada.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photos.map((p, i) => {
                      const src = assetUrl(p);
                      return (
                        <div
                          key={i}
                          className="aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[#0d0f13]"
                        >
                          {src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={src}
                              alt={`Foto ${i + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center p-2 text-center">
                              <span className="text-2xl">📷</span>
                              <span className="mt-1 text-[10px] text-muted">
                                foto local do device
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
