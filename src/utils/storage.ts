import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedData } from '../types';

const STORAGE_KEY = 'expense_checker_data';
const MAX_SAVED_ITEMS = 10;

// 保存データ一覧を取得
export const loadAllData = async (): Promise<SavedData[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue === null) {
      return [];
    }
    return JSON.parse(jsonValue);
  } catch (e) {
    console.error('データ読み込みエラー:', e);
    return [];
  }
};

// データを保存
export const saveData = async (data: Omit<SavedData, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedData | null> => {
  try {
    const existingData = await loadAllData();

    if (existingData.length >= MAX_SAVED_ITEMS) {
      throw new Error('保存件数が上限（10件）に達しています');
    }

    const newData: SavedData = {
      ...data,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedData = [...existingData, newData];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    return newData;
  } catch (e) {
    console.error('データ保存エラー:', e);
    throw e;
  }
};

// データを更新
export const updateData = async (id: string, data: Partial<Omit<SavedData, 'id' | 'createdAt'>>): Promise<SavedData | null> => {
  try {
    const existingData = await loadAllData();
    const index = existingData.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error('データが見つかりません');
    }

    const updatedItem: SavedData = {
      ...existingData[index],
      ...data,
      updatedAt: Date.now(),
    };

    existingData[index] = updatedItem;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

    return updatedItem;
  } catch (e) {
    console.error('データ更新エラー:', e);
    throw e;
  }
};

// データを削除
export const deleteData = async (id: string): Promise<boolean> => {
  try {
    const existingData = await loadAllData();
    const filteredData = existingData.filter(item => item.id !== id);

    if (filteredData.length === existingData.length) {
      throw new Error('データが見つかりません');
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return true;
  } catch (e) {
    console.error('データ削除エラー:', e);
    throw e;
  }
};

// 保存件数を取得
export const getSavedCount = async (): Promise<number> => {
  const data = await loadAllData();
  return data.length;
};
