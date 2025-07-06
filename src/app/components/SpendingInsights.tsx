'use client';

import { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { Transaction } from './TransactionForm';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type BudgetEntry = {
  category: string;
  amount: number;
};

export default function SpendingInsights() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => setTransactions(data));

    fetch('/api/budgets')
      .then((res) => res.json())
      .then((data) => setBudgets(data));
  }, []);

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const insights = CATEGORIES.map((cat) => {
    const actual = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear && t.category === cat;
      })
      .reduce((acc, t) => acc + t.amount, 0);

    const budget = budgets.find((b) => b.category === cat)?.amount || 0;
    const percent = budget ? Math.min((actual / budget) * 100, 999) : 0;

    return {
      category: cat,
      budget,
      actual,
      percent,
      over: actual > budget && budget > 0,
    };
  });

  const hasData = insights.some((i) => i.budget > 0 || i.actual > 0);

  if (!hasData) {
    return <p className="text-muted-foreground text-center mt-6">No spending insights available yet.</p>;
  }

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">📊 Spending Insights</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <Card key={insight.category}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{insight.category}</span>
                <span
                  className={`text-sm ${
                    insight.over ? 'text-red-600' : 'text-muted-foreground'
                  }`}
                >
                  ₹{insight.actual.toFixed(0)} / ₹{insight.budget.toFixed(0)}
                </span>
              </div>
              <Progress
                value={Math.min(insight.percent, 100)}
                className={insight.over ? 'bg-red-100' : ''}
              />
              {insight.over && (
                <p className="text-xs text-red-600 font-medium">
                  ⚠ Over budget!
                </p>
              )}
              {!insight.over && insight.percent >= 75 && (
                <p className="text-xs text-yellow-600">⚠ Nearing limit</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
