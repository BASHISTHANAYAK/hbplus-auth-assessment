import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

interface AlertBannerProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  message,
  type = 'error',
  onDismiss,
}) => {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? colors.errorBackground : colors.warningBackground;
  const borderColor = isError ? colors.errorBorder : colors.warning;
  const textColor = isError ? colors.error : '#B45309';
  const iconName = isError ? 'alert-circle' : 'warning';
  const iconColor = isError ? colors.error : '#D97706';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, borderColor: borderColor },
      ]}
      accessibilityRole="alert"
    >
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      </View>
      {onDismiss ? (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissButton}
          accessibilityLabel="Dismiss error"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={18} color={textColor} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginVertical: spacing.sm,
    width: '100%',
    maxWidth: 420,
  },
  iconContainer: {
    marginRight: spacing.sm + 2,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  dismissButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
    alignSelf: 'flex-start',
  },
});
