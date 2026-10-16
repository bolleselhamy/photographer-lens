'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Home, Calendar, Image as ImageIcon, Download, Bell, User, Headphones, 
  Plus, X, Copy, ExternalLink, Trash2, Upload, FileImage, FileVideo, 
  Loader2, CheckCircle2, Phone, MessageCircle, Camera, Shield, 
  UserCheck, UserX, UserCog, Edit, Save, LogOut, Sun, Moon,
  Users, ChevronLeft, TrendingUp, Globe, Search, Sparkles
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
    addClient: 'إضافة عميل', createAlbum: 'إنشاء جلسة',
    totalSessions: 'إجمالي الجلسات', totalPhotos: 'إجمالي الصور',
    todayDownloads: 'التنزيلات اليوم', downloadAll: 'تحميل الكل',
    downloadAllSub: '(جلسة محددة)', yourSessions: 'جلساتك',
    viewAll: 'عرض الكل', noAlbums: 'لا توجد جلسات بعد.',
    noClients: 'لا يوجد عملاء بعد.', clientName: 'اسم العميل',
    albumName: 'اسم الجلسة', description: 'الوصف',
    selectClient: 'اختر العميل', cancel: 'إلغاء', save: 'حفظ',
    copyLink: 'نسخ الرابط', copied: 'تم النسخ', open: 'فتح',
    uploadMedia: 'رفع الوسائط', downloadPhotos: 'تحميل الصور',
    confirmDeleteClient: 'هل أنت متأكد من حذف هذا العميل؟',
    confirmDeleteAlbum: 'هل أنت متأكد من حذف هذه الجلسة؟',
    addClientTitle: 'إضافة عميل جديد', createAlbumTitle: 'إنشاء جلسة جديدة',
    uploadMediaTitle: 'رفع الوسائط', logout: 'تسجيل الخروج',
    home: 'الرئيسية', mySessions: 'جلساتي', photos: 'الصور',
    downloads: 'التنزيلات', notifications: 'الإشعارات',
    profile: 'الملف الشخصي', support: 'الدعم',
    clients: 'العملاء', albums: 'الألبومات',
    permissions: 'الصلاحيات', userManagement: 'إدارة المستخدمين',
    pendingRequests: 'طلبات معلقة', approvedUsers: 'المستخدمون المعتمدون',
    allUsers: 'جميع المستخدمين', approve: 'موافقة', reject: 'رفض',
    viewer: 'مشاهد', editor: 'محرر', admin: 'مدير',
    noPendingRequests: 'لا توجد طلبات معلقة',
    noApprovedUsers: 'لا يوجد مستخدمون معتمدون', noUsers: 'لا يوجد مستخدمون',
    addUser: 'إضافة مستخدم', editUser: 'تعديل مستخدم',
    removeUser: 'إزالة مستخدم', confirmDeleteUser: 'هل أنت متأكد من حذف هذا المستخدم؟',
    email: 'البريد الإلكتروني', role: 'الصلاحية',
    photos_count: 'صورة', contactHelp: 'هل تحتاج إلى مساعدة؟',
    contactDesc: 'تواصل معي لأي استفسار أو دعم فني.',
    contactWhatsapp: 'تواصل عبر واتساب',
    photographer: 'Boles Elhamy', weddingLabel: 'جلسة زفاف',
    portraitLabel: 'جلسة بورتريه', eventLabel: 'مناسبات خاصة',
    otherLabel: 'أخرى', search: 'بحث...',
    captureMoments: 'Capture Your Moments',
    noSessionsYet: 'لا توجد جلسات بعد. أنشئ أول جلسة!',
    wedding: 'جلسة زفاف', portrait: 'جلسة بورتريه',
    event: 'مناسبات خاصة', other: 'أخرى',
    sessionType: 'نوع الجلسة', sessionDate: 'تاريخ الجلسة',
    selectDate: 'اختر التاريخ', confirmDeleteMedia: 'هل أنت متأكد من حذف هذا الملف؟',
    noMedia: 'لا توجد ملفات', files: 'ملفات', uploading: 'جاري الرفع...',
    uploaded: 'تم رفع', uploadComplete: 'اكتمل الرفع!',
    image: 'صورة', video: 'فيديو'
  },
  en: {
    welcome: 'Welcome', welcomeSub: 'to browse your memories',
    welcomeDesc: 'Here is an overview of your sessions. You can now access and download your photos easily.',
    addClient: 'Add Client', createAlbum: 'Create Session',
    totalSessions: 'Total Sessions', totalPhotos: 'Total Photos',
    todayDownloads: 'Today\'s Downloads', downloadAll: 'Download All',
    downloadAllSub: '(Selected Session)', yourSessions: 'Your Sessions',
    viewAll: 'View All', noAlbums: 'No sessions yet.',
    noClients: 'No clients yet.', clientName: 'Client Name',
    albumName: 'Session Name', description: 'Description',
    selectClient: 'Select Client', cancel: 'Cancel', save: 'Save',
    copyLink: 'Copy Link', copied: 'Copied', open: 'Open',
    uploadMedia: 'Upload Media', downloadPhotos: 'Download Photos',
    confirmDeleteClient: 'Are you sure?', confirmDeleteAlbum: 'Are you sure?',
    addClientTitle: 'Add New Client', createAlbumTitle: 'Create New Session',
    uploadMediaTitle: 'Upload Media', logout: 'Logout',
    home: 'Home', mySessions: 'My Sessions', photos: 'Photos',
    downloads: 'Downloads', notifications: 'Notifications',
    profile: 'Profile', support: 'Support',
    clients: 'Clients', albums: 'Albums',
    permissions: 'Permissions', userManagement: 'User Management',
    pendingRequests: 'Pending Requests', approvedUsers: 'Approved Users',
    allUsers: 'All Users', approve: 'Approve', reject: 'Reject',
    viewer: 'Viewer', editor: 'Editor', admin: 'Admin',
    noPendingRequests: 'No pending requests',
    noApprovedUsers: 'No approved users', noUsers: 'No users',
    addUser: 'Add User', editUser: 'Edit User',
    removeUser: 'Remove User', confirmDeleteUser: 'Are you sure?',
    email: 'Email', role: 'Role',
    photos_count: 'photos', contactHelp: 'Need Help?',
    contactDesc: 'Contact me for any inquiry.',
    contactWhatsapp: 'Contact via WhatsApp',
    photographer: 'Boles Elhamy', weddingLabel: 'Wedding Session',
    portraitLabel: 'Portrait Session', eventLabel: 'Special Events',
    otherLabel: 'Other', search: 'Search...',
    captureMoments: 'Capture Your Moments',
    noSessionsYet: 'No sessions yet. Create your first one!',
    wedding: 'Wedding Session', portrait: 'Portrait Session',
    event: 'Special Events', other: 'Other',
    sessionType: 'Session Type', sessionDate: 'Session Date',
    selectDate: 'Select date', confirmDeleteMedia: 'Are you sure?',
    noMedia: 'No files', files: 'files', uploading: 'Uploading...',
    uploaded: 'Uploaded', uploadComplete: 'Upload Complete!',
    image: 'Image', video: 'Video'
  }
};

