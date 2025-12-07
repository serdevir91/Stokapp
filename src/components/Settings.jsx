import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, AlertTriangle, List, Plus, Trash2, FileBarChart } from 'lucide-react';

export default function Settings({ settings, onUpdateSettings, categories, onAddCategory, onDeleteCategory, onClearData, onExportData, onImportData, onExportExcel, onImportExcel }) {
    const [formData, setFormData] = useState(settings);
    const [newCategory, setNewCategory] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateSettings({
            ...formData,
            lowStockThreshold: parseInt(formData.lowStockThreshold)
        });
        alert('Ayarlar kaydedildi.');
    };

    const handleAddCategorySubmit = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    const handleClear = () => {
        if (window.confirm('DİKKAT! Tüm ürün ve işlem verileri kalıcı olarak silinecek. Emin misiniz?')) {
            onClearData();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-2 bg-slate-100 rounded-lg">
                    <SettingsIcon className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">Uygulama Ayarları</h2>
                    <p className="text-sm text-slate-500">Genel yapılandırma ve veri yönetimi</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Genel Ayarlar</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Para Birimi</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TRY">Türk Lirası (₺)</option>
                                <option value="USD">Amerikan Doları ($)</option>
                                <option value="EUR">Euro (€)</option>
                                <option value="GBP">Sterlin (£)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Kritik Stok Eşiği</label>
                            <input
                                type="number"
                                name="lowStockThreshold"
                                value={formData.lowStockThreshold}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-400">Bu sayının altındaki ürünler uyarı verir.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Save className="w-4 h-4" />
                        Kaydet
                    </button>
                </div>
            </form>

            {/* CATEGORY MANAGEMENT SECTION */}
            <div className="pt-6 border-t border-slate-100 mb-8">
                <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Kategori Yönetimi
                </h3>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Yeni kategori adı..."
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={!newCategory.trim()}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {categories && categories.map((cat) => (
                            <div key={cat} className="group flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-sm text-slate-700">
                                {cat}
                                <button
                                    onClick={() => onDeleteCategory(cat)}
                                    className="p-0.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* EXCEL MANAGEMENT SECTION */}
            <div className="pt-6 border-t border-slate-100 mb-8">
                <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileBarChart className="w-4 h-4" />
                    Excel İle Yönetim
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Excel İndir</h4>
                        <p className="text-xs text-slate-500 mb-4">Ürün listenizi Excel formatında indirin.</p>
                        <button
                            onClick={onExportExcel}
                            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            Excel İndir (.xlsx)
                        </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Excel'den Yükle</h4>
                        <p className="text-xs text-slate-500 mb-4">Sütunlar: Ürün Adı, Kategori, Stok, Alış Fiyatı, Satış Fiyatı</p>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        onImportExcel(e.target.files[0]);
                                        e.target.value = ''; // Reset input
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                                Excel Dosyası Seç
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* BACKUP SECTION */}
            <div className="pt-6 border-t border-slate-100 mb-8">
                <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Veri Yedekleme
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Yedek Al</h4>
                        <p className="text-xs text-slate-500 mb-4">Mevcut verilerinizi bilgisayarınıza indirin.</p>
                        <button
                            onClick={onExportData}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Verileri İndir (.json)
                        </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Yedeği Geri Yükle</h4>
                        <p className="text-xs text-slate-500 mb-4">Dikkat: Mevcut verilerin üzerine yazılır.</p>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        if (window.confirm("Mevcut veriler silinip yedekten yüklenecek. Emin misiniz?")) {
                                            onImportData(e.target.files[0]);
                                        }
                                        e.target.value = ''; // Reset input
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                                Dosya Seç ve Yükle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* DANGER ZONE */}
            <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-medium text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Tehlikeli Bölge
                </h3>

                <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-800">Tüm Verileri Sıfırla</p>
                        <p className="text-xs text-slate-500">Ürünler, stok geçmişi ve tüm ayarlar silinecektir.</p>
                    </div>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                        Verileri Sil
                    </button>
                </div>
            </div>
        </div>
    );
}
