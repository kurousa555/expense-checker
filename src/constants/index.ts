import { ExpenseItem } from '../types';

// 初期表示される支出項目
export const DEFAULT_EXPENSES: ExpenseItem[] = [
  { id: '1', name: 'お小遣い', amount: 0 },
  { id: '2', name: '奨学金', amount: 0 },
  { id: '3', name: '家賃', amount: 0 },
  { id: '4', name: '自由食費', amount: 0 },
  { id: '5', name: '水道光熱費', amount: 0 },
  { id: '6', name: '通信費', amount: 0 },
  { id: '7', name: 'iDeCo', amount: 0 },
  { id: '8', name: 'NISA', amount: 0 },
  { id: '9', name: 'その他', amount: 0 },
];

// 色の設定
export const COLORS = {
  primary: '#4A90D9',
  secondary: '#6C757D',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  border: '#DEE2E6',
  background: '#F5F5F5',
};

// 円グラフの色
export const CHART_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#C9CBCF',
  '#7BC043',
  '#F37735',
  '#FFC425',
  '#D11141',
  '#00B159',
  '#00AEDB',
  '#F37736',
  '#EEE',
];
