import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ExpenseItem } from '../types';
import { COLORS } from '../constants';

interface Props {
  item: ExpenseItem;
  onUpdate: (id: string, name: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export const ExpenseInput: React.FC<Props> = ({ item, onUpdate, onDelete }) => {
  const handleNameChange = (text: string) => {
    onUpdate(item.id, text, item.amount);
  };

  const handleAmountChange = (text: string) => {
    const amount = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    onUpdate(item.id, item.name, amount);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.nameInput}
        value={item.name}
        onChangeText={handleNameChange}
        placeholder="項目名"
        placeholderTextColor={COLORS.secondary}
      />
      <TextInput
        style={styles.amountInput}
        value={item.amount > 0 ? item.amount.toLocaleString() : ''}
        onChangeText={handleAmountChange}
        placeholder="0"
        placeholderTextColor={COLORS.secondary}
        keyboardType="numeric"
      />
      <Text style={styles.yen}>円</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    marginRight: 8,
  },
  amountInput: {
    width: 100,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    textAlign: 'right',
  },
  yen: {
    fontSize: 16,
    marginLeft: 4,
    marginRight: 8,
    color: COLORS.dark,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
