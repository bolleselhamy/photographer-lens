'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Home, Calendar, Image as ImageIcon, Download, User, Headphones, 
  Phone, MessageCircle, Camera, LogOut, ChevronLeft, ChevronRight,
  Globe, Sun, Moon, X, Check, CheckSquare, ZoomIn
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
    welcome: 'مرحباً بك', welcomeSub: 'لتصفح ذكرياتك',
    welcomeDesc: 'إليك نظرة عامة على جلساتك، ويمكنك الآن الوصول إلى صورك وتنزيلها بسهولة.',
    totalSessions: 'إجمالي الجلسات', totalPhotos: 'إجمالي الصور',
    viewSessions: 'عرض الجلسات', viewSessionsSub: 'اضغط لعرض صورك',
    yourSessions: 'جلساتك', noSessions: 'لا توجد جلسات بعد',
    photos_count: 'صورة', downloadPhotos: 'تحميل الصور',
    home: 'الرئيسية', mySessions: 'جلساتي', photos: 'الصور',
    downloads: 'التنزيلات', profile: 'الملف الشخصي', support: 'الدعم',
    logout: 'تسجيل الخروج', client: 'عميل',
    contactHelp: 'هل تحتاج إلى مساعدة؟', contactDesc: 'تواصل معي لأي استفسار أو دعم فني.',
    contactWhatsapp: 'تواصل عبر واتساب', photographer: 'Boles Elhamy',
    captureMoments: 'Capture Your Moments',
    selectAll: 'تحديد الكل', deselectAll: 'إلغاء التحديد',
    downloadSelected: 'تحميل المحدد', selectedCount: 'محدد',
    openGallery: 'فتح المعرض', noPhotos: 'لا توجد صور في هذه الجلسة',
    search: 'بحث...'
  },
  en: {
    welcome: 'Welcome', welcomeSub: 'to browse your memories',
    welcomeDesc: 'Here is an overview of your sessions. You can now access and download your photos easily.',
    totalSessions: 'Total Sessions', totalPhotos: 'Total Photos',
    viewSessions: 'View Sessions', viewSessionsSub: 'Click to view your photos',
    yourSessions: 'Your Sessions', noSessions: 'No sessions yet',
    photos_count: 'photos', downloadPhotos: 'Download Photos',
    home: 'Home', mySessions: 'My Sessions', photos: 'Photos',
    downloads: 'Downloads', profile: 'Profile', support: 'Support',
    logout: 'Logout', client: 'Client',
    contactHelp: 'Need Help?', contactDesc: 'Contact me for any inquiry.',
    contactWhatsapp: 'Contact via WhatsApp', photographer: 'Boles Elhamy',
    captureMoments: 'Capture Your Moments',
    selectAll: 'Select All', deselectAll: 'Deselect All',
    downloadSelected: 'Download Selected', selectedCount: 'selected',
    openGallery: 'Open Gallery', noPhotos: 'No photos in this session',
    search: 'Search...'
  }
};

