import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { isWeb } from '../utils/platform';
import { getFontSize, getPadding } from '../utils/responsive';
import AppLogo from '../assets/app_icon/in_app_logo.svg';
import { palette, radii } from '../constants/theme';

type NavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/(project_and_research)' },
];

export const WebsiteHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (!isWeb) {
    return null; // Don't show on mobile
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.logoBlock}>
          <Pressable onPress={() => router.push('/')} style={styles.logoContainer}>
            <AppLogo width={132} height={44} />
          </Pressable>
          <Text style={styles.logoWordmark}>TernSwipe</Text>
        </View>

        <View style={styles.rightCluster}>
          <View style={styles.nav}>
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname === ''
                  : pathname?.startsWith(item.href);
              return (
                <TouchableOpacity
                  key={item.href}
                  onPress={() => {
                    if (item.isExternal) {
                      if (typeof window !== 'undefined') {
                        window.open(item.href, '_blank');
                      }
                    } else {
                      router.push(item.href as any);
                    }
                  }}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                >
                  <Text
                    style={[
                      styles.navText,
                      isActive && styles.navTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => router.push('/(auth)/login')}
                    style={styles.loginLink}
                  >
                    <Text style={styles.loginText}>Sign in</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push('/(auth)/signup')}
                    style={[styles.actionButton, styles.professorButton]}
                  >
                    <Text style={[styles.actionButtonText, styles.professorButtonText]}>
                      Sign up
                    </Text>
                  </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'sticky' as any,
    top: 0,
    zIndex: 1000,
    width: '100%',
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  header: {
    width: '100%',
    maxWidth: 1440,
    marginHorizontal: 'auto',
    paddingVertical: getPadding(10),
    paddingHorizontal: getPadding(32),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: getPadding(24),
  },
  logoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(12),
    flexShrink: 0,
  },
  logoContainer: {
    cursor: 'pointer',
  },
  logoWordmark: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: palette.text,
    letterSpacing: 0.5,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: getPadding(16),
    flexShrink: 0,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: getPadding(12),
  },
  navItem: {
    paddingVertical: getPadding(8),
    paddingHorizontal: getPadding(14),
    borderRadius: radii.pill,
  },
  navText: {
    fontSize: getFontSize(14),
    color: palette.textSubtle,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  navItemActive: {
    backgroundColor: palette.primarySoft,
  },
  navTextActive: {
    color: palette.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(10),
  },
  loginLink: {
    paddingHorizontal: getPadding(8),
    paddingVertical: getPadding(6),
  },
  loginText: {
    fontSize: getFontSize(14),
    color: palette.textSubtle,
    fontWeight: '500',
  },
  actionButton: {
    paddingVertical: getPadding(10),
    paddingHorizontal: getPadding(18),
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  actionButtonText: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.text,
  },
  studentButton: {
    backgroundColor: palette.surfaceMuted,
    borderColor: palette.border,
  },
  professorButton: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  professorButtonText: {
    color: palette.textOnPrimary,
  },
});

