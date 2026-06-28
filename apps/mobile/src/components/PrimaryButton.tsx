import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { colors, radius, spacing } from '@constants/theme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
}

export function PrimaryButton({
  title,
  loading,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: PrimaryButtonProps) {
  const isGhost = variant === 'ghost';
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[
        styles.button,
        isGhost && styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? colors.primary : colors.text} />
      ) : (
        <Text style={[styles.text, isGhost && styles.ghostText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  ghostText: {
    color: colors.primary,
  },
});