const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

type ActiveTab = 'home' | 'sessions' | 'photos' | 'downloads' | 'notifications' | 'profile' | 'support' | 'clients' | 'albums' | 'permissions' | 'users';

export default function DashboardPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  const t = (key: string): string => translations[lang][key] || key;

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [loading, setLoading] = useState(true);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [managingAlbum, setManagingAlbum] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientName, setClientName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [sessionType, setSessionType] = useState('wedding');
  const [sessionDate, setSessionDate] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [albumMedia, setAlbumMedia] = useState<any[]>([]);
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalUploadFiles, setTotalUploadFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'viewer' | 'editor'>('viewer');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadAlbum, setPendingUploadAlbum] = useState<any>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserEmail(user.email || '');
        const userEmail = user.email?.toLowerCase();
        const adminEmail = 'popbop202@gmail.com';

        if (userEmail === adminEmail) {
          setUserRole('admin');
          await supabase.from('admins').upsert({ email: userEmail }, { onConflict: 'email' });
          await loadData();
          setLoading(false);
          return;
        }

        const { data: adminData } = await supabase.from('admins').select('email').ilike('email', userEmail || '').single();
        if (adminData) { setUserRole('admin'); await loadData(); setLoading(false); return; }

        const { data: approvedData } = await supabase.from('approved_users').select('*').ilike('email', userEmail || '').eq('is_active', true).single();
        if (approvedData) {
          setUserRole(approvedData.role);
          if (approvedData.role !== 'admin') { window.location.href = '/client'; return; }
          await loadData(); setLoading(false); return;
        }

        await supabase.auth.signOut();
        window.location.href = '/';
      } else { window.location.href = '/'; }
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
      for (const album of albumsData) {
        const { count } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('album_id', album.id);
        counts[album.id] = count || 0;
      }
      setAlbumCounts(counts);
    }
    await loadPermissions();
    await loadAllUsers();
  };

  const loadPermissions = async () => {
    const { data: pending } = await supabase.from('pending_users').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    if (pending) setPendingUsers(pending);
    const { data: approved } = await supabase.from('approved_users').select('*').order('created_at', { ascending: false });
    if (approved) setApprovedUsers(approved);
  };

  const loadAllUsers = async () => {
    const { data: admins } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
    const { data: approved } = await supabase.from('approved_users').select('*').order('created_at', { ascending: false });
    const adminEmails = new Set(admins?.map((a: any) => a.email.toLowerCase()) || []);
    const allUsersList = [
      ...(admins?.map((u: any) => ({ ...u, role: 'admin', source: 'admin' })) || []),
      ...(approved?.filter((u: any) => !adminEmails.has(u.email.toLowerCase())).map((u: any) => ({ ...u, source: 'approved' })) || [])
    ];
    setAllUsers(allUsersList);
  };

  const handleApprove = async (email: string, role: 'viewer' | 'editor') => {
    await supabase.from('approved_users').upsert([{ email, role, is_active: true, session_token: generateToken(), approved_at: new Date().toISOString() }], { onConflict: 'email' });
    await supabase.from('pending_users').update({ status: 'approved' }).eq('email', email);
    await loadPermissions(); await loadAllUsers();
  };

  const handleReject = async (email: string) => {
    await supabase.from('pending_users').update({ status: 'rejected' }).eq('email', email);
    await loadPermissions();
  };

  const handleDeactivateUser = async (email: string) => {
    await supabase.from('approved_users').update({ is_active: false, session_token: null }).ilike('email', email);
    await loadPermissions(); await loadAllUsers();
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;
    if (newUserRole === 'admin') await supabase.from('admins').upsert({ email: newUserEmail }, { onConflict: 'email' });
    await supabase.from('approved_users').upsert([{ email: newUserEmail, role: newUserRole, is_active: true, session_token: generateToken(), approved_at: new Date().toISOString() }], { onConflict: 'email' });
    const { error } = await supabase.auth.signInWithOtp({ email: newUserEmail, options: { shouldCreateUser: true } });
    if (error) { alert('فشل إرسال الدعوة.'); return; }
    setNewUserEmail(''); setNewUserRole('viewer'); setShowUserForm(false);
    await loadAllUsers();
    alert(`✓ تم إرسال دعوة إلى ${newUserEmail}`);
  };

  const handleEditUser = async (user: any, newRole: 'viewer' | 'editor' | 'admin') => {
    if (newRole === 'admin') {
      await supabase.from('admins').upsert({ email: user.email }, { onConflict: 'email' });
      await supabase.from('approved_users').upsert([{ email: user.email, role: 'admin', is_active: true, approved_at: new Date().toISOString() }], { onConflict: 'email' });
    } else {
      await supabase.from('admins').delete().eq('email', user.email);
      await supabase.from('approved_users').upsert([{ email: user.email, role: newRole, is_active: true, approved_at: new Date().toISOString() }], { onConflict: 'email' });
    }
    setEditingUser(null); await loadAllUsers();
  };

  const handleDeleteUser = async (user: any) => {
    if (!window.confirm(t('confirmDeleteUser'))) return;
    await supabase.from('admins').delete().eq('email', user.email);
    await supabase.from('approved_users').delete().ilike('email', user.email);
    await loadAllUsers();
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
    const { data, error } = await supabase.from('albums').insert([{ name: albumName, description: albumDescription, client_id: selectedClient?.id, is_public: true, share_token: token, session_type: sessionType, session_date: sessionDate || new Date().toISOString() }]).select();
    if (!error && data) {
      const client = clients.find(c => c.id === selectedClient?.id);
      const newAlbum = { ...data[0], clients: client ? { name: client.name } : null };
      setAlbums([newAlbum, ...albums]);
      setAlbumCounts(prev => ({ ...prev, [newAlbum.id]: 0 }));
      setAlbumName(''); setAlbumDescription(''); setSessionType('wedding'); setSessionDate('');
      setShowAlbumForm(false); setSelectedClient(null);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (window.confirm(t('confirmDeleteAlbum'))) {
      const { error } = await supabase.from('albums').delete().eq('id', albumId);
      if (!error) { setAlbums(albums.filter(a => a.id !== albumId)); loadData(); }
    }
  };

  const triggerFileUpload = (album: any) => { setPendingUploadAlbum(album); fileInputRef.current?.click(); };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0 || !pendingUploadAlbum) return;
    let albumWithToken = pendingUploadAlbum;
    if (!albumWithToken.share_token) {
      const token = generateToken();
      const { data } = await supabase.from('albums').update({ share_token: token }).eq('id', albumWithToken.id).select().single();
      if (data) albumWithToken = data;
    }
    setManagingAlbum(albumWithToken); setShowManageForm(true); setPendingUploadAlbum(null);
    const { data } = await supabase.from('media').select('*').eq('album_id', albumWithToken.id).order('created_at', { ascending: false });
    if (data) setAlbumMedia(data);
    await uploadFilesDirect(files, albumWithToken);
  };

  const uploadFilesDirect = async (files: FileList | null, album: any) => {
    if (!files || files.length === 0 || !album) return;
    setUploading(true); setUploadProgress(0); setUploadedFiles(0); setUploadComplete(false);
    const totalFiles = files.length; setTotalUploadFiles(totalFiles);
    let uploadedCount = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) { uploadedCount++; setUploadedFiles(uploadedCount); setUploadProgress((uploadedCount / totalFiles) * 100); continue; }
        const formData = new FormData();
        formData.append('file', file); formData.append('upload_preset', 'lens-upload'); formData.append('cloud_name', 'hcs8l8f1h'); formData.append('api_key', '143232795822287');
        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/hcs8l8f1h/auto/upload`, { method: 'POST', body: formData });
          const result = await response.json();
          if (result.secure_url) await supabase.from('media').insert([{ album_id: album.id, url: result.secure_url, type: result.resource_type === 'video' ? 'video' : 'image', cloudinary_public_id: result.public_id }]);
        } catch (err) { console.error('Upload error:', err); }
        uploadedCount++; setUploadedFiles(uploadedCount); setUploadProgress((uploadedCount / totalFiles) * 100);
      }
      const { count } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('album_id', album.id);
      setAlbumCounts(prev => ({ ...prev, [album.id]: count || 0 }));
      const { data: mediaData } = await supabase.from('media').select('*').eq('album_id', album.id).order('created_at', { ascending: false });
      if (mediaData) setAlbumMedia(mediaData);
      loadData(); setUploadComplete(true);
    } catch (error) { console.error('Upload error:', error); }
    finally { setUploading(false); }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!window.confirm(t('confirmDeleteMedia'))) return;
    await supabase.from('media').delete().eq('id', mediaId);
    setAlbumMedia(albumMedia.filter(m => m.id !== mediaId)); loadData();
  };

  const copyAlbumLink = (shareToken: string) => {
    const link = `${window.location.origin}/album/${shareToken}`;
    navigator.clipboard.writeText(link); setCopiedId(shareToken);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAlbum = (shareToken: string) => { if (!shareToken) return; window.location.href = `/album/${shareToken}`; };

  const totalPhotos = Object.values(albumCounts).reduce((sum, count) => sum + count, 0);

  const getSessionIcon = (type: string) => {
    switch(type) { case 'wedding': return ''; case 'portrait': return '👤'; case 'event': return ''; default: return '📷'; }
  };

  const getSessionTypeLabel = (type: string): string => {
    const labels: Record<string, string> = { wedding: t('wedding'), portrait: t('portrait'), event: t('event'), other: t('other') };
    return labels[type] || labels.other;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = lang === 'ar' ? ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'] : ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

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

  const navItems: { id: ActiveTab; icon: any; label: string; adminOnly?: boolean }[] = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'sessions', icon: Calendar, label: t('mySessions') },
    { id: 'photos', icon: ImageIcon, label: t('photos') },
    { id: 'downloads', icon: Download, label: t('downloads') },
    { id: 'notifications', icon: Bell, label: t('notifications') },
    { id: 'profile', icon: User, label: t('profile') },
    { id: 'support', icon: Headphones, label: t('support') },
    { id: 'permissions', icon: Shield, label: t('permissions'), adminOnly: true },
    { id: 'users', icon: UserCog, label: t('userManagement'), adminOnly: true },
  ];

  return (
    <div className={`min-h-screen flex ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Sidebar */}
      <aside className={`w-72 fixed h-full overflow-y-auto p-6 flex flex-col ${lang === 'ar' ? 'right-0 border-l' : 'left-0 border-r'}`} style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="mb-8 text-center">
          <div className="inline-block">
            <h1 className="font-script text-5xl text-gold-gradient mb-1">Boles</h1>
            <p className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--text-muted)' }}>PHOTOGRAPHY</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.filter(item => !item.adminOnly || userRole === 'admin').map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'text-white shadow-lg' : 'hover:bg-[var(--bg-hover)]'
              }`}
              style={{
                backgroundColor: activeTab === item.id ? 'var(--accent)' : 'transparent',
                color: activeTab === item.id ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === 'notifications' && pendingUsers.length > 0 && (
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Boles Elhamy</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('photographer')}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${lang === 'ar' ? 'mr-72' : 'ml-72'} overflow-y-auto`}>
        <header className="sticky top-0 z-40 px-8 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2" style={{ left: lang === 'ar' ? 'auto' : '12px', right: lang === 'ar' ? '12px' : 'auto', color: 'var(--text-muted)' }} />
              <input type="text" placeholder={t('search')} className="rounded-lg px-4 py-2 text-sm focus:outline-none w-64" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', paddingLeft: lang === 'ar' ? '12px' : '36px', paddingRight: lang === 'ar' ? '36px' : '12px' }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <Globe className="w-5 h-5" />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 rounded-lg transition-colors relative" style={{ color: 'var(--text-secondary)' }}>
              <Bell className="w-5 h-5" />
              {pendingUsers.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <>
              <div className="relative rounded-3xl overflow-hidden mb-8 h-72 animate-fade-in">
                <img src="/mybackground.png" alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                <div className="absolute inset-0 flex items-center p-10">
                  <div className="max-w-lg">
                    <h1 className="text-5xl font-bold text-white mb-3 font-display">
                      {t('welcome')} <span className="text-gold-gradient">{currentUserEmail.split('@')[0]}</span>
                    </h1>
                    <p className="text-2xl text-white/80 mb-4">{t('welcomeSub')}</p>
                    <p className="text-white/60">{t('welcomeDesc')}</p>
                    <div className="flex gap-2 mt-6">
                      <div className="w-8 h-1 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
                      <div className="w-2 h-1 rounded-full bg-white/30"></div>
                      <div className="w-2 h-1 rounded-full bg-white/30"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6 text-right">
                  <p className="font-script text-4xl text-gold-gradient">{t('captureMoments')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="rounded-2xl p-6 card-hover animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(212, 165, 116, 0.15)' }}>
                      <Calendar className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{albums.length}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('totalSessions')}</p>
                </div>

                <div className="rounded-2xl p-6 card-hover animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(212, 165, 116, 0.15)' }}>
                      <ImageIcon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{totalPhotos}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('totalPhotos')}</p>
                </div>

                <div className="rounded-2xl p-6 card-hover animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', animationDelay: '0.2s' }}>
                  <div className="p-3 rounded-xl mb-4 inline-block" style={{ backgroundColor: 'rgba(212, 165, 116, 0.15)' }}>
                    <Download className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                  </div>
                  <p className="text-3xl font-bold mb-1">0</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('todayDownloads')}</p>
                </div>

                <button onClick={() => setActiveTab('sessions')} className="rounded-2xl p-6 text-white shadow-lg animate-fade-in text-left" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', animationDelay: '0.3s' }}>
                  <div className="p-3 rounded-xl mb-4 inline-block bg-white/20">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xl font-bold mb-1">{t('downloadAll')}</p>
                  <p className="text-sm text-white/80">{t('downloadAllSub')}</p>
                </button>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Camera className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                    <h2 className="text-2xl font-bold">{t('yourSessions')}</h2>
                  </div>
                  <button onClick={() => setActiveTab('sessions')} className="flex items-center gap-2 transition-colors" style={{ color: 'var(--accent)' }}>
                    <span>{t('viewAll')}</span>
                    <ChevronLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  {albums.slice(0, 3).map((album, idx) => (
                    <div key={album.id} className="rounded-2xl p-6 card-hover animate-slide-in" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', animationDelay: `${idx * 0.1}s` }}>
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
                          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{album.description || getSessionTypeLabel(album.session_type || 'other')}</p>
                          <button onClick={() => openAlbum(album.share_token)} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm text-white" style={{ backgroundColor: 'var(--accent)' }}>
                            <Download className="w-4 h-4" />
                            <span>{t('downloadPhotos')}</span>
                          </button>
                        </div>
                        <ChevronLeft className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                  ))}
                  {albums.length === 0 && (
                    <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)', opacity: 0.3 }} />
                      <p className="text-lg mb-4" style={{ color: 'var(--text-muted)' }}>{t('noSessionsYet')}</p>
                      <button onClick={() => setShowAlbumForm(true)} className="px-6 py-2 rounded-lg text-white transition-all" style={{ backgroundColor: 'var(--accent)' }}>{t('createAlbum')}</button>
                    </div>
                  )}
                </div>
              </div>

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
                      <MessageCircle className="w-5 h-5" />
                      <span>{t('contactWhatsapp')}</span>
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
            </>
          )}

          {/* SESSIONS TAB */}
          {activeTab === 'sessions' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold font-display">{t('yourSessions')}</h2>
                  <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{albums.length} {lang === 'ar' ? 'جلسة' : 'sessions'}</p>
                </div>
                <button onClick={() => setShowAlbumForm(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all" style={{ backgroundColor: 'var(--accent)' }}>
                  <Plus className="w-5 h-5" /><span>{t('createAlbum')}</span>
                </button>
              </div>
              <div className="space-y-4">
                {albums.map((album) => (
                  <div key={album.id} className="rounded-2xl p-6 card-hover" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
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
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => triggerFileUpload(album)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-all" style={{ backgroundColor: '#7c3aed' }}>
                            <Upload className="w-4 h-4" /><span>{t('uploadMedia')}</span>
                          </button>
                          <button onClick={() => copyAlbumLink(album.share_token)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-all" style={{ backgroundColor: '#2563eb' }}>
                            <Copy className="w-4 h-4" /><span>{copiedId === album.share_token ? t('copied') : t('copyLink')}</span>
                          </button>
                          <button onClick={() => openAlbum(album.share_token)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-all" style={{ backgroundColor: 'var(--accent)' }}>
                            <ExternalLink className="w-4 h-4" /><span>{t('open')}</span>
                          </button>
                          <button onClick={() => handleDeleteAlbum(album.id)} className="p-2 rounded-lg transition-all" style={{ color: 'var(--text-muted)' }}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {albums.length === 0 && (
                  <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)', opacity: 0.3 }} />
                    <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{t('noSessionsYet')}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* PHOTOS TAB */}
          {activeTab === 'photos' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-display">{t('photos')}</h2>
                <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{totalPhotos} {t('photos_count')}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.map(album => (
                  <div key={album.id} onClick={() => openAlbum(album.share_token)} className="rounded-2xl overflow-hidden cursor-pointer card-hover" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="aspect-square flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.2), var(--bg-card))' }}>
                      <Camera className="w-16 h-16" style={{ color: 'var(--accent)', opacity: 0.5 }} />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold mb-1">{album.name}</h4>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{albumCounts[album.id] || 0} {t('photos_count')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* DOWNLOADS TAB */}
          {activeTab === 'downloads' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-display">{t('downloads')}</h2>
                <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{t('todayDownloads')}: 0</p>
              </div>
              <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Download className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)', opacity: 0.3 }} />
                <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{lang === 'ar' ? 'لا توجد تنزيلات بعد' : 'No downloads yet'}</p>
              </div>
            </>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-display">{t('notifications')}</h2>
              </div>
              <div className="space-y-3">
                {pendingUsers.length === 0 ? (
                  <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)', opacity: 0.3 }} />
                    <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
                  </div>
                ) : pendingUsers.map((request) => (
                  <div key={request.id} className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div>
                      <p className="font-semibold">{request.email}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(request.created_at).toLocaleString()}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(212,165,116,0.2)', color: 'var(--accent)' }}>{lang === 'ar' ? 'معلق' : 'Pending'}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-display">{t('profile')}</h2>
              </div>
              <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
                    <Camera className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Boles Elhamy</h3>
                    <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{currentUserEmail}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: 'var(--accent)' }}>{t('admin')}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
                    <Phone className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <span>+20 122 597 9165</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
                    <InstagramIcon className="w-5 h-5" />
                    <span>@boles.photography</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SUPPORT TAB */}
          {activeTab === 'support' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-display">{t('support')}</h2>
              </div>
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
            </>
          )}

          {/* PERMISSIONS TAB */}
          {activeTab === 'permissions' && userRole === 'admin' && (
            <>
              <h2 className="text-3xl font-bold font-display mb-8">{t('permissions')}</h2>
              <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold mb-4">{t('pendingRequests')} ({pendingUsers.length})</h3>
                {pendingUsers.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>{t('noPendingRequests')}</p>
                ) : (
                  <div className="space-y-3">
                    {pendingUsers.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                        <div><h4 className="font-semibold">{request.email}</h4><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(request.created_at).toLocaleString()}</p></div>
                        <div className="flex gap-2">
                          <select id={`role-${request.id}`} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            <option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option>
                          </select>
                          <button onClick={() => { const role = (document.getElementById(`role-${request.id}`) as HTMLSelectElement).value as 'viewer' | 'editor'; handleApprove(request.email, role); }} className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2" style={{ backgroundColor: '#22c55e' }}>
                            <UserCheck className="w-4 h-4" /> {t('approve')}
                          </button>
                          <button onClick={() => handleReject(request.email)} className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2" style={{ backgroundColor: 'var(--danger)' }}>
                            <UserX className="w-4 h-4" /> {t('reject')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold mb-4">{t('approvedUsers')} ({approvedUsers.length})</h3>
                {approvedUsers.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>{t('noApprovedUsers')}</p>
                ) : (
                  <div className="space-y-3">
                    {approvedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                        <div><h4 className="font-semibold">{user.email}</h4><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(user.approved_at || user.created_at).toLocaleString()}</p></div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'editor' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/30 text-blue-400'}`}>
                            {user.role === 'editor' ? t('editor') : t('viewer')}
                          </span>
                          <button onClick={() => handleDeactivateUser(user.email)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && userRole === 'admin' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold font-display">{t('userManagement')}</h2>
                  <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{allUsers.length} {lang === 'ar' ? 'مستخدم' : 'users'}</p>
                </div>
                <button onClick={() => setShowUserForm(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all" style={{ backgroundColor: 'var(--accent)' }}>
                  <Plus className="w-5 h-5" /><span>{t('addUser')}</span>
                </button>
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {allUsers.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>{t('noUsers')}</p>
                ) : (
                  <div className="space-y-3">
                    {allUsers.map((user) => (
                      <div key={user.email} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
                            <span className="text-white font-bold">{user.email.charAt(0).toUpperCase()}</span>
                          </div>
                          <div><h4 className="font-semibold">{user.email}</h4><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(user.created_at || user.approved_at).toLocaleString()}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          {editingUser?.email === user.email ? (
                            <>
                              <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'viewer' | 'editor' | 'admin'})} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                                <option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option><option value="admin">{t('admin')}</option>
                              </select>
                              <button onClick={() => handleEditUser(user, editingUser.role)} className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2" style={{ backgroundColor: '#22c55e' }}>
                                <Save className="w-4 h-4" /> {t('save')}
                              </button>
                              <button onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>{t('cancel')}</button>
                            </>
                          ) : (
                            <>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-900/30 text-purple-400' : user.role === 'editor' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                {user.role === 'admin' ? t('admin') : user.role === 'editor' ? t('editor') : t('viewer')}
                              </span>
                              <button onClick={() => setEditingUser(user)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteUser(user)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}><Trash2 className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,video/*" onChange={(e) => handleFilesSelected(e.target.files)} />

      {showClientForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{t('addClientTitle')}</h3>
              <button onClick={() => setShowClientForm(false)} style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <input type="text" placeholder={t('clientName')} value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} required />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowClientForm(false)} className="flex-1 px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>{t('cancel')}</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: 'var(--accent)' }}>{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAlbumForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{t('createAlbumTitle')}</h3>
              <button onClick={() => setShowAlbumForm(false)} style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddAlbum} className="space-y-4">
              <input type="text" placeholder={t('albumName')} value={albumName} onChange={(e) => setAlbumName(e.target.value)} className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} required />
              <textarea placeholder={t('description')} value={albumDescription} onChange={(e) => setAlbumDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} rows={3} />
              <select value={sessionType} onChange={(e) => setSessionType(e.target.value)} className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="wedding">💍 {t('weddingLabel')}</option>
                <option value="portrait">👤 {t('portraitLabel')}</option>
                <option value="event">📅 {t('eventLabel')}</option>
                <option value="other"> {t('otherLabel')}</option>
              </select>
              <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              <select value={selectedClient?.id || ''} onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value) || null)} className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="">{t('selectClient')}</option>
                {clients.map((client) => (<option key={client.id} value={client.id}>{client.name}</option>))}
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAlbumForm(false)} className="flex-1 px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>{t('cancel')}</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: 'var(--accent)' }}>{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{t('addUser')}</h3>
              <button onClick={() => { setShowUserForm(false); setNewUserEmail(''); setNewUserRole('viewer'); }} style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input type="email" placeholder={t('email')} value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} required />
              <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as 'viewer' | 'editor' | 'admin')} className="w-full px-4 py-3 rounded-xl focus:outline-none" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option><option value="admin">{t('admin')}</option>
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowUserForm(false); setNewUserEmail(''); setNewUserRole('viewer'); }} className="flex-1 px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>{t('cancel')}</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: 'var(--accent)' }}>{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showManageForm && managingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">{t('uploadMediaTitle')}: {managingAlbum.name}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {albumMedia.length} {t('files')}
                  {uploading && <span className="mr-2" style={{ color: 'var(--accent)' }}>- {t('uploading')} {Math.round(uploadProgress)}%</span>}
                  {uploadComplete && <span className="mr-2 text-green-500">✓ {t('uploadComplete')}</span>}
                </p>
              </div>
              <button onClick={() => { setShowManageForm(false); setManagingAlbum(null); setUploading(false); setUploadComplete(false); }} style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {albumMedia.length === 0 && !uploading ? <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>{t('noMedia')}</p> : (
                albumMedia.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      {item.type === 'image' ? <img src={item.url} alt="" className="w-full h-full object-cover" /> : <video src={item.url} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.type === 'image' ? <FileImage className="w-4 h-4" style={{ color: 'var(--accent)' }} /> : <FileVideo className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.type === 'image' ? t('image') : t('video')}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteMedia(item.id)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {(uploading || uploadComplete) && (
        <div className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-50 rounded-2xl p-4 shadow-2xl min-w-[280px] animate-slide-in`} style={{ backgroundColor: uploadComplete ? 'rgba(34,197,94,0.9)' : 'var(--bg-card)', border: `1px solid ${uploadComplete ? '#22c55e' : 'var(--border)'}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent)' }} /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
              <span className="text-sm font-semibold">{uploadComplete ? t('uploadComplete') : t('uploading')}</span>
            </div>
            <button onClick={() => { setUploading(false); setUploadComplete(false); setUploadProgress(0); }} style={{ color: 'var(--text-muted)' }}><X className="w-4 h-4" /></button>
          </div>
          {!uploadComplete && (
            <div className="w-full rounded-full h-2 mb-3" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%`, backgroundColor: 'var(--accent)' }}></div>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span style={{ color: 'var(--text-muted)' }}>{t('uploaded')}: <span className="text-green-400 font-bold">{uploadedFiles}</span></span>
            {!uploadComplete && <span className="font-bold" style={{ color: 'var(--accent)' }}>{Math.round(uploadProgress)}%</span>}
          </div>
        </div>
      )}
    </div>
  );
}