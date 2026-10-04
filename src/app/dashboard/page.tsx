'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Users, Folder, Image, LogOut, Plus, X, Copy, ExternalLink, Trash2, Globe, Crown, Upload, FileImage, FileVideo, FolderOpen, Loader2, HardDrive, CheckCircle2, Phone, MessageCircle, Camera, Shield, UserCheck, UserX, UserCog, Edit, Save } from 'lucide-react';

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
    confirmDeleteClient: 'هل أنت متأكد من حذف هذا العميل؟',
    confirmDeleteAlbum: 'هل أنت متأكد من حذف هذا الألبوم؟',
    addClientTitle: 'إضافة عميل جديد',
    createAlbumTitle: 'إنشاء ألبوم جديد',
    uploadMediaTitle: 'رفع الوسائط',
    logout: 'تسجيل الخروج',
    home: 'الرئيسية',
    clients: 'العملاء',
    albums: 'الألبومات',
    permissions: 'الصلاحيات 🔐',
    userManagement: 'إدارة المستخدمين 👥',
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
    sessionActive: 'نشط',
    sessionExpired: 'منتهي',
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
    uploadComplete: 'اكتمل الرفع!',
    openStudio: 'فتح الاستوديو',
    addUser: 'إضافة مستخدم',
    editUser: 'تعديل مستخدم',
    removeUser: 'إزالة مستخدم',
    confirmDeleteUser: 'هل أنت متأكد من حذف هذا المستخدم؟',
    email: 'البريد الإلكتروني',
    role: 'الصلاحية',
    actions: 'الإجراءات',
    inviteSent: 'تم إرسال الدعوة'
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
    permissions: 'Permissions 🔐',
    userManagement: 'User Management 👥',
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
    sessionActive: 'Active',
    sessionExpired: 'Expired',
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
    openStudio: 'Open Studio',
    addUser: 'Add User',
    editUser: 'Edit User',
    removeUser: 'Remove User',
    confirmDeleteUser: 'Are you sure you want to delete this user?',
    email: 'Email',
    role: 'Role',
    actions: 'Actions',
    inviteSent: 'Invite Sent'
  }
};

const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

type ActiveTab = 'home' | 'clients' | 'albums' | 'permissions' | 'users';

