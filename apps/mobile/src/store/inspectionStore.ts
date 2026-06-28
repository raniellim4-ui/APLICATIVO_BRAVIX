import { create } from 'zustand';
import { PhotoSlot } from '@constants/inspection';

interface InspectionState {
  inspectionId: string | null;
  vehicleId: string | null;
  photos: Partial<Record<PhotoSlot, string>>;
  startSession: (vehicleId: string, inspectionId: string) => void;
  setPhoto: (slot: PhotoSlot, uri: string) => void;
  reset: () => void;
}

export const useInspectionStore = create<InspectionState>((set) => ({
  inspectionId: null,
  vehicleId: null,
  photos: {},
  startSession: (vehicleId, inspectionId) =>
    set({ vehicleId, inspectionId, photos: {} }),
  setPhoto: (slot, uri) =>
    set((state) => ({ photos: { ...state.photos, [slot]: uri } })),
  reset: () => set({ inspectionId: null, vehicleId: null, photos: {} }),
}));
