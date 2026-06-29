import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiService } from '@services/api';
import { PrimaryButton } from '@components/PrimaryButton';
import {
  REQUIRED_PHOTO_SLOTS,
  INSPECTION_TYPES,
  InspectionType,
} from '@constants/inspection';
import { useInspectionStore } from '@store/inspectionStore';
import { colors, radius, spacing } from '@constants/theme';

export default function InspectionScreen() {
  const router = useRouter();
  const { vehicleId, plate } = useLocalSearchParams<{
    vehicleId: string;
    plate?: string;
  }>();
  const { inspectionId, photos, startSession, reset } = useInspectionStore();
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<InspectionType>('pre_trip');

  const capturedCount = useMemo(
    () => REQUIRED_PHOTO_SLOTS.filter((s) => photos[s.key]).length,
    [photos],
  );
  const allCaptured = capturedCount === REQUIRED_PHOTO_SLOTS.length;
  const selectedTypeLabel = useMemo(
    () => INSPECTION_TYPES.find((t) => t.key === selectedType)?.label ?? '',
    [selectedType],
  );

  // Começa cada entrada na tela com uma sessão limpa para escolher o tipo.
  useEffect(() => {
    reset();
  }, [reset]);

  const startInspection = useCallback(async () => {
    if (!vehicleId) return;
    setError('');
    setCreating(true);
    try {
      const inspection = await apiService.createInspection({
        vehicleId,
        type: selectedType,
        inspectionType: selectedType,
      });
      startSession(vehicleId, inspection.id);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Não foi possível iniciar a inspeção.',
      );
    } finally {
      setCreating(false);
    }
  }, [vehicleId, selectedType, startSession]);

  const openCamera = (slot: (typeof REQUIRED_PHOTO_SLOTS)[number]) => {
    if (!inspectionId || !vehicleId) return;
    router.push({
      pathname: '/(app)/inspection/camera',
      params: {
        vehicleId,
        inspectionId,
        slot: slot.key,
        label: slot.label,
      },
    });
  };

  const onSubmit = async () => {
    if (!inspectionId || !allCaptured) return;
    setSubmitting(true);
    setError('');
    try {
      const localUris = REQUIRED_PHOTO_SLOTS.map((s) => photos[s.key] as string);
      // Sobe cada foto para o servidor e coleta as URLs reais
      const uploadedUrls: string[] = [];
      for (const uri of localUris) {
        uploadedUrls.push(await apiService.uploadPhoto(uri));
      }
      await apiService.addInspectionPhotos(inspectionId, uploadedUrls);
      await apiService.addInspectionSignature(
        inspectionId,
        `signed-by-mobile-${Date.now()}`,
      );
      await apiService.submitInspection(inspectionId);
      Alert.alert('Inspeção enviada', 'Registro concluído com sucesso.', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            router.replace(`/(app)/vehicles/${vehicleId}`);
          },
        },
      ]);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Falha ao enviar a inspeção.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Inspeção</Text>
        <View style={{ width: 60 }} />
      </View>

      {creating ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Iniciando inspeção…</Text>
        </View>
      ) : !inspectionId ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.plate}>{plate || 'Veículo'}</Text>
          <Text style={styles.subtitle}>Escolha o tipo de inspeção</Text>

          <View style={styles.typeList}>
            {INSPECTION_TYPES.map((t) => {
              const active = t.key === selectedType;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.typeCard, active && styles.typeCardActive]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedType(t.key)}
                >
                  <View style={styles.typeTextWrap}>
                    <Text
                      style={[styles.typeLabel, active && styles.typeLabelActive]}
                    >
                      {t.label}
                    </Text>
                    <Text style={styles.typeDesc}>{t.description}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title="Iniciar inspeção"
            onPress={startInspection}
            style={styles.submit}
          />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.plate}>{plate || 'Veículo'}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{selectedTypeLabel}</Text>
          </View>
          <Text style={styles.subtitle}>
            Capture {REQUIRED_PHOTO_SLOTS.length} fotos obrigatórias
          </Text>

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.progressValue}>
              {capturedCount}/{REQUIRED_PHOTO_SLOTS.length}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(capturedCount / REQUIRED_PHOTO_SLOTS.length) * 100}%`,
                },
              ]}
            />
          </View>

          <View style={styles.grid}>
            {REQUIRED_PHOTO_SLOTS.map((slot) => {
              const uri = photos[slot.key];
              return (
                <TouchableOpacity
                  key={slot.key}
                  style={styles.slotCard}
                  activeOpacity={0.85}
                  onPress={() => openCamera(slot)}
                >
                  {uri ? (
                    <Image source={{ uri }} style={styles.preview} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderIcon}>📷</Text>
                    </View>
                  )}
                  <Text style={styles.slotLabel}>{slot.label}</Text>
                  <Text style={styles.slotStatus}>
                    {uri ? 'Capturada · toque para refazer' : 'Toque para capturar'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title={submitting ? 'Enviando…' : 'Enviar inspeção'}
            loading={submitting}
            disabled={!allCaptured || submitting}
            onPress={onSubmit}
            style={styles.submit}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  back: { color: colors.primary, fontSize: 16, fontWeight: '600', width: 60 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: { color: colors.textMuted },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  plate: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  subtitle: { color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  typeList: { gap: spacing.md, marginBottom: spacing.lg },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  typeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  typeTextWrap: { flex: 1 },
  typeLabel: { color: colors.text, fontSize: 16, fontWeight: '700' },
  typeLabelActive: { color: colors.primary },
  typeDesc: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  typeBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressValue: { color: colors.text, fontWeight: '700' },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  grid: { gap: spacing.md },
  slotCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  preview: { width: '100%', height: 160 },
  placeholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  placeholderIcon: { fontSize: 32 },
  slotLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  slotStatus: {
    color: colors.textMuted,
    fontSize: 12,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: 2,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  submit: { marginTop: spacing.lg },
});
