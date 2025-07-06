'use client';

import { useEffect, useState } from 'react';
import TransactionForm, { Transaction } from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import MonthlyChart from './components/MonthlyChart';
import CategoryPieChart from './components/CategoryPieChart';
import DashboardCards from './components/DashboardCards';


import SpendingInsights from './components/SpendingInsights';
import BudgetForm from './components/BudgetForm';
import BudgetComparisonChart from './components/BudgetComparisonChart';

export default function Home() {
  const [editingTxn, setEditingTxn] = useState<Transaction | undefined>(undefined);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const fetchTransactions = async () => {
    setLoading(true);
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  const refresh = () => {
    fetchTransactions();
    setEditingTxn(undefined);
     setReloadKey(prev => prev + 1);
  };

  return (
    <main className="min-h-screen py-10 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Expense Tracker</h1>

      <TransactionForm
        editingTransaction={editingTxn}
        cancelEdit={() => setEditingTxn(undefined)}
        onSuccess={refresh}
      />

    
      <DashboardCards key={`dashboard-${reloadKey}`} reloadKey={reloadKey} />


    
    <BudgetForm key={`budget-form-${reloadKey}`} onBudgetSaved={() => setReloadKey(prev => prev + 1)} />


   
      <BudgetComparisonChart reloadKey={reloadKey} />


     
      <SpendingInsights key={`spending-${reloadKey}`}reloadKey={reloadKey} />

      
      <MonthlyChart key={`chart-${reloadKey}`}  reloadKey={reloadKey}/>

      <CategoryPieChart key={`pie-${reloadKey}`} reloadKey={reloadKey} />


      
      <TransactionList key={`list-${reloadKey}`} reloadKey={reloadKey} onEdit={setEditingTxn} />

    </main>
  );
}
