'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  Home, Calendar, Image as ImageIcon, Download, Bell, User, Headphones, 
  Phone, MessageCircle, Camera, LogOut, ChevronLeft,
  Globe, Sun, Shield
} from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const translations: Record<string, Record<string, string>> = {
  ar: {
    welcome: 'مرحباً بك',
    welcomeSub: 'لتصفح ذكرياتك',
    welcomeDesc: 'إليك نظرة عامة على جلساتك، ويمكنك الآن الوصول إلى صورك وتنزيلها بسهولة.',
    totalSessions: 'إجمالي الجلسات',
    totalPhotos: 'إجمالي الصور',
    viewSessions: 'عرض الجلسات',
    viewSessionsSub: 'اضغط لعرض صورك',
    yourSessions: 'جلساتك',
    noSessions: 'لا توجد جلسات بعد',
    photos_count: 'صورة',
    downloadPhotos: 'تحميل الصور',
    home: 'الرئيسية',
    mySessions: 'جلساتي',
    photos: 'الصور',
    downloads: 'التنزيلات',
    profile: 'الملف الشخصي',
    support: 'الدعم',
    logout: 'تسجيل الخروج',
    client: 'عميل',
    contactHelp: 'هل تحتاج إلى مساعدة؟',
    contactDesc: 'تواصل معي لأي استفسار أو دعم فني.',
    contactWhatsapp: 'تواصل عبر واتساب',
    photographer: 'Boles Elhamy'
  },
  en: {
    welcome: 'Welcome',
    welcomeSub: 'to browse your memories',
    welcomeDesc: 'Here is an overview of your sessions. You can now access and download your photos easily.',
    totalSessions: 'Total Sessions',
    totalPhotos: 'Total Photos',
    viewSessions: 'View Sessions',
    viewSessionsSub: 'Click to view your photos',
    yourSessions: 'Your Sessions',
    noSessions: 'No sessions yet',
    photos_count: 'photos',
    downloadPhotos: 'Download Photos',
    home: 'Home',
    mySessions: 'My Sessions',
    photos: 'Photos',
    downloads: 'Downloads',
    profile: 'Profile',
    support: 'Support',
    logout: 'Logout',
    client: 'Client',
    contactHelp: 'Need Help?',
    contactDesc: 'Contact me for any inquiry or technical support.',
    contactWhatsapp: 'Contact via WhatsApp',
    photographer: 'Boles Elhamy'
  }
};

