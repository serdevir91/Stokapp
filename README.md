# 📦 Stok ve Envanter Takip Uygulaması

Modern, hızlı ve kullanıcı dostu bir stok yönetim sistemi. İşletmenizin veya kişisel envanterinizin takibini kolaylaştırmak, gelir-gider dengesini görmek ve stok hareketlerini yönetmek için geliştirilmiştir.

![Stok Takip Ekran Görüntüsü](https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000)

## 🎯 Projenin Amacı

Bu projenin temel amacı, karmaşık stok takip programlarına ihtiyaç duymadan, herkesin kolayca kullanabileceği **ücretsiz, açık kaynaklı ve pratik** bir çözüm sunmaktır. Excel dosyalarıyla boğuşmak yerine, görsel ve etkileşimli bir arayüz ile envanterinizi saniyeler içinde yönetmenizi sağlar.

## ✨ Özellikler

*   **Ürün Yönetimi:** Ürün ekleme, düzenleme, silme ve detaylı listeleme.
*   **Akıllı Stok Takibi:** 
    *   Ürünlerin üzerine tıklayarak açılan panelden hızlıca "Stok Ekle" veya "Stok Düş" işlemi yapabilme.
    *   Kritik stok seviyesinin altına düşen ürünler için **Kırmızı Alarm** uyarısı.
*   **Finansal Analiz:**
    *   Otomatik Kâr/Zarar hesaplaması.
    *   Günlük ve Aylık finansal grafikler.
    *   Anlık kasa bakiyesi ve toplam envanter değeri görüntüleme.
*   **Veri Güvenliği ve Yedekleme:**
    *   Veriler tarayıcınızda (LocalStorage) saklanır.
    *   Tüm verileri tek tıkla **JSON** olarak yedekleyip başka cihazlara taşıyabilirsiniz.
    *   **Excel Entegrasyonu:** Milyonlarca ürünü Excel'den içe aktarabilir veya listenizi Excel olarak dışa aktarabilirsiniz.
*   **Kişiselleştirme:** Para birimi (TRY, USD, EUR) ve stok uyarı limitlerini ayarlayabilme.
*   **Çapraz Platform:** Web tarayıcısı üzerinden veya Windows masaüstü uygulaması olarak çalışabilir.

## 🚀 Kullanım

Bu projeyi iki şekilde kullanabilirsiniz:

### 1. Web Sürümü (Kurulumsuz)
Aşağıdaki linke tıklayarak uygulamayı hemen kullanmaya başlayabilirsiniz:
👉 **[Uygulamayı Aç](https://serdevir91.github.io/Stokapp/)**

### 2. Geliştirici Kurulumu (Local)
Projeyi kendi bilgisayarınızda geliştirmek isterseniz:

```bash
# Projeyi klonlayın
git clone https://github.com/serdevir91/Stokapp.git

# Klasöre gidin
cd Stokapp

# Bağımlılıkları yükleyin
npm install

# Uygulamayı çalıştırın
npm run dev
```

## 🛠️ Kullanılan Teknolojiler

*   **Framework:** [React 18](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
*   **Charts:** [Recharts](https://recharts.org/)
*   **Desktop:** [Electron](https://www.electronjs.org/)
*   **Excel:** [SheetJS (xlsx)](https://sheetjs.com/)

---
*Geliştirici: [Serdevir91](https://github.com/serdevir91)*
