import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface Props {
  income: number;
  totalExpenses: number;
}

export const Summary: React.FC<Props> = ({ income, totalExpenses }) => {
  const balance = income - totalExpenses;
  const isDeficit = balance < 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>収入合計</Text>
        <Text style={styles.value}>¥{income.toLocaleString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>支出合計</Text>
        <Text style={styles.value}>¥{totalExpenses.toLocaleString()}</Text>
      </View>
      <View style={[styles.row, styles.balanceRow]}>
        <Text style={styles.label}>過不足</Text>
        <Text style={[styles.value, styles.balanceValue, isDeficit && styles.deficit]}>
          {isDeficit ? '' : '+'}¥{balance.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  balanceRow: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    color: COLORS.dark,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  balanceValue: {
    fontSize: 20,
  },
  deficit: {
    color: COLORS.danger,
  },
});
