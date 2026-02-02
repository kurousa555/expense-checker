import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SavedData } from '../types';
import { COLORS } from '../constants';

interface Props {
  visible: boolean;
  savedDataList: SavedData[];
  onClose: () => void;
  onLoad: (data: SavedData) => void;
  onDelete: (id: string) => void;
}

export const SavedDataModal: React.FC<Props> = ({
  visible,
  savedDataList,
  onClose,
  onLoad,
  onDelete,
}) => {
  const handleDelete = (item: SavedData) => {
    Alert.alert(
      '削除確認',
      `「${item.name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  const renderItem = ({ item }: { item: SavedData }) => {
    const totalExpenses = item.expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = item.income - totalExpenses;

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => onLoad(item)}
        >
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDate}>{formatDate(item.updatedAt)}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.detailText}>収入: ¥{item.income.toLocaleString()}</Text>
            <Text style={[styles.detailText, balance < 0 && styles.deficit]}>
              過不足: ¥{balance.toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>保存データ ({savedDataList.length}/10)</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          {savedDataList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>保存データがありません</Text>
            </View>
          ) : (
            <FlatList
              data={savedDataList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
    color: COLORS.dark,
  },
  deficit: {
    color: COLORS.danger,
  },
  deleteButton: {
    width: 44,
    height: '100%',
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
});
