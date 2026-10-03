'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Users, Folder, Image, LogOut, Plus, X, Copy, ExternalLink, Trash2, Globe, Crown, Upload, FileImage, FileVideo, FolderOpen, Loader2, HardDrive, CheckCircle2 } from 'lucide-react';

const translations = {
  ar: {
    welcome: 'مرحباً بك، لنصنع ذكريات لا تُنسى ✨',
    overview: 'إليك نظرة عامة على نشاطك.',
    addClient: 'إضافة عميل',
    createAlbum: 'إنشاء ألبوم',
    totalClients: 'إجمالي العملاء',
    activeAlbums: 'الألبومات النشطة',
    usedSpace: 'المساحة المتبقية',
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
    uploadMedia: 'رفع الوسائط',
    confirmDeleteClient: 'هل أنت متأكد من حذف هذا العميل؟ سيتم حذف جميع ألبوماته أيضاً!',
    confirmDeleteAlbum: 'هل أنت متأكد من حذف هذا الألبوم؟',
    addClientTitle: 'إضافة عميل جديد',
    createAlbumTitle: 'إنشاء ألبوم جديد',
    uploadMediaTitle: 'رفع الوسائط',
    logout: 'تسجيل الخروج',
    home: 'الرئيسية',
    clients: 'العملاء',
    albums: 'الألبومات',
    langToggle: 'English',
    uploadFiles: 'رفع ملفات',
    uploadFolder: 'رفع مجلد كامل',
    noMedia: 'لا توجد ملفات في هذا الألبوم',
    confirmDeleteMedia: 'هل أنت متأكد من حذف هذا الملف؟',
    files: 'الملفات',
    uploading: 'جاري الرفع...',
    photos: 'صور',
    maxSpace: '22 GB',
    allAlbums: 'جميع الألبومات',
    allClients: 'جميع العملاء',
    uploaded: 'تم رفع',
    remaining: 'المتبقي',
    uploadComplete: 'اكتمل الرفع بنجاح!',
    uploadFailed: 'فشل بعض الملفات',
    backToDashboard: 'العودة للداشبورد',
    deleteSelected: 'حذف المحدد',
    confirmDeleteSelected: 'هل أنت متأكد من حذف الصور المحددة؟'
  },
  en: {
    welcome: 'Welcome, Let\'s Create Unforgettable Memories ',
    overview: 'Here is an overview of your activity.',
    addClient: 'Add Client',
    createAlbum: 'Create Album',
    totalClients: 'Total Clients',
    activeAlbums: 'Active Albums',
    usedSpace: 'Remaining Space',
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
    uploadMedia: 'Upload Media',
    confirmDeleteClient: 'Are you sure? All their albums will be deleted too!',
    confirmDeleteAlbum: 'Are you sure you want to delete this album?',
    addClientTitle: 'Add New Client',
    createAlbumTitle: 'Create New Album',
    uploadMediaTitle: 'Upload Media',
    logout: 'Logout',
    home: 'Home',
    clients: 'Clients',
    albums: 'Albums',
    langToggle: 'العربية',
    uploadFiles: 'Upload Files',
    uploadFolder: 'Upload Folder',
    noMedia: 'No files in this album',
    confirmDeleteMedia: 'Are you sure you want to delete this file?',
    files: 'Files',
    uploading: 'Uploading...',
    photos: 'photos',
    maxSpace: '22 GB',
    allAlbums: 'All Albums',
    allClients: 'All Clients',
    uploaded: 'Uploaded',
    remaining: 'Remaining',
    uploadComplete: 'Upload Complete!',
    uploadFailed: 'Some files failed',
    backToDashboard: 'Back to Dashboard',
    deleteSelected: 'Delete Selected',
    confirmDeleteSelected: 'Are you sure you want to delete selected photos?'
  }
};

const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

type ActiveTab = 'home' | 'clients' | 'albums';

