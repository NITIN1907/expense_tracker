'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORIES } from '../constants/categories';
import { Transaction } from './TransactionForm';

type BudgetEntry = {
  category: string;
  amount: number;
};

export default function BudgetComparisonChart({ reloadKey }: { reloadKey: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [chartData, setChartData] = useState<
    { category: string; budgeted: number; actual: number }[]
  >([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => setTransactions(data));
    fetch('/api/budgets')
      .then((res) => res.json())
      .then((data) => setBudgets(data));
  }, [reloadKey]);

  useEffect(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const actualMap = new Map<string, number>();
    for (const txn of transactions) {
      const txnDate = new Date(txn.date);
      if (txnDate.getMonth() === thisMonth && txnDate.getFullYear() === thisYear) {
        actualMap.set(txn.category, (actualMap.get(txn.category) || 0) + txn.amount);
      }
    }

    const budgetMap = new Map<string, number>();
    for (const b of budgets) {
      budgetMap.set(b.category, b.amount);
    }

    const data = CATEGORIES.map((cat) => ({
      category: cat,
      budgeted: budgetMap.get(cat) || 0,
      actual: actualMap.get(cat) || 0,
    }));

    setChartData(data);
  }, [transactions, budgets]);

  if (chartData.every((item) => item.budgeted === 0 && item.actual === 0)) {
    return <p className="text-muted-foreground text-center mt-6">No budget or expense data yet.</p>;
  }

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Budget vs Actual Spend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budgeted" fill="#94a3b8" name="Budgeted" />
          <Bar dataKey="actual" fill="#22c55e" name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
