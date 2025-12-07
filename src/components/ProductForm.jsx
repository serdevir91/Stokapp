import React, { useState, useEffect } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ProductForm({ onSubmit, editingProduct, onCancel, currency, categories, onAddCategory }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        stock: 0,
        buyPrice: 0,
        sellPrice: 0,
    });

    useEffect(() => {
        if (editingProduct) {
            setFormData(editingProduct);
        } else {
            setFormData({
                name: '',
                category: categories && categories.length > 0 ? categories[0] : '',
                stock: 0,
                buyPrice: 0,
                sellPrice: 0,
            });
        }
    }, [editingProduct, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            stock: Number(formData.stock),
            buyPrice: Number(formData.buyPrice),
            sellPrice: Number(formData.sellPrice),
        });
    };

    const handleQuickAddCategory = () => {
        const newCat = window.prompt("Yeni kategori adı:");
        if (newCat && newCat.trim()) {
            onAddCategory(newCat.trim());
            setFormData({ ...formData, category: newCat.trim() });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                    {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h2>
                {editingProduct && (
                    <button
                        onClick={onCancel}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">Ürün Adı</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Örn: M7 Vida"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">Kategori</label>
                        <div className="flex gap-2">
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                            >
                                <option value="" disabled>Seçiniz</option>
                                {categories && categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleQuickAddCategory}
                                className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                title="Yeni Kategori Ekle"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600">Başlangıç Stoğu</label>
                        <input
                            required
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600">Alış Fiyatı ({currency || 'TL'})</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.buyPrice}
                                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600">Satış Fiyatı ({currency || 'TL'})</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.sellPrice}
                                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white font-medium transition-all shadow-sm",
                        editingProduct
                            ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    )}
                >
                    {editingProduct ? (
                        <>
                            <Save className="w-5 h-5" /> Değişiklikleri Kaydet
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" /> Ürünü Ekle
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
