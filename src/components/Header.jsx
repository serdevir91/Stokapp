import React from 'react';
import { Package2 } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <Package2 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Stok Takip & Envanter</h1>
                    <p className="text-xs text-slate-400">Yönetim Paneli</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-200">Admin User</p>
                    <p className="text-xs text-slate-500">Online</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-sm font-bold text-blue-400">
                    AU
                </div>
            </div>
        </header>
    );
}
