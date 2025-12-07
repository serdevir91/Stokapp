import React from 'react';
import { DollarSign, Package, TrendingUp, Wallet } from 'lucide-react';

export default function DashboardStats({ stats, currency }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency || 'TRY',
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Inventory Value */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Package className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Envanter Değeri</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900">
                        {formatCurrency(stats.totalInventoryValue)}
                    </h3>
                    <p className="text-xs text-slate-500">Stoktaki ürünlerin maliyeti</p>
                </div>
            </div>

            {/* Net Profit */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stats.totalProfit >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Net Kâr/Zarar</span>
                </div>
                <div className="space-y-1">
                    <h3 className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(stats.totalProfit)}
                    </h3>
                    <p className="text-xs text-slate-500">Gerçekleşen satış geliri</p>
                </div>
            </div>

            {/* Cash Balance */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Kasa Bakiyesi</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900">
                        {formatCurrency(stats.cashBalance)}
                    </h3>
                    <p className="text-xs text-slate-500">Anlık nakit durumu</p>
                </div>
            </div>
        </div>
    );
}
