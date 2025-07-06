'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Rent',
  'Utilities',
  'Entertainment',
  'Health',
  'Other',
];

type Props = {
  onSuccess: () => void;
  editingTransaction?: Transaction;
  cancelEdit?: () => void;
};

export type Transaction = {
  _id?: string;
  description: string;
  amount: number;
  date: string;
  category: string;
};

export default function Transaction({ onSuccess, editingTransaction, cancelEdit }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date.slice(0, 10));
      setCategory(editingTransaction.category);
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!amount) newErrors.amount = 'Amount is required';
    if (!date) newErrors.date = 'Date is required';
    if (!category) newErrors.category = 'Category is required';

    const parseAmount = parseFloat(amount);
    if (amount && (isNaN(parseAmount) || parseAmount <= 0)) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      description,
      amount: parseFloat(amount),
      date,
      category,
    };

    const res = await fetch(
      editingTransaction ? `/api/transactions/${editingTransaction._id}` : '/api/transactions',
      {
        method: editingTransaction ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      setDescription('');
      setAmount('');
      setDate('');
      setCategory('');
      setErrors({});
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-xl w-full max-w-md mx-auto"
    >
      <div>
        <Label>Description</Label>
        <Input
          placeholder="e.g., Grocery shopping"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
      </div>

      <div>
        <Label>Amount (₹)</Label>
        <Input
          type="number"
          placeholder="e.g., 1500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
      </div>

      <div>
        <Label>Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
      </div>

      <div>
        <Label>Category</Label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-500 mt-1">{errors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Button type="submit" className="w-full">
          {editingTransaction ? 'Update' : 'Add'} Transaction
        </Button>

        {editingTransaction && (
          <Button type="button" variant="secondary" onClick={cancelEdit} className="w-full">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
