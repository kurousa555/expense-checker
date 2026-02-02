import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ExpenseItem } from '../types';
import { COLORS, CHART_COLORS } from '../constants';

interface Props {
  expenses: ExpenseItem[];
  income: number;
}

const screenWidth = Dimensions.get('window').width;

export const ExpenseChart: React.FC<Props> = ({ expenses, income }) => {
  // 金額が0より大きい支出のみフィルタリング
  const validExpenses = expenses.filter(e => e.amount > 0);

  if (validExpenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>支出を入力するとグラフが表示されます</Text>
      </View>
    );
  }

  const chartData = validExpenses.map((expense, index) => ({
    name: expense.name,
    amount: expense.amount,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: COLORS.dark,
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>支出内訳</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute={false}
      />
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 32,
    marginVertical: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
});
