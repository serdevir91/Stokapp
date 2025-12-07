import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { cn } from '../lib/utils';

export default function FinancialCharts({ transactions, currency }) {
    const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'daily'

    const data = useMemo(() => {
        // Helper to get key (e.g. "2023-10" or "2023-10-25")
        const getKey = (dateStr) => {
            const date = new Date(dateStr);
            if (viewMode === 'monthly') {
                const month = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear();
                return `${month} ${year}`;
            } else {
                return date.toLocaleDateString();
            }
        };

        const grouped = transactions.reduce((acc, tx) => {
            const key = getKey(tx.date);
            if (!acc[key]) {
                acc[key] = { name: key, income: 0, expense: 0, profit: 0 };
            }

            if (tx.type === 'OUT') { // Sale
                acc[key].income += tx.total;
                acc[key].profit += (tx.profit || 0);
            } else { // Buy (IN)
                acc[key].expense += tx.total;
            }
            return acc;
        }, {});

        // Sort by date usually preferred, but object keys iteration might suffice for now if roughly ordered. 
        // Ideally update sort logic later.
        return Object.values(grouped);
    }, [transactions, viewMode]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800">Finansal Analiz</h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('daily')}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            viewMode === 'daily' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Günlük
                    </button>
                    <button
                        onClick={() => setViewMode('monthly')}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            viewMode === 'monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Aylık
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f1f5f9' }}
                        />
                        <Legend />
                        <Bar dataKey="income" name="Satış Geliri" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Alım Gideri" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="profit" name="Net Kâr" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
