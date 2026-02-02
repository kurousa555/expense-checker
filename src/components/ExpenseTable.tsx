import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ExpenseItem } from '../types';
import { COLORS, CHART_COLORS } from '../constants';

interface Props {
  expenses: ExpenseItem[];
  income: number;
}

export const ExpenseTable: React.FC<Props> = ({ expenses, income }) => {
  const validExpenses = expenses.filter(e => e.amount > 0);

  if (validExpenses.length === 0) {
    return null;
  }

  const calculatePercentage = (amount: number): string => {
    if (income === 0) return '0.0';
    return ((amount / income) * 100).toFixed(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>支出一覧</Text>
      <View style={styles.header}>
        <Text style={[styles.headerCell, styles.nameCell]}>項目名</Text>
        <Text style={[styles.headerCell, styles.amountCell]}>金額</Text>
        <Text style={[styles.headerCell, styles.percentCell]}>割合</Text>
      </View>
      <ScrollView style={styles.tableBody} nestedScrollEnabled>
        {validExpenses.map((expense, index) => (
          <View key={expense.id} style={styles.row}>
            <View style={styles.nameContainer}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: CHART_COLORS[index % CHART_COLORS.length] },
                ]}
              />
              <Text style={styles.nameCell} numberOfLines={1}>
                {expense.name}
              </Text>
            </View>
            <Text style={styles.amountCell}>
              ¥{expense.amount.toLocaleString()}
            </Text>
            <Text style={styles.percentCell}>
              {calculatePercentage(expense.amount)}%
            </Text>
          </View>
        ))}
      </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.dark,
    paddingBottom: 8,
    marginBottom: 4,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.dark,
  },
  tableBody: {
    maxHeight: 200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  nameContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  nameCell: {
    flex: 2,
    fontSize: 14,
    color: COLORS.dark,
  },
  amountCell: {
    flex: 1.5,
    fontSize: 14,
    color: COLORS.dark,
    textAlign: 'right',
  },
  percentCell: {
    flex: 1,
    fontSize: 14,
    color: COLORS.dark,
    textAlign: 'right',
  },
});
