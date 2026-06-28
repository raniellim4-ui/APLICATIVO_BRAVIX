import { InspectionPhoto } from '@/types';

export type PhotoSlot = InspectionPhoto['type'];

export const REQUIRED_PHOTO_SLOTS: { key: PhotoSlot; label: string }[] = [
  { key: 'front', label: 'Frente' },
  { key: 'rear', label: 'Traseira' },
  { key: 'left_side', label: 'Lateral esquerda' },
  { key: 'right_side', label: 'Lateral direita' },
  { key: 'tire', label: 'Pneus' },
  { key: 'dashboard', label: 'Painel' },
];
