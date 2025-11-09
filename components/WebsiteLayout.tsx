import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { isWeb } from '../utils/platform';
import { getMaxWidth, getPadding } from '../utils/responsive';
import { WebsiteHeader } from './WebsiteHeader';

interface WebsiteLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
  backgroundColor?: string;
  showHeader?: boolean;
}

export const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({
  children,
  maxWidth,
  backgroundColor = '#f5f7fa',
  showHeader = true,
}) => {
  const containerMaxWidth = maxWidth || getMaxWidth();

  if (isWeb) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        {showHeader && <WebsiteHeader />}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  // Mobile layout
  return (
    <View style={styles.mobileContainer}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    display: isWeb ? 'flex' : undefined,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  mobileContainer: {
    flex: 1,
  },
});

