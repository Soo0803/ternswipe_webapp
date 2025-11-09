import React from 'react';
import { View, StyleSheet } from 'react-native';
import { isWeb } from '../utils/platform';
import { getPadding } from '../utils/responsive';

interface FormRowProps {
  children: React.ReactNode;
  columns?: number;
}

export const FormRow: React.FC<FormRowProps> = ({ children, columns = 2 }) => {
  if (isWeb && columns > 1) {
    return (
      <View style={[styles.row, { gap: getPadding(16) }]}>
        {React.Children.map(children, (child, index) => (
          <View key={index} style={styles.column}>
            {child}
          </View>
        ))}
      </View>
    );
  }

  return <View style={styles.singleColumn}>{children}</View>;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: isWeb ? 'wrap' : 'nowrap',
    width: '100%',
  },
  column: {
    flex: isWeb ? 1 : undefined,
    minWidth: isWeb ? 'calc(50% - 8px)' : '100%',
  },
  singleColumn: {
    width: '100%',
  },
});

