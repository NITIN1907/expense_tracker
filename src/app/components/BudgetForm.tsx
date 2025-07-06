'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '../constants/categories';

export default function BudgetForm() {
  const [budgets, setBudgets] = useState<Record<string, number>>({});


  useEffect(() => {
    fetch('/api/budgets')
      .then((res) => res.json())
      .then((data) => {
        const b: Record<string, number> = {};
        for (const entry of data) {
          b[entry.category] = entry.amount;
        }
        setBudgets(b);
      });
  }, []);

  const handleChange = (category: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setBudgets((prev) => ({ ...prev, [category]: amount }));
  };

  const saveBudgets = async () => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    for (const category of Object.keys(budgets)) {
      const amount = budgets[category];
      await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount, month, year }),
      });
    }

    const res = await fetch('/api/budgets')
    const data = await res.json()

    const b: Record<string, number> = {};
    for (const entry of data) {
      b[entry.category] = entry.amount
    }
    setBudgets(b)

    alert('Budgets saved successfully.');
  
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto p-4 border rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Set Monthly Budgets</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <label className="text-sm font-medium">{cat}</label>
            <Input
              type="number"
              placeholder="₹0"
              value={budgets[cat] || ''}
              onChange={(e) => handleChange(cat, e.target.value)}
            />
          </div>
        ))}
      </div>

      <Button onClick={saveBudgets} className="mt-4 w-full">
        Save Budgets
      </Button>
    </div>
  );
}