export default function DashboardPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
  const t = (key: keyof typeof translations.ar) => translations[lang][key];

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [loading, setLoading] = useState(true);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [managingAlbum, setManagingAlbum] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientName, setClientName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [albumMedia, setAlbumMedia] = useState<any[]>([]);
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [usedSpaceMB, setUsedSpaceMB] = useState(0);
  const [totalUploadFiles, setTotalUploadFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(0);

  const MAX_SPACE_MB = 22528;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) { await loadData(); } else { window.location.href = '/'; }
      setLoading(false);
    };
    checkUser();
  }, []);

  const loadData = async () => {
    const { data: clientsData } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (clientsData) setClients(clientsData);
    const { data: albumsData } = await supabase.from('albums').select('*, clients(name)').order('created_at', { ascending: false });
    if (albumsData) {
      setAlbums(albumsData);
      const counts: Record<string, number> = {};
      let totalSizeMB = 0;
      for (const album of albumsData) {
        const { data: mediaData, count } = await supabase.from('media').select('url', { count: 'exact' }).eq('album_id', album.id);
        counts[album.id] = count || 0;
        if (mediaData) totalSizeMB += (count || 0) * 3;
      }
      setAlbumCounts(counts);
      setUsedSpaceMB(totalSizeMB);
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/'; };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('clients').insert([{ name: clientName }]).select();
    if (!error && data) { setClients([data[0], ...clients]); setClientName(''); setShowClientForm(false); }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm(t('confirmDeleteClient'))) {
      const { error } = await supabase.from('clients').delete().eq('id', clientId);
      if (!error) { setClients(clients.filter(c => c.id !== clientId)); setAlbums(albums.filter(a => a.client_id !== clientId)); }
    }
  };

  const handleAddAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = generateToken();
    const { data, error } = await supabase.from('albums').insert([{ name: albumName, description: albumDescription, client_id: selectedClient?.id, is_public: true, share_token: token }]).select();
    if (!error && data) {
      const client = clients.find(c => c.id === selectedClient?.id);
      const newAlbum = { ...data[0], clients: client ? { name: client.name } : null };
      setAlbums([newAlbum, ...albums]);
      setAlbumCounts(prev => ({ ...prev, [newAlbum.id]: 0 }));
      setAlbumName(''); setAlbumDescription(''); setShowAlbumForm(false); setSelectedClient(null);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (window.confirm(t('confirmDeleteAlbum'))) {
      const { error } = await supabase.from('albums').delete().eq('id', albumId);
      if (!error) { setAlbums(albums.filter(a => a.id !== albumId)); loadData(); }
    }
  };

  const openManageAlbum = async (album: any) => {
    let albumWithToken = album;
    if (!album.share_token) {
      const token = generateToken();
      const { data } = await supabase.from('albums').update({ share_token: token }).eq('id', album.id).select().single();
      if (data) albumWithToken = data;
    }
    setManagingAlbum(albumWithToken);
    setShowManageForm(true);
    setUploadComplete(false);
    setUploadFailed(0);
    setUploadedFiles(0);
    setTotalUploadFiles(0);
    setUploadProgress(0);
    const { data } = await supabase.from('media').select('*').eq('album_id', albumWithToken.id).order('created_at', { ascending: false });
    if (data) setAlbumMedia(data);
  };

  const uploadFilesDirect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadedFiles(0);
    setUploadComplete(false);
    setUploadFailed(0);

    const totalFiles = files.length;
    setTotalUploadFiles(totalFiles);
    let uploadedCount = 0;
    let successCount = 0;
    let failedCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          uploadedCount++;
          setUploadedFiles(uploadedCount);
          setUploadProgress((uploadedCount / totalFiles) * 100);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'lens-upload');
        formData.append('cloud_name', 'hcs8l8f1h');
        formData.append('api_key', '143232795822287');

        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/hcs8l8f1h/auto/upload`, {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (result.secure_url) {
            await supabase.from('media').insert([{
              album_id: managingAlbum.id,
              url: result.secure_url,
              type: result.resource_type === 'video' ? 'video' : 'image',
              cloudinary_public_id: result.public_id,
            }]);
            successCount++;
          } else {
            failedCount++;
          }
        } catch (err) {
          console.error('Upload error for file:', file.name, err);
          failedCount++;
        }

        uploadedCount++;
        setUploadedFiles(uploadedCount);
        setUploadProgress((uploadedCount / totalFiles) * 100);
      }

      const { count } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('album_id', managingAlbum.id);
      setAlbumCounts(prev => ({ ...prev, [managingAlbum.id]: count || 0 }));

      const { data: mediaData } = await supabase.from('media').select('*').eq('album_id', managingAlbum.id).order('created_at', { ascending: false });
      if (mediaData) setAlbumMedia(mediaData);
      loadData();

      if (failedCount > 0) {
        setUploadFailed(failedCount);
      } else {
        setUploadComplete(true);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!window.confirm(t('confirmDeleteMedia'))) return;
    await supabase.from('media').delete().eq('id', mediaId);
    setAlbumMedia(albumMedia.filter(m => m.id !== mediaId));
    loadData();
  };

  const copyAlbumLink = (shareToken: string) => {
    const link = `${window.location.origin}/album/${shareToken}`;
    navigator.clipboard.writeText(link);
    setCopiedId(shareToken);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAlbum = (shareToken: string) => {
    if (!shareToken) {
      alert('لا يوجد رابط للألبوم');
      return;
    }
    window.open(`/album/${shareToken}`, '_blank');
  };

  const formatSpace = (mb: number) => mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className={`min-h-screen text-white flex relative ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="fixed inset-0 z-0" style={{ backgroundImage: 'url(/mybackground.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)', transform: 'scale(1.1)' }} />
      <div className="fixed inset-0 bg-black/60 z-0" />

      <aside className={`relative z-10 w-64 bg-gray-900/80 backdrop-blur-sm border-r border-amber-500/20 p-6 flex flex-col ${lang === 'ar' ? 'border-l border-r-0' : ''}`}>
        <div className="mb-8">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h1 className="text-2xl font-bold text-amber-500 tracking-wider">LENS</h1>
              <p className="text-gray-300 text-sm mt-1">Photography Platform</p>
            </div>
            <button onClick={toggleLang} className="text-amber-500 hover:text-amber-400 transition-colors"><Globe className="w-4 h-4" /></button>
          </div>
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/20 rounded-md"><Crown className="w-4 h-4 text-amber-400" /></div>
              <div>
                <p className="text-[10px] text-amber-400/70 uppercase tracking-wider">Owner</p>
                <p className="text-sm font-semibold text-amber-300">Boles Elhamy</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-gray-300 hover:bg-amber-500/10 hover:text-amber-500'}`}>
            <Folder className="w-4 h-4" /><span className="text-sm">{t('home')}</span>
          </button>
          <button onClick={() => setActiveTab('clients')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'clients' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-gray-300 hover:bg-amber-500/10 hover:text-amber-500'}`}>
            <Users className="w-4 h-4" /><span className="text-sm">{t('clients')}</span>
          </button>
          <button onClick={() => setActiveTab('albums')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'albums' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-gray-300 hover:bg-amber-500/10 hover:text-amber-500'}`}>
            <Image className="w-4 h-4" /><span className="text-sm">{t('albums')}</span>
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-auto">
          <LogOut className="w-4 h-4" /><span className="text-sm">{t('logout')}</span>
        </button>
      </aside>

      <main className="relative z-10 flex-1 p-8 overflow-y-auto">
        
        {activeTab === 'home' && (
          <>
            <header className="flex justify-between items-center mb-8">
              <div><h2 className="text-3xl font-bold">{t('welcome')}</h2><p className="text-gray-300 mt-1">{t('overview')}</p></div>
              <div className="flex gap-3">
                <button onClick={() => setShowClientForm(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg"><Plus className="w-4 h-4" />{t('addClient')}</button>
                <button onClick={() => setShowAlbumForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg"><Plus className="w-4 h-4" />{t('createAlbum')}</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-4"><h3 className="text-gray-300">{t('totalClients')}</h3><Users className="w-5 h-5 text-amber-500" /></div>
                <p className="text-4xl font-bold">{clients.length}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-4"><h3 className="text-gray-300">{t('activeAlbums')}</h3><Folder className="w-5 h-5 text-amber-500" /></div>
                <p className="text-4xl font-bold">{albums.length}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-4"><h3 className="text-gray-300">{t('usedSpace')}</h3><HardDrive className="w-5 h-5 text-amber-500" /></div>
                {(() => {
                  const remainingMB = MAX_SPACE_MB - usedSpaceMB;
                  const remainingDisplay = remainingMB >= 1024 ? `${(remainingMB / 1024).toFixed(1)} GB` : `${remainingMB} MB`;
                  const remainingPercent = 100 - Math.min((usedSpaceMB / MAX_SPACE_MB) * 100, 100);
                  return (
                    <>
                      <p className="text-3xl font-bold text-green-400">{remainingDisplay} <span className="text-base text-gray-400">متبقي من {t('maxSpace')}</span></p>
                      <div className="mt-3 w-full bg-gray-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${remainingPercent}%` }}></div></div>
                      <p className="text-xs text-gray-400 mt-2">تم استخدام {formatSpace(usedSpaceMB)} من {t('maxSpace')}</p>
                    </>
                  );
                })()}
              </motion.div>
            </div>

            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">{t('albums')} ({albums.length})</h3>
              {albums.length === 0 ? <p className="text-gray-400 text-center py-8">{t('noAlbums')}</p> : (
                <div className="space-y-3">
                  {albums.map((album) => (
                    <div key={album.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3"><h4 className="font-semibold text-lg">{album.name}</h4><span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">{albumCounts[album.id] || 0} {t('photos')}</span></div>
                        <p className="text-gray-400 text-sm">{album.clients?.name || 'No Client'}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button onClick={() => openManageAlbum(album)} className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"><Upload className="w-4 h-4" /> {t('uploadMedia')}</button>
                        <button onClick={() => copyAlbumLink(album.share_token)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">{copiedId === album.share_token ? t('copied') : <><Copy className="w-4 h-4" /> {t('copyLink')}</>}</button>
                        <button onClick={() => openAlbum(album.share_token)} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"><ExternalLink className="w-4 h-4" /> {t('open')}</button>
                        <button onClick={() => handleDeleteAlbum(album.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
              <h3 className="text-xl font-bold mb-4">{t('clients')} ({clients.length})</h3>
              {clients.length === 0 ? <p className="text-gray-400 text-center py-8">{t('noClients')}</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client) => (
                    <div key={client.id} className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center"><span className="text-amber-500 font-bold text-lg">{client.name.charAt(0).toUpperCase()}</span></div>
                        <div><h4 className="font-semibold">{client.name}</h4><p className="text-gray-400 text-sm">{new Date(client.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p></div>
                      </div>
                      <button onClick={() => handleDeleteClient(client.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'clients' && (
          <>
            <header className="flex justify-between items-center mb-8">
              <div><h2 className="text-3xl font-bold">{t('allClients')} ({clients.length})</h2><p className="text-gray-300 mt-1">{t('overview')}</p></div>
              <button onClick={() => setShowClientForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg"><Plus className="w-4 h-4" />{t('addClient')}</button>
            </header>
            {clients.length === 0 ? (
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-12 text-center"><Users className="w-16 h-16 text-amber-500/30 mx-auto mb-4" /><p className="text-gray-400 text-xl">{t('noClients')}</p></div>
            ) : (
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
                <div className="space-y-3">
                  {clients.map((client) => {
                    const clientAlbums = albums.filter(a => a.client_id === client.id);
                    const totalPhotos = clientAlbums.reduce((sum, a) => sum + (albumCounts[a.id] || 0), 0);
                    return (
                      <div key={client.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center"><span className="text-amber-500 font-bold text-xl">{client.name.charAt(0).toUpperCase()}</span></div>
                          <div><h4 className="font-semibold text-lg">{client.name}</h4><p className="text-gray-400 text-sm">{clientAlbums.length} {t('albums')} • {totalPhotos} {t('photos')}</p><p className="text-gray-500 text-xs mt-1">{new Date(client.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p></div>
                        </div>
                        <button onClick={() => handleDeleteClient(client.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'albums' && (
          <>
            <header className="flex justify-between items-center mb-8">
              <div><h2 className="text-3xl font-bold">{t('allAlbums')} ({albums.length})</h2><p className="text-gray-300 mt-1">{t('overview')}</p></div>
              <button onClick={() => setShowAlbumForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg"><Plus className="w-4 h-4" />{t('createAlbum')}</button>
            </header>
            {albums.length === 0 ? (
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-12 text-center"><Folder className="w-16 h-16 text-amber-500/30 mx-auto mb-4" /><p className="text-gray-400 text-xl">{t('noAlbums')}</p></div>
            ) : (
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
                <div className="space-y-3">
                  {albums.map((album) => (
                    <div key={album.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3"><Folder className="w-5 h-5 text-amber-500" /><h4 className="font-semibold text-lg">{album.name}</h4><span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">{albumCounts[album.id] || 0} {t('photos')}</span></div>
                        <p className="text-gray-400 text-sm mt-1">{album.clients?.name || 'No Client'}</p>
                        <p className="text-gray-500 text-xs mt-1">{new Date(album.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button onClick={() => openManageAlbum(album)} className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"><Upload className="w-4 h-4" /> {t('uploadMedia')}</button>
                        <button onClick={() => copyAlbumLink(album.share_token)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">{copiedId === album.share_token ? t('copied') : <><Copy className="w-4 h-4" /> {t('copyLink')}</>}</button>
                        <button onClick={() => openAlbum(album.share_token)} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"><ExternalLink className="w-4 h-4" /> {t('open')}</button>
                        <button onClick={() => handleDeleteAlbum(album.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {showClientForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">{t('addClientTitle')}</h3><button onClick={() => setShowClientForm(false)}><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <input type="text" placeholder={t('clientName')} value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white" required />
              <div className="flex gap-3"><button type="button" onClick={() => setShowClientForm(false)} className="flex-1 px-4 py-3 bg-gray-700 rounded-lg">{t('cancel')}</button><button type="submit" className="flex-1 px-4 py-3 bg-amber-500 text-black rounded-lg font-semibold">{t('save')}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {showAlbumForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">{t('createAlbumTitle')}</h3><button onClick={() => setShowAlbumForm(false)}><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleAddAlbum} className="space-y-4">
              <input type="text" placeholder={t('albumName')} value={albumName} onChange={(e) => setAlbumName(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white" required />
              <textarea placeholder={t('description')} value={albumDescription} onChange={(e) => setAlbumDescription(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white" rows={3} />
              <select value={selectedClient?.id || ''} onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value) || null)} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                <option value="">{t('selectClient')}</option>
                {clients.map((client) => (<option key={client.id} value={client.id}>{client.name}</option>))}
              </select>
              <div className="flex gap-3"><button type="button" onClick={() => setShowAlbumForm(false)} className="flex-1 px-4 py-3 bg-gray-700 rounded-lg">{t('cancel')}</button><button type="submit" className="flex-1 px-4 py-3 bg-amber-500 text-black rounded-lg font-semibold">{t('save')}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {showManageForm && managingAlbum && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div><h3 className="text-xl font-bold">{t('uploadMediaTitle')}: {managingAlbum.name}</h3><p className="text-gray-400 text-sm mt-1">{albumMedia.length} {t('files')}</p></div>
              <button onClick={() => { setShowManageForm(false); setManagingAlbum(null); setUploading(false); setUploadComplete(false); }}><X className="w-5 h-5" /></button>
            </div>

            {/* أزرار الرفع - تختفي أثناء الرفع */}
            {!uploading && !uploadComplete && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-500/5 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">{t('uploadFiles')}</p>
                  <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={(e) => uploadFilesDirect(e.target.files)} />
                </label>
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-500/5 transition-colors">
                  <FolderOpen className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">{t('uploadFolder')}</p>
                  <input type="file" className="hidden" multiple {...({ webkitdirectory: 'true', directory: 'true' } as any)} onChange={(e) => uploadFilesDirect(e.target.files)} />
                </label>
              </div>
            )}

            {/* قائمة الملفات */}
            <div className="space-y-3">
              {albumMedia.length === 0 && !uploading ? <p className="text-gray-400 text-center py-8">{t('noMedia')}</p> : (
                albumMedia.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-600 flex-shrink-0">{item.type === 'image' ? <img src={item.url} alt="" className="w-full h-full object-cover" /> : <video src={item.url} className="w-full h-full object-cover" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">{item.type === 'image' ? <FileImage className="w-4 h-4 text-amber-500" /> : <FileVideo className="w-4 h-4 text-amber-500" />}<span className="text-sm text-gray-300">{item.type === 'image' ? 'صورة' : 'فيديو'}</span></div>
                    </div>
                    <button onClick={() => handleDeleteMedia(item.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Progress Indicator في الأسفل على اليمين */}
      {(uploading || uploadComplete) && (
        <div className={`fixed bottom-6 right-6 z-50 backdrop-blur-sm border rounded-xl p-4 shadow-2xl min-w-[300px] ${uploadComplete ? 'bg-green-900/95 border-green-500/30' : 'bg-gray-900/95 border-amber-500/30'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {uploading ? (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              <span className={`text-sm font-semibold ${uploadComplete ? 'text-green-400' : 'text-amber-500'}`}>
                {uploadComplete ? t('uploadComplete') : t('uploading')}
              </span>
            </div>
            <button 
              onClick={() => { setUploading(false); setUploadComplete(false); setUploadProgress(0); setUploadedFiles(0); setTotalUploadFiles(0); }}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {!uploadComplete && (
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{t('uploaded')}: <span className="text-green-400 font-bold">{uploadedFiles}</span></span>
            {!uploadComplete && <span className="text-gray-400">{t('remaining')}: <span className="text-amber-400 font-bold">{totalUploadFiles - uploadedFiles}</span></span>}
            {uploadFailed > 0 && <span className="text-red-400">فشل: {uploadFailed}</span>}
            {!uploadComplete && <span className="text-amber-500 font-bold">{Math.round(uploadProgress)}%</span>}
          </div>
        </div>
      )}
    </div>
  );
}