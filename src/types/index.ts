// 支出項目の型
export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

// 保存データの型
export interface SavedData {
  id: string;
  name: string;
  income: number;
  expenses: ExpenseItem[];
  createdAt: number;
  updatedAt: number;
}

// アプリの状態の型
export interface AppState {
  income: number;
  expenses: ExpenseItem[];
}
