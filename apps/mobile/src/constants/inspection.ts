import { Inspection, InspectionPhoto } from '@/types';

export type PhotoSlot = InspectionPhoto['type'];

export const REQUIRED_PHOTO_SLOTS: { key: PhotoSlot; label: string }[] = [
  { key: 'front', label: 'Frente' },
  { key: 'rear', label: 'Traseira' },
  { key: 'left_side', label: 'Lateral esquerda' },
  { key: 'right_side', label: 'Lateral direita' },
  { key: 'tire', label: 'Pneus' },
  { key: 'dashboard', label: 'Painel' },
];

export type InspectionType = Inspection['inspectionType'];

export const INSPECTION_TYPES: {
  key: InspectionType;
  label: string;
  description: string;
}[] = [
  { key: 'pre_trip', label: 'Pré-viagem', description: 'Antes de iniciar a rota' },
  { key: 'post_trip', label: 'Pós-viagem', description: 'Ao final da rota' },
  { key: 'periodic', label: 'Periódica', description: 'Vistoria de rotina' },
  {
    key: 'maintenance_check',
    label: 'Manutenção',
    description: 'Verificação após serviço',
  },
];
