import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ExpenseItem, SavedData } from './src/types';
import { DEFAULT_EXPENSES, COLORS } from './src/constants';
import { loadAllData, saveData, updateData, deleteData } from './src/utils/storage';
import { ExpenseInput } from './src/components/ExpenseInput';
import { Summary } from './src/components/Summary';
import { ExpenseChart } from './src/components/ExpenseChart';
import { ExpenseTable } from './src/components/ExpenseTable';
import { SavedDataModal } from './src/components/SavedDataModal';

export default function App() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(DEFAULT_EXPENSES);
  const [savedDataList, setSavedDataList] = useState<SavedData[]>([]);
  const [currentDataId, setCurrentDataId] = useState<string | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  // 保存データを読み込む
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    const data = await loadAllData();
    setSavedDataList(data);
  };

  // 収入の変更
  const handleIncomeChange = (text: string) => {
    const value = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    setIncome(value);
  };

  // 支出項目の更新
  const handleExpenseUpdate = useCallback((id: string, name: string, amount: number) => {
    setExpenses(prev =>
      prev.map(item =>
        item.id === id ? { ...item, name, amount } : item
      )
    );
  }, []);

  // 支出項目の削除
  const handleExpenseDelete = useCallback((id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
  }, []);

  // 支出項目の追加
  const handleAddExpense = () => {
    const newId = Date.now().toString();
    setExpenses(prev => [
      ...prev,
      { id: newId, name: '', amount: 0 },
    ]);
  };

  // 支出合計を計算
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  // データを新規保存
  const handleSave = async () => {
    if (savedDataList.length >= 10 && !currentDataId) {
      Alert.alert('保存エラー', '保存件数が上限（10件）に達しています');
      return;
    }
    setShowSaveInput(true);
  };

  const confirmSave = async () => {
    if (!saveName || saveName.trim() === '') {
      Alert.alert('エラー', '名前を入力してください');
      return;
    }
    try {
      const saved = await saveData({
        name: saveName.trim(),
        income,
        expenses,
      });
      if (saved) {
        setCurrentDataId(saved.id);
        await loadSavedData();
        Alert.alert('保存完了', 'データを保存しました');
        setShowSaveInput(false);
        setSaveName('');
      }
    } catch (e) {
      Alert.alert('エラー', 'データの保存に失敗しました');
    }
  };

  // 現在のデータを上書き保存
  const handleOverwrite = async () => {
    if (!currentDataId) return;

    Alert.alert(
      '上書き保存',
      '現在のデータを上書き保存しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '上書き',
          onPress: async () => {
            try {
              await updateData(currentDataId, { income, expenses });
              await loadSavedData();
              Alert.alert('保存完了', 'データを上書き保存しました');
            } catch (e) {
              Alert.alert('エラー', 'データの保存に失敗しました');
            }
          },
        },
      ]
    );
  };

  // 保存データを読み込む
  const handleLoadData = (data: SavedData) => {
    setIncome(data.income);
    setExpenses(data.expenses);
    setCurrentDataId(data.id);
    setShowSavedModal(false);
  };

  // 保存データを削除
  const handleDeleteSavedData = async (id: string) => {
    try {
      await deleteData(id);
      await loadSavedData();
      if (currentDataId === id) {
        setCurrentDataId(null);
      }
    } catch (e) {
      Alert.alert('エラー', 'データの削除に失敗しました');
    }
  };

  // 新規作成（リセット）
  const handleReset = () => {
    Alert.alert(
      '新規作成',
      '現在の入力内容をリセットして新規作成しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '新規作成',
          onPress: () => {
            setIncome(0);
            setExpenses(DEFAULT_EXPENSES);
            setCurrentDataId(null);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.title}>生活費内訳チェッカー</Text>
          </View>

          {/* ボタン群 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
              <Text style={styles.actionButtonText}>新規</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowSavedModal(true)}>
              <Text style={styles.actionButtonText}>読込</Text>
            </TouchableOpacity>
            {currentDataId ? (
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleOverwrite}>
                <Text style={styles.saveButtonText}>上書き保存</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>新規保存</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 保存名入力 */}
          {showSaveInput && (
            <View style={styles.saveInputContainer}>
              <Text style={styles.saveInputLabel}>保存名を入力:</Text>
              <TextInput
                style={styles.saveNameInput}
                value={saveName}
                onChangeText={setSaveName}
                placeholder="例: 2024年1月"
                placeholderTextColor={COLORS.secondary}
              />
              <View style={styles.saveInputButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowSaveInput(false);
                    setSaveName('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmSave}>
                  <Text style={styles.confirmButtonText}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 収入入力 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>収入</Text>
            <View style={styles.incomeRow}>
              <Text style={styles.incomeLabel}>手取り収入</Text>
              <TextInput
                style={styles.incomeInput}
                value={income > 0 ? income.toLocaleString() : ''}
                onChangeText={handleIncomeChange}
                placeholder="0"
                placeholderTextColor={COLORS.secondary}
                keyboardType="numeric"
              />
              <Text style={styles.yen}>円</Text>
            </View>
          </View>

          {/* サマリー */}
          <Summary income={income} totalExpenses={totalExpenses} />

          {/* 円グラフ */}
          <ExpenseChart expenses={expenses} income={income} />

          {/* 支出一覧テーブル */}
          <ExpenseTable expenses={expenses} income={income} />

          {/* 支出入力 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>支出入力</Text>
            {expenses.map(item => (
              <ExpenseInput
                key={item.id}
                item={item}
                onUpdate={handleExpenseUpdate}
                onDelete={handleExpenseDelete}
              />
            ))}
            <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
              <Text style={styles.addButtonText}>+ 項目を追加</Text>
            </TouchableOpacity>
          </View>

          {/* 広告スペース（非操作領域） */}
          <View style={styles.adSpace}>
            <Text style={styles.adPlaceholder}>広告スペース</Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 保存データモーダル */}
      <SavedDataModal
        visible={showSavedModal}
        savedDataList={savedDataList}
        onClose={() => setShowSavedModal(false)}
        onLoad={handleLoadData}
        onDelete={handleDeleteSavedData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  saveInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveInputLabel: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 8,
  },
  saveNameInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveInputButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 12,
  },
  incomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeLabel: {
    fontSize: 16,
    color: COLORS.dark,
    marginRight: 12,
  },
  incomeInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    textAlign: 'right',
  },
  yen: {
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.dark,
  },
  addButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  adSpace: {
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 40,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adPlaceholder: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  bottomPadding: {
    height: 40,
  },
});
