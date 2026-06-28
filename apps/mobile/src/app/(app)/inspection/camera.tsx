import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useInspectionStore } from '@store/inspectionStore';
import { PhotoSlot } from '@constants/inspection';
import { colors, radius, spacing } from '@constants/theme';

export default function InspectionCameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<Camera>(null);
  const { slot, label } = useLocalSearchParams<{
    slot: PhotoSlot;
    label: string;
  }>();
  const setPhoto = useInspectionStore((s) => s.setPhoto);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const onCapture = useCallback(async () => {
    if (!cameraRef.current || !slot || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });
      if (photo?.uri) {
        setPhoto(slot, photo.uri);
        router.back();
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível capturar a foto.');
    } finally {
      setCapturing(false);
    }
  }, [slot, capturing, setPhoto, router]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Permissão de câmera necessária para inspeções.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.link}>
          <Text style={styles.linkText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={CameraType.back}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
              <Text style={styles.back}>‹ Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.slotLabel}>{label || slot}</Text>
            <View style={{ width: 72 }} />
          </View>

          <View style={styles.frameHint}>
            <View style={styles.frame} />
            <Text style={styles.hint}>Enquadre o veículo e capture</Text>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.shutter, capturing && styles.shutterDisabled]}
              onPress={onCapture}
              disabled={capturing}
            >
              {capturing ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <View style={styles.shutterInner} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  back: { color: colors.primary, fontSize: 16, fontWeight: '600', width: 72 },
  slotLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  frameHint: { alignItems: 'center', gap: spacing.md },
  frame: {
    width: '78%',
    aspectRatio: 4 / 3,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: 'transparent',
  },
  hint: { color: '#fff', fontSize: 14, opacity: 0.85 },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: spacing.xl * 2,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDisabled: { opacity: 0.6 },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  message: { color: colors.text, textAlign: 'center', fontSize: 16 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  buttonText: { color: colors.onPrimary, fontWeight: '700' },
  link: { marginTop: spacing.sm },
  linkText: { color: colors.textMuted },
});
