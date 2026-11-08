import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AuthUser } from '../types/auth';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { StatusBadge } from './StatusBadge';

interface UserProfileCardProps {
  user: AuthUser;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const getInitials = (name: string | null): string => {
    if (!name) return 'HB';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.card}>
      {/* Avatar Header */}
      <View style={styles.headerRow}>
        {user.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.avatar}
            accessibilityLabel={`${user.displayName || 'User'}'s profile picture`}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{getInitials(user.displayName)}</Text>
          </View>
        )}

        <View style={styles.userMeta}>
          <Text style={styles.userName}>{user.displayName || 'Authorized Employee'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.badgeRow}>
            <StatusBadge
              label="Authorized Access"
              variant="success"
              icon="shield-checkmark"
            />
            {user.role === 'admin' ? (
              <StatusBadge label="Admin" variant="admin" icon="star" />
            ) : (
              <StatusBadge label="Employee" variant="neutral" icon="person" />
            )}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Details Table */}
      <View style={styles.detailList}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Authentication Provider</Text>
          <Text style={styles.detailValue}>Google OAuth 2.0</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email Verification</Text>
          <Text style={[styles.detailValue, { color: colors.accentDark }]}>
            Verified Google Account ✓
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Organization Domain</Text>
          <Text style={styles.detailValue}>@{user.domain || 'hbplus.fit'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Access Status</Text>
          <Text style={[styles.detailValue, { color: colors.accentDark }]}>
            Active & Compliant
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    width: '100%',
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.xs + 2,
    flexWrap: 'wrap',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  detailList: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