export default function ClientDashboard() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [albums, setAlbums] = useState<any[]>([]);
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>({});
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [albumPhotos, setAlbumPhotos] = useState<any[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  const t = (key: string): string => translations[lang][key] || key;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        const { data: albumsData } = await supabase.from('albums').select('*, clients(name)').eq('is_public', true).order('created_at', { ascending: false });
        if (albumsData) {
          setAlbums(albumsData);
          const counts: Record<string, number> = {};
          for (const album of albumsData) {
            const { count } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('album_id', album.id);
            counts[album.id] = count || 0;
          }
          setAlbumCounts(counts);
        }
      } else { window.location.href = '/'; }
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/'; };

  const openAlbum = async (album: any) => {
    setSelectedAlbum(album);
    const { data } = await supabase.from('media').select('*').eq('album_id', album.id).order('created_at', { ascending: true });
    if (data) setAlbumPhotos(data);
    setSelectedPhotos(new Set());
  };

  const closeAlbum = () => { setSelectedAlbum(null); setAlbumPhotos([]); setSelectedPhotos(new Set()); };

  const togglePhotoSelection = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) newSelected.delete(photoId);
    else newSelected.add(photoId);
    setSelectedPhotos(newSelected);
  };

  const selectAllPhotos = () => {
    if (selectedPhotos.size === albumPhotos.length) setSelectedPhotos(new Set());
    else setSelectedPhotos(new Set(albumPhotos.map(p => p.id)));
  };

  const downloadSelected = async () => {
    const photosToDownload = albumPhotos.filter(p => selectedPhotos.has(p.id));
    for (const photo of photosToDownload) {
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = photo.url.split('/').pop() || 'photo.jpg';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const openPhotoViewer = (index: number) => {
    setCurrentPhotoIndex(index);
    setViewingPhoto(albumPhotos[index].url);
  };

  const closePhotoViewer = () => { setViewingPhoto(null); };

  const nextPhoto = () => {
    if (currentPhotoIndex < albumPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
      setViewingPhoto(albumPhotos[currentPhotoIndex + 1].url);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
      setViewingPhoto(albumPhotos[currentPhotoIndex - 1].url);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = lang === 'ar' ? ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'] : ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getSessionIcon = (type: string) => {
    switch(type) { case 'wedding': return ''; case 'portrait': return '👤'; case 'event': return '📅'; default: return '📷'; }
  };

  const totalPhotos = Object.values(albumCounts).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--accent)] text-lg font-display">Boles Photography</p>
        </div>
      </div>
    );
  }

  // Album Gallery View
  if (selectedAlbum) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="sticky top-0 z-40 px-8 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4">
            <button onClick={closeAlbum} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <h1 className="text-xl font-bold font-display">{selectedAlbum.name}</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{albumPhotos.length} {t('photos_count')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}><Globe className="w-5 h-5" /></button>
            <button onClick={toggleTheme} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Selection Bar */}
        {albumPhotos.length > 0 && (
          <div className="px-8 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <button onClick={selectAllPhotos} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
                {selectedPhotos.size === albumPhotos.length ? <CheckSquare className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span>{selectedPhotos.size === albumPhotos.length ? t('deselectAll') : t('selectAll')}</span>
              </button>
              {selectedPhotos.size > 0 && (
                <span className="text-sm" style={{ color: 'var(--accent)' }}>{selectedPhotos.size} {t('selectedCount')}</span>
              )}
            </div>
            {selectedPhotos.size > 0 && (
              <button onClick={downloadSelected} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-all" style={{ backgroundColor: 'var(--accent)' }}>
                <Download className="w-4 h-4" /><span>{t('downloadSelected')}</span>
              </button>
            )}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="p-8">
          {albumPhotos.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)', opacity: 0.3 }} />
              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{t('noPhotos')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albumPhotos.map((photo, index) => (
                <div key={photo.id} className="relative group cursor-pointer" onClick={() => openPhotoViewer(index)}>
                  <div className={`aspect-square rounded-xl overflow-hidden transition-all ${selectedPhotos.has(photo.id) ? 'ring-4 ring-offset-2' : ''}`} style={selectedPhotos.has(photo.id) ? { boxShadow: '0 0 0 4px var(--accent)' } : {}}>
                    <img src={photo.url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); togglePhotoSelection(photo.id); }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedPhotos.has(photo.id) ? 'text-white' : 'bg-black/50 text-white/70'}`}
                      style={{ backgroundColor: selectedPhotos.has(photo.id) ? 'var(--accent)' : undefined }}
                    >
                      {selectedPhotos.has(photo.id) ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-white/70"></div>}
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photo Viewer Modal */}
        {viewingPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}>
            <button onClick={closePhotoViewer} className="absolute top-4 right-4 p-2 text-white hover:text-[var(--accent)] transition-colors">
              <X className="w-8 h-8" />
            </button>
            <button onClick={prevPhoto} disabled={currentPhotoIndex === 0} className="absolute left-4 p-2 text-white hover:text-[var(--accent)] transition-colors disabled:opacity-30">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img src={viewingPhoto} alt="" className="max-w-full max-h-full object-contain" />
            <button onClick={nextPhoto} disabled={currentPhotoIndex === albumPhotos.length - 1} className="absolute right-4 p-2 text-white hover:text-[var(--accent)] transition-colors disabled:opacity-30">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* Contact Footer */}
        <footer className="px-8 py-8 mt-12" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Camera className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                  <div>
                    <h3 className="text-xl font-bold">{t('contactHelp')}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('contactDesc')}</p>
                  </div>
                </div>
                <a href="https://wa.me/201225979165" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all" style={{ backgroundColor: 'var(--accent)' }}>
                  <MessageCircle className="w-5 h-5" /><span>{t('contactWhatsapp')}</span>
                </a>
              </div>
              <div className="space-y-3">
                <a href="tel:+201225979165" className="flex items-center gap-3 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <Phone className="w-5 h-5" /><span>+20 122 597 9165</span>
                </a>
                <a href="https://www.instagram.com/boles.photography" target="_blank" className="flex items-center gap-3 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <InstagramIcon className="w-5 h-5" /><span>Instagram</span>
                </a>
                <a href="https://www.facebook.com/share/1E6Xrgdz27/" target="_blank" className="flex items-center gap-3 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <FacebookIcon className="w-5 h-5" /><span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Main Client Dashboard
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-8 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="inline-block">
            <h1 className="font-script text-3xl text-gold-gradient">Boles</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleLang} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}><Globe className="w-5 h-5" /></button>
          <button onClick={toggleTheme} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}><LogOut className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="p-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 h-72 animate-fade-in">
          <img src="/mybackground.png" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center p-10">
            <div className="max-w-lg">
              <h1 className="text-5xl font-bold text-white mb-3 font-display">
                {t('welcome')} <span className="text-gold-gradient">{userEmail.split('@')[0]}</span>
              </h1>
              <p className="text-2xl text-white/80 mb-4">{t('welcomeSub')}</p>
              <p className="text-white/60">{t('welcomeDesc')}</p>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 text-right">
            <p className="font-script text-4xl text-gold-gradient">{t('captureMoments')}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl p-6 card-hover" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="p-3 rounded-xl mb-4 inline-block" style={{ backgroundColor: 'rgba(212, 165, 116, 0.15)' }}>
              <Calendar className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-3xl font-bold mb-1">{albums.length}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('totalSessions')}</p>
          </div>
          <div className="rounded-2xl p-6 card-hover" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="p-3 rounded-xl mb-4 inline-block" style={{ backgroundColor: 'rgba(212, 165, 116, 0.15)' }}>
              <ImageIcon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-3xl font-bold mb-1">{totalPhotos}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('totalPhotos')}</p>
          </div>
          <button onClick={() => albums[0] && openAlbum(albums[0])} className="rounded-2xl p-6 text-white shadow-lg text-left transition-all" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
            <div className="p-3 rounded-xl mb-4 inline-block bg-white/20"><ImageIcon className="w-6 h-6 text-white" /></div>
            <p className="text-xl font-bold mb-1">{t('viewSessions')}</p>
            <p className="text-sm text-white/80">{t('viewSessionsSub')}</p>
          </button>
        </div>

        {/* Sessions */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Camera className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold font-display">{t('yourSessions')}</h2>
          </div>
          <div className="space-y-4">
            {albums.map((album) => (
              <div key={album.id} onClick={() => openAlbum(album)} className="rounded-2xl p-6 card-hover cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-6">
                  <div className="relative w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.2), var(--bg-card))' }}>
                      <Camera className="w-12 h-12" style={{ color: 'var(--accent)', opacity: 0.5 }} />
                    </div>
                    <div className="absolute bottom-2 left-2 glass px-3 py-1 rounded-lg flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      <span className="text-sm text-white">{albumCounts[album.id] || 0} {t('photos_count')}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getSessionIcon(album.session_type || 'other')}</span>
                      <h3 className="text-xl font-bold">{album.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(album.session_date || album.created_at)}</span>
                      {album.clients?.name && <span className="flex items-center gap-1"><User className="w-4 h-4" />{album.clients.name}</span>}
                    </div>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{album.description || ''}</p>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-all" style={{ backgroundColor: 'var(--accent)' }}>
                      <Download className="w-4 h-4" /><span>{t('downloadPhotos')}</span>
                    </button>
                  </div>
                  <ChevronLeft className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
            {albums.length === 0 && (
              <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)', opacity: 0.3 }} />
                <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{t('noSessions')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Footer */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Camera className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                <div>
                  <h3 className="text-xl font-bold">{t('contactHelp')}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('contactDesc')}</p>
                </div>
              </div>
              <a href="https://wa.me/201225979165" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all" style={{ backgroundColor: 'var(--accent)' }}>
                <MessageCircle className="w-5 h-5" /><span>{t('contactWhatsapp')}</span>
              </a>
            </div>
            <div className="space-y-3">
              <a href="tel:+201225979165" className="flex items-center gap-3 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                <Phone className="w-5 h-5" /><span>+20 122 597 9165</span>
              </a>
              <a href="https://www.instagram.com/boles.photography" target="_blank" className="flex items-center gap-3 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                <InstagramIcon className="w-5 h-5" /><span>Instagram</span>
              </a>
              <a href="https://www.facebook.com/share/1E6Xrgdz27/" target="_blank" className="flex items-center gap-3 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                <FacebookIcon className="w-5 h-5" /><span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}