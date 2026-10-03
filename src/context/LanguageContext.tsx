'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

const translations = {
  ar: {
    welcome: 'أهلاً بك، مصور 👋',
    overview: 'إليك نظرة عامة على نشاطك.',
    addClient: 'إضافة عميل',
    createAlbum: 'إنشاء ألبوم',
    totalClients: 'إجمالي العملاء',
    activeAlbums: 'الألبومات النشطة',
    usedSpace: 'المساحة المستخدمة',
    noAlbums: 'لا توجد ألبومات بعد. أنشئ أول ألبوم!',
    noClients: 'لا يوجد عملاء بعد. أضف أول عميل!',
    clientName: 'اسم العميل',
    albumName: 'اسم الألبوم',
    description: 'الوصف (اختياري)',
    selectClient: 'اختر العميل (اختياري)',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    copyLink: 'نسخ الرابط',
    copied: '✓ تم النسخ',
    open: 'فتح',
    confirmDelete: 'هل أنت متأكد من حذف هذا العميل؟ سيتم حذف جميع ألبوماته أيضاً!',
    addClientTitle: 'إضافة عميل جديد',
    createAlbumTitle: 'إنشاء ألبوم جديد',
    logout: 'تسجيل الخروج',
    home: 'الرئيسية',
    clients: 'العملاء',
    albums: 'الألبومات',
    videos: 'الفيديوهات',
    langToggle: 'English'
  },
  en: {
    welcome: 'Welcome, Photographer 👋',
    overview: 'Here is an overview of your activity.',
    addClient: 'Add Client',
    createAlbum: 'Create Album',
    totalClients: 'Total Clients',
    activeAlbums: 'Active Albums',
    usedSpace: 'Used Space',
    noAlbums: 'No albums yet. Create your first one!',
    noClients: 'No clients yet. Add your first client!',
    clientName: 'Client Name',
    albumName: 'Album Name',
    description: 'Description (Optional)',
    selectClient: 'Select Client (Optional)',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    copyLink: 'Copy Link',
    copied: '✓ Copied',
    open: 'Open',
    confirmDelete: 'Are you sure you want to delete this client? All their albums will be deleted too!',
    addClientTitle: 'Add New Client',
    createAlbumTitle: 'Create New Album',
    logout: 'Logout',
    home: 'Home',
    clients: 'Clients',
    albums: 'Albums',
    videos: 'Videos',
    langToggle: 'العربية'
  }
};

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ar');

  const toggleLang = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: keyof typeof translations.ar) => {
    return translations[lang][key];
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}