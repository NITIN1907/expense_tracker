'use client';

import { useEffect, useState } from 'react';
import { Transaction } from './TransactionForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, CalendarDays, Tag } from "lucide-react";
type Props = {
    onEdit: (txn: Transaction) => void;
};

export default function TransactionList({ onEdit }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        setLoading(true);
        const res = await fetch('/api/transactions');
        const data = await res.json();
        setTransactions(data);
        setLoading(false);
    };

    const deleteTransaction = async (id: string) => {
        console.log("delete calling for: ", id)
        const confirmed = confirm('Are you sure you want to delete this transaction?');
        if (!confirmed) return;

        const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        console.log("Delete response:", res.status);
        if (res.ok) {
            setTransactions((prev) => prev.filter((t) => t._id !== id));

        } else {
            const text = await res.text();
            console.error("Delete failed:", res.status, text);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="mt-10 w-full max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">All Transactions</h2>

            {loading && (
                <div className="text-center text-muted-foreground">
                    <p>Loading transactions...</p>
                </div>
            )}

            {!loading && transactions.length === 0 && (
                <p className="text-center text-muted-foreground">No transactions available.</p>
            )}

            <ul className="space-y-2">
                {transactions.map((txn) => (
                    <li key={txn._id}>
                        <Card className="group transition-all duration-300 p-4 hover:shadow-md border border-gray-200 hover:border-gray-300 flex justify-between items-center rounded-xl">
                            <div className="space-y-1">
                                <p className="text-base font-medium text-gray-800 -ml-14">
                                   description: {txn.description}
                                </p>
                                <div className="text-sm text-muted-foreground flex items-center gap-2 -ml-14">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>{new Date(txn.date).toLocaleDateString()}</span>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2 -ml-14">
                                    <Tag className="w-4 h-4" />
                                    <span>{txn.category}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end sm:flex-row sm:items-center gap-3 text-right -ml-10">
                                <p
                                    className={`font-bold text-lg ${txn.amount >= 0 ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    ₹{Number(txn.amount || 0).toFixed(2)}
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => onEdit(txn)}
                                        className="hover:bg-gray-100"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => deleteTransaction(txn._id!)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
}
