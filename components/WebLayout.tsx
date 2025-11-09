import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { isWeb } from '../utils/platform';
import { getMaxWidth, getPadding } from '../utils/responsive';

interface WebLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
  padding?: number;
  backgroundColor?: string;
}

export const WebLayout: React.FC<WebLayoutProps> = ({
  children,
  maxWidth,
  padding,
  backgroundColor = '#fff',
}) => {
  const containerMaxWidth = maxWidth || getMaxWidth();
  const containerPadding = padding !== undefined ? padding : getPadding(24);

  if (isWeb) {
    return (
      <View style={[styles.webContainer, { backgroundColor }]}>
        <View
          style={[
            styles.webContent,
            {
              maxWidth: containerMaxWidth,
              paddingHorizontal: containerPadding,
            },
          ]}
        >
          {children}
        </View>
      </View>
    );
  }

  return <View style={styles.mobileContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    minHeight: '100vh',
    display: isWeb ? 'flex' : undefined,
    alignItems: isWeb ? 'center' : undefined,
  },
  webContent: {
    width: '100%',
    marginHorizontal: 'auto',
  },
  mobileContainer: {
    flex: 1,
  },
});

