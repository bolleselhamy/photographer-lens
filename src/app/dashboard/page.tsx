'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  Home, Calendar, Image as ImageIcon, Download, Bell, User, Headphones, 
  Plus, X, Copy, ExternalLink, Trash2, Upload, FileImage, FileVideo, 
  Loader2, CheckCircle2, Phone, MessageCircle, Camera, Shield, 
  UserCheck, UserX, UserCog, Edit, Save, LogOut, Sun,
  Users, ChevronLeft, TrendingUp, Globe
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
    welcomeDesc: 'إليك نظرة عامة على جلساتك.',
    addClient: 'إضافة عميل',
    createAlbum: 'إنشاء جلسة',
    totalSessions: 'إجمالي الجلسات',
    totalPhotos: 'إجمالي الصور',
    todayDownloads: 'التنزيلات اليوم',
    downloadAll: 'تحميل الكل',
    downloadAllSub: '(جلسة محددة)',
    yourSessions: 'جلساتك',
    viewAll: 'عرض الكل',
    noAlbums: 'لا توجد جلسات بعد.',
    noClients: 'لا يوجد عملاء بعد.',
    clientName: 'اسم العميل',
    albumName: 'اسم الجلسة',
    description: 'الوصف',
    selectClient: 'اختر العميل',
    cancel: 'إلغاء',
    save: 'حفظ',
    copyLink: 'نسخ الرابط',
    copied: 'تم النسخ',
    open: 'فتح',
    uploadMedia: 'رفع الوسائط',
    downloadPhotos: 'تحميل الصور',
    confirmDeleteClient: 'هل أنت متأكد من حذف هذا العميل؟',
    confirmDeleteAlbum: 'هل أنت متأكد من حذف هذه الجلسة؟',
    addClientTitle: 'إضافة عميل جديد',
    createAlbumTitle: 'إنشاء جلسة جديدة',
    uploadMediaTitle: 'رفع الوسائط',
    logout: 'تسجيل الخروج',
    home: 'الرئيسية',
    mySessions: 'جلساتي',
    photos: 'الصور',
    downloads: 'التنزيلات',
    notifications: 'الإشعارات',
    profile: 'الملف الشخصي',
    support: 'الدعم',
    clients: 'العملاء',
    albums: 'الألبومات',
    permissions: 'الصلاحيات',
    userManagement: 'إدارة المستخدمين',
    pendingRequests: 'طلبات معلقة',
    approvedUsers: 'المستخدمون المعتمدون',
    allUsers: 'جميع المستخدمين',
    approve: 'موافقة',
    reject: 'رفض',
    viewer: 'مشاهد',
    editor: 'محرر',
    admin: 'مدير',
    noPendingRequests: 'لا توجد طلبات معلقة',
    noApprovedUsers: 'لا يوجد مستخدمون معتمدون',
    noUsers: 'لا يوجد مستخدمون',
    addUser: 'إضافة مستخدم',
    editUser: 'تعديل مستخدم',
    removeUser: 'إزالة مستخدم',
    confirmDeleteUser: 'هل أنت متأكد من حذف هذا المستخدم؟',
    email: 'البريد الإلكتروني',
    role: 'الصلاحية',
    photos_count: 'صورة',
    contactHelp: 'هل تحتاج إلى مساعدة؟',
    contactDesc: 'تواصل معي لأي استفسار.',
    contactWhatsapp: 'تواصل عبر واتساب',
    photographer: 'Boles Elhamy',
    weddingLabel: 'جلسة زفاف',
    portraitLabel: 'جلسة بورتريه',
    eventLabel: 'مناسبات خاصة',
    otherLabel: 'أخرى'
  },
  en: {
    welcome: 'Welcome',
    welcomeSub: 'to browse your memories',
    welcomeDesc: 'Here is an overview of your sessions.',
    addClient: 'Add Client',
    createAlbum: 'Create Session',
    totalSessions: 'Total Sessions',
    totalPhotos: 'Total Photos',
    todayDownloads: 'Today\'s Downloads',
    downloadAll: 'Download All',
    downloadAllSub: '(Selected Session)',
    yourSessions: 'Your Sessions',
    viewAll: 'View All',
    noAlbums: 'No sessions yet.',
    noClients: 'No clients yet.',
    clientName: 'Client Name',
    albumName: 'Session Name',
    description: 'Description',
    selectClient: 'Select Client',
    cancel: 'Cancel',
    save: 'Save',
    copyLink: 'Copy Link',
    copied: 'Copied',
    open: 'Open',
    uploadMedia: 'Upload Media',
    downloadPhotos: 'Download Photos',
    confirmDeleteClient: 'Are you sure?',
    confirmDeleteAlbum: 'Are you sure?',
    addClientTitle: 'Add New Client',
    createAlbumTitle: 'Create New Session',
    uploadMediaTitle: 'Upload Media',
    logout: 'Logout',
    home: 'Home',
    mySessions: 'My Sessions',
    photos: 'Photos',
    downloads: 'Downloads',
    notifications: 'Notifications',
    profile: 'Profile',
    support: 'Support',
    clients: 'Clients',
    albums: 'Albums',
    permissions: 'Permissions',
    userManagement: 'User Management',
    pendingRequests: 'Pending Requests',
    approvedUsers: 'Approved Users',
    allUsers: 'All Users',
    approve: 'Approve',
    reject: 'Reject',
    viewer: 'Viewer',
    editor: 'Editor',
    admin: 'Admin',
    noPendingRequests: 'No pending requests',
    noApprovedUsers: 'No approved users',
    noUsers: 'No users',
    addUser: 'Add User',
    editUser: 'Edit User',
    removeUser: 'Remove User',
    confirmDeleteUser: 'Are you sure?',
    email: 'Email',
    role: 'Role',
    photos_count: 'photos',
    contactHelp: 'Need Help?',
    contactDesc: 'Contact me for any inquiry.',
    contactWhatsapp: 'Contact via WhatsApp',
    photographer: 'Boles Elhamy',
    weddingLabel: 'Wedding Session',
    portraitLabel: 'Portrait Session',
    eventLabel: 'Special Events',
    otherLabel: 'Other'
  }
};

