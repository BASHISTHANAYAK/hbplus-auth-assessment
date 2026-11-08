import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

interface StatusBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'neutral' | 'admin';
  icon?: keyof typeof Ionicons.glyphMap;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
}) => {
  let bg = colors.badgeBg;
  let text = colors.badgeText;
  let iconColor = colors.textSecondary;

  if (variant === 'success') {
    bg = colors.successBackground;
    text = colors.accentDark;
    iconColor = colors.accent;
  } else if (variant === 'warning') {
    bg = colors.warningBackground;
    text = '#B45309';
    iconColor = '#D97706';
  } else if (variant === 'admin') {
    bg = colors.adminBadgeBg;
    text = colors.adminBadgeText;
    iconColor = '#B45309';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {icon ? (
        <Ionicons name={icon} size={13} color={iconColor} style={styles.icon} />
      ) : null}
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
