import React, { useState } from 'react';
import { Edit2, Trash2, AlertTriangle, Search, TrendingUp, TrendingDown, Filter, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ProductList({ products, onEdit, onDelete, onStockOperation, currency, lowStockThreshold, categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Inline Stock Operation State
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [operationType, setOperationType] = useState('add');
    const [operationAmount, setOperationAmount] = useState('');

    const toggleExpand = (product) => {
        if (expandedProductId === product.id) {
            setExpandedProductId(null);
            setOperationAmount('');
        } else {
            setExpandedProductId(product.id);
            setOperationType('add');
            setOperationAmount('');
        }
    };

    const handleStockSubmit = (e, product) => {
        e.preventDefault();
        const amount = parseInt(operationAmount);
        if (!amount || amount <= 0) return;

        onStockOperation(product.id, operationType, amount);
        setOperationAmount('');
        // Optional: close after operation or keep open? 
        // User asked "tekrar ürüne tıklayınca kapansın", implying manual close, but usually auto-close is nice.
        // Keeping it open allows rapid adjustments, but let's keep it open for feedback visibility or close it.
        // Let's close it to indicate completion and cleanliness.
        setExpandedProductId(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency || 'TRY',
        }).format(amount);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">Ürün Listesi</h2>
                    <p className="text-xs text-slate-500">{filteredProducts.length} ürün listeleniyor</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                            <option value="All">Tüm Kategoriler</option>
                            {categories && categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ürün veya Kod ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Ürün Adı / Kod</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4 text-center">Stok Durumu</th>
                            <th className="px-6 py-4 text-right">Fiyatlar</th>
                            <th className="px-6 py-4 text-right">Potansiyel Kâr</th>
                            <th className="px-6 py-4 text-center">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <React.Fragment key={product.id}>
                                    <tr
                                        onClick={() => toggleExpand(product)}
                                        className={cn(
                                            "transition-colors group cursor-pointer",
                                            expandedProductId === product.id ? "bg-slate-50" : "hover:bg-slate-50/50"
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{product.name}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5">{product.code || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={cn(
                                                    "flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-sm",
                                                    product.stock < (lowStockThreshold || 10)
                                                        ? "bg-red-50 text-red-600 border border-red-100"
                                                        : "bg-blue-50 text-blue-700 border border-blue-100"
                                                )}>
                                                    {product.stock} Adet
                                                    {product.stock < (lowStockThreshold || 10) && <AlertTriangle className="w-3.5 h-3.5" />}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs text-slate-400">Alış: <span className="text-slate-600 font-medium">{formatCurrency(product.buyPrice)}</span></span>
                                                <span className="text-xs text-slate-400">Satış: <span className="text-slate-900 font-medium">{formatCurrency(product.sellPrice)}</span></span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 text-green-600 font-medium">
                                                <TrendingUp className="w-3 h-3" />
                                                {formatCurrency(product.sellPrice - product.buyPrice)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit/Delete buttons stopped propagation to prevent toggling the row when clicking them */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Düzenle"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                                <button
                                                    className={cn(
                                                        "p-1 rounded-full transition-transform duration-200",
                                                        expandedProductId === product.id ? "rotate-180 text-blue-600 bg-blue-50" : "text-slate-400"
                                                    )}
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Row for Inline Action */}
                                    {expandedProductId === product.id && (
                                        <tr className="bg-slate-50/80 border-b border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                                            <td colSpan="6" className="p-4">
                                                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6">

                                                    {/* Toggle Switch */}
                                                    <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                                                        <button
                                                            onClick={() => setOperationType('add')}
                                                            className={cn(
                                                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                                                operationType === 'add' ? "bg-white text-green-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                                            )}
                                                        >
                                                            <TrendingUp className="w-4 h-4" />
                                                            Stok Ekle
                                                        </button>
                                                        <button
                                                            onClick={() => setOperationType('remove')}
                                                            className={cn(
                                                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                                                operationType === 'remove' ? "bg-white text-red-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                                            )}
                                                        >
                                                            <TrendingDown className="w-4 h-4" />
                                                            Stok Düş
                                                        </button>
                                                    </div>

                                                    {/* Input & Action */}
                                                    <form onSubmit={(e) => handleStockSubmit(e, product)} className="flex-1 flex items-center gap-4 w-full">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                placeholder="Miktar"
                                                                value={operationAmount}
                                                                onChange={(e) => setOperationAmount(e.target.value)}
                                                                autoFocus
                                                                className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">ADET</span>
                                                        </div>

                                                        {/* Preview New Stock */}
                                                        <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shrink-0 text-center min-w-[80px]">
                                                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Yeni Stok</div>
                                                            <div className={cn(
                                                                "font-bold text-sm",
                                                                (operationType === 'add' ? product.stock + (parseInt(operationAmount) || 0) : product.stock - (parseInt(operationAmount) || 0)) < 0
                                                                    ? "text-red-600"
                                                                    : "text-slate-800"
                                                            )}>
                                                                {operationType === 'add'
                                                                    ? product.stock + (parseInt(operationAmount) || 0)
                                                                    : product.stock - (parseInt(operationAmount) || 0)
                                                                }
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="submit"
                                                            disabled={!operationAmount || parseInt(operationAmount) <= 0}
                                                            className={cn(
                                                                "flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                                                                operationType === 'add'
                                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                                    : "bg-red-600 hover:bg-red-700 text-white"
                                                            )}
                                                        >
                                                            <Save className="w-4 h-4" />
                                                            Uygula
                                                        </button>
                                                    </form>

                                                    <button
                                                        onClick={() => toggleExpand(product)}
                                                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full"
                                                        title="Kapat"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                    {searchTerm || selectedCategory !== 'All' ? 'Aranan kriterlere uygun ürün bulunamadı.' : 'Henüz hiç ürün eklenmemiş.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