const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

type ActiveTab = 'home' | 'clients' | 'albums' | 'permissions' | 'users';

export default function DashboardPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
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

        const { data: adminData } = await supabase
          .from('admins')
          .select('email')
          .ilike('email', userEmail || '')
          .single();

        if (adminData) {
          setUserRole('admin');
          await loadData();
          setLoading(false);
          return;
        }

        const { data: approvedData } = await supabase
          .from('approved_users')
          .select('*')
          .ilike('email', userEmail || '')
          .eq('is_active', true)
          .single();

        if (approvedData) {
          setUserRole(approvedData.role);
          
          // ✅ التعديل: توجيه العملاء غير الأدمن إلى داشبورد العميل
          if (approvedData.role !== 'admin') {
            window.location.href = '/client';
            return;
          }
          
          await loadData();
          setLoading(false);
          return;
        }

        await supabase.auth.signOut();
        window.location.href = '/';
      } else {
        window.location.href = '/';
      }
      setLoading(false);
    };
    checkUser();

    const handleBeforeUnload = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('approved_users')
          .update({ is_active: false, session_token: null })
          .ilike('email', user.email || '');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
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
    await loadPermissions();
    await loadAllUsers();
  };

  const handleReject = async (email: string) => {
    await supabase.from('pending_users').update({ status: 'rejected' }).eq('email', email);
    await loadPermissions();
  };

  const handleDeactivateUser = async (email: string) => {
    await supabase.from('approved_users').update({ is_active: false, session_token: null }).ilike('email', email);
    await loadPermissions();
    await loadAllUsers();
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;

    if (newUserRole === 'admin') {
      await supabase.from('admins').upsert({ email: newUserEmail }, { onConflict: 'email' });
    }
    
    await supabase.from('approved_users').upsert([{ 
      email: newUserEmail, 
      role: newUserRole, 
      is_active: true, 
      session_token: generateToken(),
      approved_at: new Date().toISOString() 
    }], { onConflict: 'email' });

    const { error } = await supabase.auth.signInWithOtp({ 
      email: newUserEmail,
      options: { shouldCreateUser: true }
    });

    if (error) {
      console.error('Error sending invite:', error);
      alert('فشل إرسال الدعوة.');
      return;
    }

    setNewUserEmail('');
    setNewUserRole('viewer');
    setShowUserForm(false);
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
    setEditingUser(null);
    await loadAllUsers();
  };

  const handleDeleteUser = async (user: any) => {
    if (!window.confirm(t('confirmDeleteUser'))) return;
    await supabase.from('admins').delete().eq('email', user.email);
    await supabase.from('approved_users').delete().ilike('email', user.email);
    await loadAllUsers();
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    window.location.href = '/'; 
  };

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
    const { data, error } = await supabase.from('albums').insert([{ 
      name: albumName, 
      description: albumDescription, 
      client_id: selectedClient?.id, 
      is_public: true, 
      share_token: token,
      session_type: sessionType,
      session_date: sessionDate || new Date().toISOString()
    }]).select();
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

  const triggerFileUpload = (album: any) => {
    setPendingUploadAlbum(album);
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0 || !pendingUploadAlbum) return;
    let albumWithToken = pendingUploadAlbum;
    if (!albumWithToken.share_token) {
      const token = generateToken();
      const { data } = await supabase.from('albums').update({ share_token: token }).eq('id', albumWithToken.id).select().single();
      if (data) albumWithToken = data;
    }
    setManagingAlbum(albumWithToken);
    setShowManageForm(true);
    setPendingUploadAlbum(null);
    const { data } = await supabase.from('media').select('*').eq('album_id', albumWithToken.id).order('created_at', { ascending: false });
    if (data) setAlbumMedia(data);
    await uploadFilesDirect(files, albumWithToken);
  };

  const uploadFilesDirect = async (files: FileList | null, album: any) => {
    if (!files || files.length === 0 || !album) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadedFiles(0);
    setUploadComplete(false);
    const totalFiles = files.length;
    setTotalUploadFiles(totalFiles);
    let uploadedCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          uploadedCount++; setUploadedFiles(uploadedCount); setUploadProgress((uploadedCount / totalFiles) * 100); continue;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'lens-upload');
        formData.append('cloud_name', 'hcs8l8f1h');
        formData.append('api_key', '143232795822287');

        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/hcs8l8f1h/auto/upload`, { method: 'POST', body: formData });
          const result = await response.json();
          if (result.secure_url) {
            await supabase.from('media').insert([{ album_id: album.id, url: result.secure_url, type: result.resource_type === 'video' ? 'video' : 'image', cloudinary_public_id: result.public_id }]);
          }
        } catch (err) { console.error('Upload error:', err); }
        uploadedCount++; setUploadedFiles(uploadedCount); setUploadProgress((uploadedCount / totalFiles) * 100);
      }
      const { count } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('album_id', album.id);
      setAlbumCounts(prev => ({ ...prev, [album.id]: count || 0 }));
      const { data: mediaData } = await supabase.from('media').select('*').eq('album_id', album.id).order('created_at', { ascending: false });
      if (mediaData) setAlbumMedia(mediaData);
      loadData();
      setUploadComplete(true);
    } catch (error) { console.error('Upload error:', error); }
    finally { setUploading(false); }
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
    if (!shareToken) return;
    window.location.href = `/album/${shareToken}`;
  };

  const totalPhotos = Object.values(albumCounts).reduce((sum, count) => sum + count, 0);

  const getSessionIcon = (type: string) => {
    switch(type) {
      case 'wedding': return '';
      case 'portrait': return '';
      case 'event': return '📅';
      default: return '';
    }
  };

  const getSessionTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      wedding: lang === 'ar' ? 'جلسة زفاف' : 'Wedding Session',
      portrait: lang === 'ar' ? 'جلسة بورتريه' : 'Portrait Session',
      event: lang === 'ar' ? 'مناسبات خاصة' : 'Special Events',
      other: lang === 'ar' ? 'أخرى' : 'Other'
    };
    return labels[type] || labels.other;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = lang === 'ar' 
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
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

  return (
    <div className={`min-h-screen bg-black text-white flex ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <aside className={`w-72 bg-gradient-to-b from-gray-950 to-black border-${lang === 'ar' ? 'l' : 'r'} border-amber-900/20 p-6 flex flex-col fixed h-full overflow-y-auto ${lang === 'ar' ? 'right-0' : 'left-0'}`}>
        <div className="mb-8 text-center">
          <div className="inline-block">
            <h1 className="text-4xl font-serif text-amber-600 mb-1" style={{ fontFamily: 'cursive' }}>Boles</h1>
            <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">Photography</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg shadow-amber-900/30' : 'text-gray-400 hover:bg-gray-900 hover:text-amber-600'}`}>
            <Home className="w-5 h-5" />
            <span className="font-medium">{t('home')}</span>
          </button>
          <button onClick={() => setActiveTab('albums')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'albums' ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg shadow-amber-900/30' : 'text-gray-400 hover:bg-gray-900 hover:text-amber-600'}`}>
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{t('mySessions')}</span>
          </button>
          <button onClick={() => setActiveTab('clients')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'clients' ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg shadow-amber-900/30' : 'text-gray-400 hover:bg-gray-900 hover:text-amber-600'}`}>
            <Users className="w-5 h-5" />
            <span className="font-medium">{t('clients')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">{t('photos')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <Download className="w-5 h-5" />
            <span className="font-medium">{t('downloads')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="font-medium">{t('notifications')}</span>
            {pendingUsers.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <User className="w-5 h-5" />
            <span className="font-medium">{t('profile')}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-amber-600 transition-all">
            <Headphones className="w-5 h-5" />
            <span className="font-medium">{t('support')}</span>
          </button>

          {userRole === 'admin' && (
            <>
              <div className="border-t border-gray-800 my-4"></div>
              <p className="text-xs text-gray-600 uppercase tracking-wider px-4 mb-2">Admin</p>
              <button onClick={() => setActiveTab('permissions')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'permissions' ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-amber-600'}`}>
                <Shield className="w-5 h-5" />
                <span className="font-medium">{t('permissions')}</span>
              </button>
              <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-amber-600'}`}>
                <UserCog className="w-5 h-5" />
                <span className="font-medium">{t('userManagement')}</span>
              </button>
            </>
          )}
        </nav>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Boles Elhamy</p>
              <p className="text-xs text-gray-500">{t('photographer')}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-lg transition-all text-sm">
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      <main className={`flex-1 ${lang === 'ar' ? 'mr-72' : 'ml-72'} overflow-y-auto`}>
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-900 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input type="text" placeholder={lang === 'ar' ? 'بحث...' : 'Search...'} className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 w-64" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              {pendingUsers.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
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
          {activeTab === 'home' && (
            <>
              <div className="relative rounded-3xl overflow-hidden mb-8 h-64">
                <img src="/mybackground.png" alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                <div className="absolute inset-0 flex items-center p-8">
                  <div className="max-w-lg">
                    <h1 className="text-5xl font-bold text-white mb-2">
                      {t('welcome')} <span className="text-amber-600">{currentUserEmail.split('@')[0]}</span>
                    </h1>
                    <p className="text-2xl text-gray-300 mb-4">{t('welcomeSub')}</p>
                    <p className="text-gray-400">{t('welcomeDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-900/20 rounded-xl"><Calendar className="w-6 h-6 text-amber-600" /></div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{albums.length}</p>
                  <p className="text-sm text-gray-500">{t('totalSessions')}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-900/20 rounded-xl"><ImageIcon className="w-6 h-6 text-amber-600" /></div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{totalPhotos}</p>
                  <p className="text-sm text-gray-500">{t('totalPhotos')}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                  <div className="p-3 bg-amber-900/20 rounded-xl mb-4"><Download className="w-6 h-6 text-amber-600" /></div>
                  <p className="text-3xl font-bold text-white mb-1">0</p>
                  <p className="text-sm text-gray-500">{t('todayDownloads')}</p>
                </div>
                <button onClick={() => setActiveTab('albums')} className="bg-gradient-to-br from-amber-700 to-amber-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-900/30">
                  <div className="p-3 bg-white/20 rounded-xl mb-4 inline-block"><Download className="w-6 h-6 text-white" /></div>
                  <p className="text-xl font-bold mb-1">{t('downloadAll')}</p>
                  <p className="text-sm text-amber-100">{t('downloadAllSub')}</p>
                </button>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Camera className="w-6 h-6 text-amber-600" />
                    <h2 className="text-2xl font-bold text-white">{t('yourSessions')}</h2>
                  </div>
                  <button onClick={() => setActiveTab('albums')} className="flex items-center gap-2 text-amber-600 hover:text-amber-500 transition-colors">
                    <span>{t('viewAll')}</span>
                    <ChevronLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  {albums.slice(0, 3).map((album) => (
                    <div key={album.id} className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-amber-900/50 transition-all group">
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
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(album.session_date || album.created_at)}</span>
                            {album.clients?.name && <span className="flex items-center gap-1"><User className="w-4 h-4" />{album.clients.name}</span>}
                          </div>
                          <p className="text-gray-500 text-sm mb-4">{album.description || getSessionTypeLabel(album.session_type || 'other')}</p>
                          <button onClick={() => openAlbum(album.share_token)} className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-all text-sm">
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
                      <p className="text-gray-500 text-lg">{t('noAlbums')}</p>
                      <button onClick={() => setShowAlbumForm(true)} className="mt-4 px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-all">{t('createAlbum')}</button>
                    </div>
                  )}
                </div>
              </div>

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
                    <a href="tel:+201225979165" className="flex items-center gap-3 text-gray-400 hover:text-amber-600 transition-colors"><Phone className="w-5 h-5" /><span>+20 122 597 9165</span></a>
                    <a href="https://www.instagram.com/boles.photography" target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-amber-600 transition-colors"><InstagramIcon className="w-5 h-5" /><span>Instagram</span></a>
                    <a href="https://www.facebook.com/share/1E6Xrgdz27/" target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-amber-600 transition-colors"><FacebookIcon className="w-5 h-5" /><span>Facebook</span></a>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'albums' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div><h2 className="text-3xl font-bold text-white">{t('allAlbums')}</h2><p className="text-gray-500 mt-1">{albums.length} {lang === 'ar' ? 'جلسة' : 'sessions'}</p></div>
                <button onClick={() => setShowAlbumForm(true)} className="flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-all"><Plus className="w-5 h-5" /><span>{t('createAlbum')}</span></button>
              </div>
              <div className="space-y-4">
                {albums.map((album) => (
                  <div key={album.id} className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-amber-900/50 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="relative w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-gray-900 flex items-center justify-center"><Camera className="w-12 h-12 text-amber-600/50" /></div>
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-2"><ImageIcon className="w-4 h-4 text-amber-600" /><span className="text-sm text-white">{albumCounts[album.id] || 0} {t('photos_count')}</span></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{getSessionIcon(album.session_type || 'other')}</span><h3 className="text-xl font-bold text-white">{album.name}</h3></div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3"><span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(album.session_date || album.created_at)}</span></div>
                        <div className="flex gap-2">
                          <button onClick={() => triggerFileUpload(album)} className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-all text-sm"><Upload className="w-4 h-4" /><span>{t('uploadMedia')}</span></button>
                          <button onClick={() => copyAlbumLink(album.share_token)} className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-all text-sm"><Copy className="w-4 h-4" /><span>{copiedId === album.share_token ? t('copied') : t('copyLink')}</span></button>
                          <button onClick={() => openAlbum(album.share_token)} className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-all text-sm"><ExternalLink className="w-4 h-4" /><span>{t('open')}</span></button>
                          <button onClick={() => handleDeleteAlbum(album.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {albums.length === 0 && (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center"><Camera className="w-16 h-16 text-amber-600/30 mx-auto mb-4" /><p className="text-gray-500 text-lg">{t('noAlbums')}</p></div>
                )}
              </div>
            </>
          )}

          {activeTab === 'clients' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div><h2 className="text-3xl font-bold text-white">{t('allClients')}</h2><p className="text-gray-500 mt-1">{clients.length} {lang === 'ar' ? 'عميل' : 'clients'}</p></div>
                <button onClick={() => setShowClientForm(true)} className="flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-all"><Plus className="w-5 h-5" /><span>{t('addClient')}</span></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => {
                  const clientAlbums = albums.filter(a => a.client_id === client.id);
                  const totalClientPhotos = clientAlbums.reduce((sum, a) => sum + (albumCounts[a.id] || 0), 0);
                  return (
                    <div key={client.id} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-amber-900/50 transition-all group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center"><span className="text-2xl font-bold text-white">{client.name.charAt(0).toUpperCase()}</span></div>
                        <div><h4 className="text-lg font-bold text-white">{client.name}</h4><p className="text-sm text-gray-500">{clientAlbums.length} {lang === 'ar' ? 'جلسة' : 'sessions'}</p></div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-400"><ImageIcon className="w-4 h-4 text-amber-600" /><span>{totalClientPhotos} {t('photos_count')}</span></div>
                        <button onClick={() => handleDeleteClient(client.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
                {clients.length === 0 && (
                  <div className="col-span-full bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center"><Users className="w-16 h-16 text-amber-600/30 mx-auto mb-4" /><p className="text-gray-500 text-lg">{t('noClients')}</p></div>
                )}
              </div>
            </>
          )}

          {activeTab === 'permissions' && userRole === 'admin' && (
            <>
              <h2 className="text-3xl font-bold text-white mb-8">{t('permissions')}</h2>
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">{t('pendingRequests')} ({pendingUsers.length})</h3>
                {pendingUsers.length === 0 ? <p className="text-gray-500 text-center py-8">{t('noPendingRequests')}</p> : (
                  <div className="space-y-3">
                    {pendingUsers.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                        <div><h4 className="font-semibold text-white">{request.email}</h4><p className="text-gray-500 text-sm">{new Date(request.created_at).toLocaleString()}</p></div>
                        <div className="flex gap-2">
                          <select id={`role-${request.id}`} className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"><option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option></select>
                          <button onClick={() => { const role = (document.getElementById(`role-${request.id}`) as HTMLSelectElement).value as 'viewer' | 'editor'; handleApprove(request.email, role); }} className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"><UserCheck className="w-4 h-4" /> {t('approve')}</button>
                          <button onClick={() => handleReject(request.email)} className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-2"><UserX className="w-4 h-4" /> {t('reject')}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">{t('approvedUsers')} ({approvedUsers.length})</h3>
                {approvedUsers.length === 0 ? <p className="text-gray-500 text-center py-8">{t('noApprovedUsers')}</p> : (
                  <div className="space-y-3">
                    {approvedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                        <div><h4 className="font-semibold text-white">{user.email}</h4><p className="text-gray-500 text-sm">{new Date(user.approved_at || user.created_at).toLocaleString()}</p></div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'editor' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/30 text-blue-400'}`}>{user.role === 'editor' ? t('editor') : t('viewer')}</span>
                          <button onClick={() => handleDeactivateUser(user.email)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><LogOut className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'users' && userRole === 'admin' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div><h2 className="text-3xl font-bold text-white">{t('userManagement')}</h2><p className="text-gray-500 mt-1">{allUsers.length} {lang === 'ar' ? 'مستخدم' : 'users'}</p></div>
                <button onClick={() => setShowUserForm(true)} className="flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-all"><Plus className="w-5 h-5" /><span>{t('addUser')}</span></button>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
                {allUsers.length === 0 ? <p className="text-gray-500 text-center py-8">{t('noUsers')}</p> : (
                  <div className="space-y-3">
                    {allUsers.map((user) => (
                      <div key={user.email} className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center"><span className="text-white font-bold">{user.email.charAt(0).toUpperCase()}</span></div>
                          <div><h4 className="font-semibold text-white">{user.email}</h4><p className="text-gray-500 text-sm">{new Date(user.created_at || user.approved_at).toLocaleString()}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          {editingUser?.email === user.email ? (
                            <>
                              <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'viewer' | 'editor' | 'admin'})} className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"><option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option><option value="admin">{t('admin')}</option></select>
                              <button onClick={() => handleEditUser(user, editingUser.role)} className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"><Save className="w-4 h-4" /> {t('save')}</button>
                              <button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">{t('cancel')}</button>
                            </>
                          ) : (
                            <>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-900/30 text-purple-400' : user.role === 'editor' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/30 text-blue-400'}`}>{user.role === 'admin' ? t('admin') : user.role === 'editor' ? t('editor') : t('viewer')}</span>
                              <button onClick={() => setEditingUser(user)} className="p-2 text-gray-500 hover:text-amber-400 hover:bg-amber-900/20 rounded-lg"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteUser(user)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white">{t('addClientTitle')}</h3><button onClick={() => setShowClientForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <input type="text" placeholder={t('clientName')} value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-600" required />
              <div className="flex gap-3"><button type="button" onClick={() => setShowClientForm(false)} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl">{t('cancel')}</button><button type="submit" className="flex-1 px-4 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-semibold">{t('save')}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {showAlbumForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white">{t('createAlbumTitle')}</h3><button onClick={() => setShowAlbumForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleAddAlbum} className="space-y-4">
              <input type="text" placeholder={t('albumName')} value={albumName} onChange={(e) => setAlbumName(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-600" required />
              <textarea placeholder={t('description')} value={albumDescription} onChange={(e) => setAlbumDescription(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-600" rows={3} />
              <select value={sessionType} onChange={(e) => setSessionType(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:border-amber-600"><option value="wedding">💍 {t('weddingLabel')}</option><option value="portrait"> {t('portraitLabel')}</option><option value="event">📅 {t('eventLabel')}</option><option value="other">📷 {t('otherLabel')}</option></select>
              <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:border-amber-600" />
              <select value={selectedClient?.id || ''} onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value) || null)} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:border-amber-600"><option value="">{t('selectClient')}</option>{clients.map((client) => (<option key={client.id} value={client.id}>{client.name}</option>))}</select>
              <div className="flex gap-3"><button type="button" onClick={() => setShowAlbumForm(false)} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl">{t('cancel')}</button><button type="submit" className="flex-1 px-4 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-semibold">{t('save')}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {showUserForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white">{t('addUser')}</h3><button onClick={() => { setShowUserForm(false); setNewUserEmail(''); setNewUserRole('viewer'); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input type="email" placeholder={t('email')} value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-600" required />
              <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as 'viewer' | 'editor' | 'admin')} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:border-amber-600"><option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option><option value="admin">{t('admin')}</option></select>
              <div className="flex gap-3"><button type="button" onClick={() => { setShowUserForm(false); setNewUserEmail(''); setNewUserRole('viewer'); }} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl">{t('cancel')}</button><button type="submit" className="flex-1 px-4 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-semibold">{t('save')}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {showManageForm && managingAlbum && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div><h3 className="text-xl font-bold text-white">{t('uploadMediaTitle')}: {managingAlbum.name}</h3><p className="text-gray-500 text-sm mt-1">{albumMedia.length} {t('files')}{uploading && <span className="text-amber-600 mr-2">- {t('uploading')} {Math.round(uploadProgress)}%</span>}{uploadComplete && <span className="text-green-500 mr-2">✓ {t('uploadComplete')}</span>}</p></div>
              <button onClick={() => { setShowManageForm(false); setManagingAlbum(null); setUploading(false); setUploadComplete(false); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {albumMedia.length === 0 && !uploading ? <p className="text-gray-500 text-center py-8">{t('noMedia')}</p> : (
                albumMedia.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-black/50 rounded-xl border border-gray-800 group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">{item.type === 'image' ? <img src={item.url} alt="" className="w-full h-full object-cover" /> : <video src={item.url} className="w-full h-full object-cover" />}</div>
                    <div className="flex-1"><div className="flex items-center gap-2">{item.type === 'image' ? <FileImage className="w-4 h-4 text-amber-600" /> : <FileVideo className="w-4 h-4 text-amber-600" />}<span className="text-sm text-gray-400">{item.type === 'image' ? (lang === 'ar' ? 'صورة' : 'Image') : (lang === 'ar' ? 'فيديو' : 'Video')}</span></div></div>
                    <button onClick={() => handleDeleteMedia(item.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {(uploading || uploadComplete) && (
        <div className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-50 backdrop-blur-xl border rounded-2xl p-4 shadow-2xl min-w-[280px] ${uploadComplete ? 'bg-green-900/90 border-green-700' : 'bg-gray-900/90 border-amber-900/50'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">{uploading ? <Loader2 className="w-4 h-4 text-amber-600 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}<span className={`text-sm font-semibold ${uploadComplete ? 'text-green-400' : 'text-amber-600'}`}>{uploadComplete ? t('uploadComplete') : t('uploading')}</span></div>
            <button onClick={() => { setUploading(false); setUploadComplete(false); setUploadProgress(0); }} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          {!uploadComplete && <div className="w-full bg-gray-800 rounded-full h-2 mb-3"><div className="bg-amber-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div>}
          <div className="flex justify-between text-xs"><span className="text-gray-400">{t('uploaded')}: <span className="text-green-400 font-bold">{uploadedFiles}</span></span>{!uploadComplete && <span className="text-amber-600 font-bold">{Math.round(uploadProgress)}%</span>}</div>
        </div>
      )}
    </div>
  );
}