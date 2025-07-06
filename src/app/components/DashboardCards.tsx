'use client';

import { useEffect, useState } from 'react';
import { Transaction } from './TransactionForm';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardCards() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const [recent, setRecent] = useState<Transaction[]>([]);

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

    let total = 0;

    const thisMonthTxns = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate.getMonth() === thisMonth && txnDate.getFullYear() === thisYear;
    });

    for (const txn of thisMonthTxns) {
      total += txn.amount;
    }

    setTotalThisMonth(total);

    // Sort by date (desc) and pick 5
    const recentTxns = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    setRecent(recentTxns);
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
      {/* Total Expense Card */}
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Spent This Month</p>
          <h3 className="text-2xl font-bold text-green-700">₹{totalThisMonth.toFixed(2)}</h3>
        </CardContent>
      </Card>

      {/* Recent Transactions Card */}
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Recent Transactions</p>
          <ul className="space-y-2">
            {recent.length === 0 && (
              <li className="text-muted-foreground text-sm">No recent transactions.</li>
            )}
            {recent.map((txn) => (
              <li key={txn._id} className="flex justify-between text-sm">
                <span>{txn.description}</span>
                <span className="font-medium text-green-600">₹{txn.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
