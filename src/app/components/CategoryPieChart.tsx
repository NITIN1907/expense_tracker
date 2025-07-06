'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from './TransactionForm';
import { CATEGORIES } from '../constants/categories'; 

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8A2BE2', '#FF6666', '#A9A9A9', '#2ECC71'];

export default function CategoryPieChart() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [data, setData] = useState<{ category: string; total: number }[]>([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        setTransactions(data);
      });
  }, []);

  useEffect(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const categoryTotals = new Map<string, number>();

    for (const txn of transactions) {
      const txnDate = new Date(txn.date);
      if (txnDate.getMonth() === thisMonth && txnDate.getFullYear() === thisYear) {
        categoryTotals.set(txn.category, (categoryTotals.get(txn.category) || 0) + txn.amount);
      }
    }

    const result = Array.from(categoryTotals.entries()).map(([category, total]) => ({
      category,
      total,
    }));

    setData(result);
  }, [transactions]);

  if (data.length === 0) {
    return <p className="text-muted-foreground text-center mt-6">No expense data for this month.</p>;
  }

  return (
    <div className="mt-10 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Category-wise Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="total"
            nameKey="category"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