export default function ClientDashboard() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [albums, setAlbums] = useState<any[]>([]);
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>({});

  const t = (key: string): string => translations[lang][key] || key;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserEmail(user.email || '');
        
        // التحقق إنه مش أدمن
        const userEmail = user.email?.toLowerCase();
        const { data: adminData } = await supabase
          .from('admins')
          .select('email')
          .ilike('email', userEmail || '')
          .single();

        if (adminData) {
          // لو أدمن، يروح للداشبورد الرئيسية
          window.location.href = '/dashboard';
          return;
        }

        // تحميل ألبومات العميل فقط (كل الألبومات العامة)
        const { data: albumsData } = await supabase
          .from('albums')
          .select('*, clients(name)')
          .eq('is_public', true)
          .order('created_at', { ascending: false });
        
        if (albumsData) {
          setAlbums(albumsData);
          const counts: Record<string, number> = {};
          for (const album of albumsData) {
            const { count } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('album_id', album.id);
            counts[album.id] = count || 0;
          }
          setAlbumCounts(counts);
        }
      } else {
        window.location.href = '/';
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    window.location.href = '/'; 
  };

  const openAlbum = (shareToken: string) => {
    if (!shareToken) return;
    window.location.href = `/album/${shareToken}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = lang === 'ar' 
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getSessionIcon = (type: string) => {
    switch(type) {
      case 'wedding': return '💍';
      case 'portrait': return '';
      case 'event': return '📅';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600 text-lg">Boles Photography</p>
        </div>
      </div>
    );
  }

  const totalPhotos = Object.values(albumCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className={`min-h-screen bg-black text-white flex ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`w-72 bg-gradient-to-b from-gray-950 to-black border-${lang === 'ar' ? 'l' : 'r'} border-amber-900/20 p-6 flex flex-col fixed h-full overflow-y-auto ${lang === 'ar' ? 'right-0' : 'left-0'}`}>
        <div className="mb-8 text-center">
          <div className="inline-block">
            <h1 className="text-4xl font-serif text-amber-600 mb-1" style={{ fontFamily: 'cursive' }}>Boles</h1>
            <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">Photography</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg shadow-amber-900/30">
            <Home className="w-5 h-5" />
            <span className="font-medium">{t('home')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{t('mySessions')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">{t('photos')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <Download className="w-5 h-5" />
            <span className="font-medium">{t('downloads')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <User className="w-5 h-5" />
            <span className="font-medium">{t('profile')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <Headphones className="w-5 h-5" />
            <span className="font-medium">{t('support')}</span>
          </button>
        </nav>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userEmail.split('@')[0]}</p>
              <p className="text-xs text-gray-500">{t('client')}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-lg transition-all text-sm">
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${lang === 'ar' ? 'mr-72' : 'ml-72'} overflow-y-auto`}>
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-900 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">{t('welcome')}</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden mb-8 h-64">
            <img src="/mybackground.png" alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
            <div className="absolute inset-0 flex items-center p-8">
              <div className="max-w-lg">
                <h1 className="text-5xl font-bold text-white mb-2">
                  {t('welcome')} <span className="text-amber-600">{userEmail.split('@')[0]}</span>
                </h1>
                <p className="text-2xl text-gray-300 mb-4">{t('welcomeSub')}</p>
                <p className="text-gray-400">{t('welcomeDesc')}</p>
                <div className="flex gap-2 mt-6">
                  <div className="w-8 h-1 bg-amber-600 rounded-full"></div>
                  <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
                  <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-amber-900/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-900/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{albums.length}</p>
              <p className="text-sm text-gray-500">{t('totalSessions')}</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-amber-900/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-900/20 rounded-xl">
                  <ImageIcon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{totalPhotos}</p>
              <p className="text-sm text-gray-500">{t('totalPhotos')}</p>
            </div>

            <button 
              onClick={() => {
                const firstAlbum = albums[0];
                if (firstAlbum) openAlbum(firstAlbum.share_token);
              }}
              className="bg-gradient-to-br from-amber-700 to-amber-600 rounded-2xl p-6 text-white hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg shadow-amber-900/30 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold mb-1">{t('viewSessions')}</p>
              <p className="text-sm text-amber-100">{t('viewSessionsSub')}</p>
            </button>
          </div>

          {/* Sessions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-white">{t('yourSessions')}</h2>
            </div>

            <div className="space-y-4">
              {albums.map((album) => (
                <div 
                  key={album.id} 
                  onClick={() => openAlbum(album.share_token)}
                  className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-amber-900/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-gray-900 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-amber-600/50" />
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-white">{albumCounts[album.id] || 0} {t('photos_count')}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getSessionIcon(album.session_type || 'other')}</span>
                        <h3 className="text-xl font-bold text-white">{album.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(album.session_date || album.created_at)}
                        </span>
                        {album.clients?.name && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {album.clients.name}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-4">{album.description || ''}</p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-all text-sm">
                        <Download className="w-4 h-4" />
                        <span>{t('downloadPhotos')}</span>
                      </button>
                    </div>

                    <ChevronLeft className={`w-6 h-6 text-gray-600 group-hover:text-amber-600 transition-colors ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              ))}

              {albums.length === 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
                  <Camera className="w-16 h-16 text-amber-600/30 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('noSessions')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Camera className="w-8 h-8 text-amber-600" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('contactHelp')}</h3>
                    <p className="text-sm text-gray-500">{t('contactDesc')}</p>
                  </div>
                </div>
                <a href="https://wa.me/201225979165" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-all">
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('contactWhatsapp')}</span>
                </a>
              </div>
              <div className="space-y-3">
                <a href="tel:+201225979165" className="flex items-center gap-3 text-gray-400 hover:text-amber-600 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>+20 122 597 9165</span>
                </a>
                <a href="https://www.instagram.com/boles.photography" target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-amber-600 transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
                <a href="https://www.facebook.com/share/1E6Xrgdz27/" target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-amber-600 transition-colors">
                  <FacebookIcon className="w-5 h-5" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}