export default function DashboardPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
  const t = (key: keyof typeof translations.ar) => translations[lang][key];

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
  
  const [userRole, setUserRole] = useState<'admin' | 'viewer' | 'editor'>('viewer');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadAlbum, setPendingUploadAlbum] = useState<any>(null);
  const MAX_SPACE_MB = 22528;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
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
      let totalSizeMB = 0;
      for (const album of albumsData) {
        const { data: mediaData, count } = await supabase.from('media').select('url', { count: 'exact' }).eq('album_id', album.id);
        counts[album.id] = count || 0;
        if (mediaData) totalSizeMB += (count || 0) * 3;
      }
      setAlbumCounts(counts);
      setUsedSpaceMB(totalSizeMB);
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
    
    const adminEmails = new Set(admins?.map(a => a.email.toLowerCase()) || []);
    
    const allUsersList = [
      ...(admins?.map(u => ({ 
        ...u, 
        role: 'admin',
        source: 'admin'
      })) || []),
      ...(approved?.filter(u => !adminEmails.has(u.email.toLowerCase())).map(u => ({ 
        ...u, 
        source: 'approved'
      })) || [])
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

  // ✅ التعديل الوحيد هنا - إرسال Magic Link للمستخدم الجديد
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;

    // 1. إضافة في جدول admins لو أدمن
    if (newUserRole === 'admin') {
      await supabase.from('admins').upsert({ email: newUserEmail }, { onConflict: 'email' });
    }
    
    // 2. إضافة في approved_users
    await supabase.from('approved_users').upsert([{ 
      email: newUserEmail, 
      role: newUserRole, 
      is_active: true, 
      session_token: generateToken(),
      approved_at: new Date().toISOString() 
    }], { onConflict: 'email' });

    // 3. إرسال Magic Link للمستخدم الجديد (هيضيفه في auth.users تلقائياً)
    const { error } = await supabase.auth.signInWithOtp({ 
      email: newUserEmail,
      options: {
        shouldCreateUser: true,
      }
    });

    if (error) {
      console.error('Error sending invite:', error);
      alert('فشل إرسال الدعوة. تأكد من صحة الإيميل.');
      return;
    }

    setNewUserEmail('');
    setNewUserRole('viewer');
    setShowUserForm(false);
    await loadAllUsers();
    
    alert(`✓ تم إرسال دعوة إلى ${newUserEmail}\nالمستخدم لازم يضغط على الرابط في الإيميل عشان يدخل.`);
  };

  const handleEditUser = async (user: any, newRole: 'viewer' | 'editor' | 'admin') => {
    if (newRole === 'admin') {
      await supabase.from('admins').upsert({ email: user.email }, { onConflict: 'email' });
      await supabase.from('approved_users').upsert([{ 
        email: user.email, 
        role: 'admin', 
        is_active: true,
        approved_at: new Date().toISOString() 
      }], { onConflict: 'email' });
    } else {
      await supabase.from('admins').delete().eq('email', user.email);
      await supabase.from('approved_users').upsert([{ 
        email: user.email, 
        role: newRole, 
        is_active: true,
        approved_at: new Date().toISOString() 
      }], { onConflict: 'email' });
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

  const triggerFileUpload = (album: any, mode: 'files' | 'folder') => {
    setPendingUploadAlbum(album);
    if (mode === 'files') fileInputRef.current?.click();
    else folderInputRef.current?.click();
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
    if (!shareToken) { alert('لا يوجد رابط للألبوم'); return; }
    window.location.href = `/album/${shareToken}`;
  };

  const formatSpace = (mb: number) => mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className={`min-h-screen text-white flex relative ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="fixed inset-0 z-0" style={{ backgroundImage: 'url(/mybackground.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)', transform: 'scale(1.1)' }} />
      <div className="fixed inset-0 bg-black/60 z-0" />

      <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,video/*" onChange={(e) => handleFilesSelected(e.target.files)} />
      <input ref={folderInputRef} type="file" className="hidden" multiple {...({ webkitdirectory: 'true', directory: 'true' } as any)} onChange={(e) => handleFilesSelected(e.target.files)} />

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
          
          {userRole === 'admin' && (
            <>
              <button onClick={() => setActiveTab('permissions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'permissions' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-gray-300 hover:bg-amber-500/10 hover:text-amber-500'}`}>
                <Shield className="w-4 h-4" /><span className="text-sm">{t('permissions')}</span>
              </button>
              <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-gray-300 hover:bg-amber-500/10 hover:text-amber-500'}`}>
                <UserCog className="w-4 h-4" /><span className="text-sm">{t('userManagement')}</span>
              </button>
            </>
          )}
        </nav>

        <div className="mt-4 pt-4 border-t border-amber-500/20">
          <h4 className="text-xs text-amber-400/70 uppercase tracking-wider mb-3">Get in Touch</h4>
          <div className="space-y-2">
            <a href="tel:+201225979165" className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors text-sm"><Phone className="w-4 h-4" /><span>+20 122 597 9165</span></a>
            <a href="https://wa.me/201225979165" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-green-500 transition-colors text-sm"><MessageCircle className="w-4 h-4" /><span>WhatsApp</span></a>
            <a href="https://www.instagram.com/boles.photography?stkn=ZzNpYnNzbWtoeGk=" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-pink-500 transition-colors text-sm"><Camera className="w-4 h-4" /><span>Instagram</span></a>
            <a href="https://www.facebook.com/share/1E6Xrgdz27/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-blue-500 transition-colors text-sm"><Globe className="w-4 h-4" /><span>Facebook</span></a>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-4">
          <LogOut className="w-4 h-4" /><span className="text-sm">{t('logout')}</span>
        </button>
      </aside>

      <main className="relative z-10 flex-1 p-8 overflow-y-auto">
        {activeTab === 'home' && (
          <>
            <header className="flex justify-between items-center mb-8">
              <div><h2 className={`text-5xl ${lang === 'ar' ? 'welcome-text-ar text-amber-400' : 'welcome-text-en text-amber-400'}`}>{t('welcome')}</h2><p className="text-gray-300 mt-1">{t('overview')}</p></div>
              <div className="flex gap-3">
                <button onClick={() => setShowClientForm(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg"><Plus className="w-4 h-4" />{t('addClient')}</button>
                <button onClick={() => setShowAlbumForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg"><Plus className="w-4 h-4" />{t('createAlbum')}</button>
              </div>
            </header>

            <div className="flex gap-4 mb-8 border-b border-gray-700 pb-2">
              <button
                onClick={() => setActiveTab('albums')}
                className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Image className="w-5 h-5" />
                {lang === 'ar' ? 'الألبومات' : 'Albums'} ({albums.length})
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                {lang === 'ar' ? 'العملاء' : 'Clients'} ({clients.length})
              </button>
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
                        <button onClick={() => triggerFileUpload(album, 'files')} className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"><Upload className="w-4 h-4" /> {t('uploadMedia')}</button>
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
                          <div><h4 className="font-semibold text-lg">{client.name}</h4><p className="text-gray-400 text-sm">{clientAlbums.length} {t('albums')} • {totalPhotos} {t('photos')}</p><p className="text-gray-500 text-xs mt-1">{new Date(client.created_at).toLocaleString()}</p></div>
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
                        <p className="text-gray-500 text-xs mt-1">{new Date(album.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button onClick={() => triggerFileUpload(album, 'files')} className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"><Upload className="w-4 h-4" /> {t('uploadMedia')}</button>
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

        {activeTab === 'permissions' && userRole === 'admin' && (
          <>
            <header className="mb-8">
              <h2 className="text-3xl font-bold">{t('permissions')}</h2>
              <p className="text-gray-300 mt-1">إدارة صلاحيات المستخدمين</p>
            </header>

            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">{t('pendingRequests')} ({pendingUsers.length})</h3>
              {pendingUsers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">{t('noPendingRequests')}</p>
              ) : (
                <div className="space-y-3">
                  {pendingUsers.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{request.email}</h4>
                        <p className="text-gray-400 text-sm">{new Date(request.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <select id={`role-${request.id}`} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" defaultValue="viewer">
                          <option value="viewer">{t('viewer')}</option>
                          <option value="editor">{t('editor')}</option>
                        </select>
                        <button onClick={() => { const role = (document.getElementById(`role-${request.id}`) as HTMLSelectElement).value as 'viewer' | 'editor'; handleApprove(request.email, role); }} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-2">
                          <UserCheck className="w-4 h-4" /> {t('approve')}
                        </button>
                        <button onClick={() => handleReject(request.email)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-2">
                          <UserX className="w-4 h-4" /> {t('reject')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
              <h3 className="text-xl font-bold mb-4">{t('approvedUsers')} ({approvedUsers.length})</h3>
              {approvedUsers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">{t('noApprovedUsers')}</p>
              ) : (
                <div className="space-y-3">
                  {approvedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{user.email}</h4>
                        <p className="text-gray-400 text-sm">{new Date(user.approved_at || user.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'editor' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {user.role === 'editor' ? t('editor') : t('viewer')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {user.is_active ? t('sessionActive') : t('sessionExpired')}
                        </span>
                        <button onClick={() => handleDeactivateUser(user.email)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg" title="إنهاء الجلسة يدوياً">
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

        {activeTab === 'users' && userRole === 'admin' && (
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">{t('userManagement')}</h2>
                <p className="text-gray-300 mt-1">إدارة جميع حسابات المستخدمين</p>
              </div>
              <button onClick={() => setShowUserForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg">
                <Plus className="w-4 h-4" /> {t('addUser')}
              </button>
            </header>

            <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
              <h3 className="text-xl font-bold mb-4">{t('allUsers')} ({allUsers.length})</h3>
              {allUsers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">{t('noUsers')}</p>
              ) : (
                <div className="space-y-3">
                  {allUsers.map((user) => (
                    <div key={user.email} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                          <span className="text-amber-500 font-bold">{user.email.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{user.email}</h4>
                          <p className="text-gray-400 text-sm">{new Date(user.created_at || user.approved_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingUser?.email === user.email ? (
                          <>
                            <select 
                              value={editingUser.role}
                              onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'viewer' | 'editor' | 'admin'})}
                              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                            >
                              <option value="viewer">{t('viewer')}</option>
                              <option value="editor">{t('editor')}</option>
                              <option value="admin">{t('admin')}</option>
                            </select>
                            <button 
                              onClick={() => handleEditUser(user, editingUser.role)}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" /> {t('save')}
                            </button>
                            <button 
                              onClick={() => setEditingUser(null)}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                            >
                              {t('cancel')}
                            </button>
                          </>
                        ) : (
                          <>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                              user.role === 'editor' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {user.role === 'admin' ? t('admin') : user.role === 'editor' ? t('editor') : t('viewer')}
                            </span>
                            <button 
                              onClick={() => setEditingUser(user)}
                              className="p-2 text-gray-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg"
                              title={t('editUser')}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                              title={t('removeUser')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

        {showUserForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">{t('addUser')}</h3><button onClick={() => { setShowUserForm(false); setNewUserEmail(''); setNewUserRole('viewer'); }}><X className="w-5 h-5" /></button></div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <input type="email" placeholder={t('email')} value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white" required />
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as 'viewer' | 'editor' | 'admin')} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                  <option value="viewer">{t('viewer')}</option>
                  <option value="editor">{t('editor')}</option>
                  <option value="admin">{t('admin')}</option>
                </select>
                <div className="flex gap-3"><button type="button" onClick={() => { setShowUserForm(false); setNewUserEmail(''); setNewUserRole('viewer'); }} className="flex-1 px-4 py-3 bg-gray-700 rounded-lg">{t('cancel')}</button><button type="submit" className="flex-1 px-4 py-3 bg-amber-500 text-black rounded-lg font-semibold">{t('save')}</button></div>
              </form>
            </motion.div>
          </div>
        )}

        {showManageForm && managingAlbum && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">{t('uploadMediaTitle')}: {managingAlbum.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {albumMedia.length} {t('files')}
                    {uploading && <span className="text-amber-400 ml-2">- {t('uploading')} {Math.round(uploadProgress)}%</span>}
                    {uploadComplete && <span className="text-green-400 ml-2">✓ {t('uploadComplete')}</span>}
                  </p>
                </div>
                <button onClick={() => { setShowManageForm(false); setManagingAlbum(null); setUploading(false); setUploadComplete(false); }}><X className="w-5 h-5" /></button>
              </div>

              {uploadComplete && managingAlbum?.share_token && (
                <div className="mb-6 flex justify-center">
                  <button onClick={() => openAlbum(managingAlbum.share_token)} className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors shadow-lg">
                    <ExternalLink className="w-5 h-5" />
                    <span>{t('openStudio')}</span>
                  </button>
                </div>
              )}

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

        {(uploading || uploadComplete) && (
          <div className={`fixed bottom-6 right-6 z-50 backdrop-blur-sm border rounded-xl p-4 shadow-2xl min-w-[280px] ${uploadComplete ? 'bg-green-900/95 border-green-500/30' : 'bg-gray-900/95 border-amber-500/30'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 text-amber-500 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                <span className={`text-sm font-semibold ${uploadComplete ? 'text-green-400' : 'text-amber-500'}`}>{uploadComplete ? t('uploadComplete') : t('uploading')}</span>
              </div>
              <button onClick={() => { setUploading(false); setUploadComplete(false); setUploadProgress(0); setUploadedFiles(0); setTotalUploadFiles(0); }} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            {!uploadComplete && (
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-amber-500 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{t('uploaded')}: <span className="text-green-400 font-bold">{uploadedFiles}</span></span>
              {!uploadComplete && <span className="text-gray-400">{t('remaining')}: <span className="text-amber-400 font-bold">{totalUploadFiles - uploadedFiles}</span></span>}
              {!uploadComplete && <span className="text-amber-500 font-bold">{Math.round(uploadProgress)}%</span>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}