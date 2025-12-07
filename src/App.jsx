import React, { useState, useEffect } from 'react';
import { read, utils, writeFile } from 'xlsx';
import { LayoutDashboard, FileBarChart, Settings as SettingsIcon } from 'lucide-react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import TransactionHistory from './components/TransactionHistory';
import FinancialCharts from './components/FinancialCharts';
import Settings from './components/Settings';
import { cn } from './lib/utils';

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { currency: 'TRY', lowStockThreshold: 10 };
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : ["Genel", "Elektronik", "Hırdavat", "Kırtasiye"];
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingProduct, setEditingProduct] = useState(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // --- ACTIONS ---
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const handleAddCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (window.confirm(`${categoryToDelete} kategorisini silmek istediğinize emin misiniz?`)) {
      setCategories(categories.filter(c => c !== categoryToDelete));
    }
  };

  const handleClearData = () => {
    setProducts([]);
    setTransactions([]);
    setSettings({ currency: 'TRY', lowStockThreshold: 10 });
    setCategories(["Genel", "Elektronik", "Hırdavat", "Kırtasiye"]);
  };

  const handleExportData = () => {
    const data = {
      products,
      transactions,
      settings,
      categories,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stok-takip-yedek-${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.products || !data.transactions) {
        throw new Error("Geçersiz yedek dosyası formatı.");
      }

      setProducts(data.products || []);
      setTransactions(data.transactions || []);
      if (data.settings) setSettings(data.settings);
      if (data.categories) setCategories(data.categories);

      alert("Yedek başarıyla geri yüklendi!");
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleExportExcel = () => {
    const ws = utils.json_to_sheet(products.map(p => ({
      'Ürün Adı': p.name,
      'Kategori': p.category,
      'Stok': p.stock,
      'Alış Fiyatı': p.buyPrice,
      'Satış Fiyatı': p.sellPrice,
      'Kod': p.code
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Stok Listesi");
    writeFile(wb, "stok-listesi.xlsx");
  };

  const handleImportExcel = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'PRD-';
        for (let i = 0; i < 4; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }

      let newCount = 0;
      const newProducts = jsonData.map(item => {
        if (!item['Ürün Adı']) return null;
        newCount++;
        return {
          id: crypto.randomUUID(),
          name: item['Ürün Adı'],
          category: item['Kategori'] || 'Genel',
          stock: Number(item['Stok']) || 0,
          buyPrice: Number(item['Alış Fiyatı']) || 0,
          sellPrice: Number(item['Satış Fiyatı']) || 0,
          code: item['Kod'] || generateCode(),
          createdAt: new Date().toISOString()
        };
      }).filter(p => p !== null);

      setProducts([...products, ...newProducts]);

      // Update categories if new ones introduced
      const newCategories = [...new Set(newProducts.map(p => p.category))];
      const uniqueNewCategories = newCategories.filter(c => !categories.includes(c));
      if (uniqueNewCategories.length > 0) {
        setCategories([...categories, ...uniqueNewCategories]);
      }

      alert(`${newCount} ürün başarıyla eklendi!`);
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleAddProduct = (productData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: p.id, code: p.code } : p));
      setEditingProduct(null);
      return;
    }

    // Generate Readable ID (Code)
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = 'PRD-';
      for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    const newProduct = {
      ...productData,
      id: crypto.randomUUID(),
      code: generateCode(),
      createdAt: new Date().toISOString(),
    };
    setProducts([newProduct, ...products]);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setActiveTab('dashboard'); // Ensure we are on dashboard to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleStockOperation = (id, type, amount = null) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    let finalAmount = amount;

    if (finalAmount === null) {
      const amountStr = window.prompt(`${product.name} için ${type === 'add' ? 'eklenecek' : 'çıkarılacak'} adedi giriniz:`);
      if (!amountStr) return;
      finalAmount = parseInt(amountStr);
    }

    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Geçersiz miktar!');
      return;
    }

    if (type === 'remove' && product.stock < finalAmount) {
      alert('Yetersiz stok!');
      return;
    }

    const newStock = type === 'add' ? product.stock + finalAmount : product.stock - finalAmount;
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));

    const totalValue = type === 'add' ? finalAmount * product.buyPrice : finalAmount * product.sellPrice;
    const profit = type === 'remove' ? (product.sellPrice - product.buyPrice) * finalAmount : 0;

    const transaction = {
      id: crypto.randomUUID(),
      productId: id,
      productName: product.name,
      type: type === 'add' ? 'IN' : 'OUT',
      amount: finalAmount,
      price: type === 'add' ? product.buyPrice : product.sellPrice,
      total: totalValue,
      profit: profit,
      date: new Date().toISOString(),
    };

    setTransactions([transaction, ...transactions]);
  };

  // --- DERIVED STATE ---
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0);
  const cashBalance = transactions.reduce((acc, tx) => {
    return tx.type === 'OUT' ? acc + tx.total : acc - tx.total;
  }, 0);
  const totalProfit = transactions.reduce((acc, tx) => acc + (tx.profit || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Header currency={settings.currency} />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'dashboard'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Yönetim Paneli
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={cn(
                "py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'reports'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              <FileBarChart className="w-4 h-4" />
              Raporlar & Analiz
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                "py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'settings'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              <SettingsIcon className="w-4 h-4" />
              Ayarlar
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            <DashboardStats
              stats={{ totalInventoryValue, totalProfit, cashBalance }}
              currency={settings.currency}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ProductForm
                  onSubmit={handleAddProduct}
                  editingProduct={editingProduct}
                  onCancel={handleCancelEdit}
                  currency={settings.currency}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                />
                <ProductList
                  products={products}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteProduct}
                  onStockOperation={handleStockOperation}
                  currency={settings.currency}
                  lowStockThreshold={settings.lowStockThreshold}
                  categories={categories}
                />
              </div>
              <div className="lg:col-span-1">
                <TransactionHistory
                  transactions={transactions}
                  currency={settings.currency}
                />
              </div>
            </div>
          </>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <FinancialCharts
              transactions={transactions}
              currency={settings.currency}
            />

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold mb-4">Özet Rapor</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Toplam İşlem Sayısı</p>
                  <p className="text-xl font-bold">{transactions.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Ürün Çeşidi</p>
                  <p className="text-xl font-bold">{products.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onClearData={handleClearData}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onExportExcel={handleExportExcel}
            onImportExcel={handleImportExcel}
          />
        )}
      </main>
    </div>
  );
}
