import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { isWeb } from '../utils/platform';
import { getPadding } from '../utils/responsive';
import { WebsiteHeader } from './WebsiteHeader';
import { palette, layout } from '../constants/theme';

interface WebsiteLayoutProps {
  children: React.ReactNode;
  maxWidth?: number | 'fluid';
  backgroundColor?: string;
  showHeader?: boolean;
}

export const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({
  children,
  maxWidth = 'fluid',
  backgroundColor = palette.background,
  showHeader = true,
}) => {
  const resolvedMaxWidth = maxWidth === 'fluid' ? undefined : maxWidth ?? layout.maxWidth;

  if (isWeb) {
    return (
      <View style={[styles.root, { backgroundColor }]}> 
        {showHeader && <WebsiteHeader />}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.inner, resolvedMaxWidth ? { maxWidth: resolvedMaxWidth } : null]}>
            {children}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.mobileContainer}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    display: isWeb ? 'flex' : undefined,
    flexDirection: 'column',
    backgroundColor: palette.background,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'stretch',
    paddingBottom: getPadding(64),
    paddingTop: getPadding(32),
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: getPadding(32),
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: palette.surface,
  },
});

