'use client';

import { useEffect, useState } from 'react';
import { Transaction } from './TransactionForm';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function formatMonthYear(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}

export default function MonthlyChart() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ id: string; month: string; total: number }[]>([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data: Transaction[]) => setTransactions(data));
  }, []);

  useEffect(() => {
    const map = new Map<string, number>();

    for (const txn of transactions) {
      const key = formatMonthYear(txn.date);
      map.set(key, (map.get(key) || 0) + txn.amount);
    }

    const sorted = Array.from(map.entries())
      .map(([month, total], index) => ({
        id: `${month}-${index}`,
        month,
        total,
      }))
      .sort((a, b) =>
        new Date(b.month).getTime() - new Date(a.month).getTime()
      );

    setMonthlyData(sorted);
  }, [transactions]);

  if (monthlyData.length === 0) {
    return <p className="text-center text-muted-foreground mt-6">No data to display chart.</p>;
  }

  return (
    <div className="mt-10 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} key="monthly-bar" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
