import React from 'react';
import { History, ArrowRight, ArrowLeft } from 'lucide-react';

export default function TransactionHistory({ transactions, currency }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('tr-TR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency || 'TRY',
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-500" />
                    <h2 className="text-lg font-semibold text-slate-800">Son İşlemler</h2>
                </div>
            </div>

            <div className="overflow-auto flex-1 p-0">
                <ul className="divide-y divide-slate-100">
                    {transactions.slice(0, 10).map((tx) => (
                        <li key={tx.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.type === 'IN' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {tx.type === 'IN' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{tx.productName}</p>
                                        <p className="text-xs text-slate-500">
                                            {tx.type === 'IN' ? 'Stok Girişi' : 'Stok Çıkışı (Satış)'} • {tx.amount} Adet
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${tx.type === 'OUT' ? 'text-green-600' : 'text-slate-600'}`}>
                                        {tx.type === 'OUT' && '+'}
                                        {formatCurrency(tx.total)}
                                    </p>
                                    <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                    {transactions.length === 0 && (
                        <li className="p-8 text-center text-slate-400 text-sm">
                            Henüz işlem geçmişi yok.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
