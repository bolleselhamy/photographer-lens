'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Home, Calendar, Image as ImageIcon, Download, Bell, Plus, X, Copy, ExternalLink,
  Trash2, Upload, FileImage, FileVideo, Loader2, CheckCircle2, Phone, MessageCircle,
  Camera, Shield, UserCheck, UserX, UserCog, Edit, Save, LogOut, Sun, Moon, Users,
  ChevronLeft, TrendingUp, Globe, Folder, User
} from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const tr: Record<string, Record<string, string>> = {
  ar: {
    welcome: 'مرحباً بك', welcomeSub: 'لتصفح ذكرياتك', welcomeDesc: 'إليك نظرة عامة على جلساتك، ويمكنك الآن الوصول إلى صورك وتنزيلها بسهولة.',
    home: 'الرئيسية', clients: 'العملاء', albums: 'الألبومات', permissions: 'الصلاحيات', users: 'إدارة المستخدمين',
    addClient: 'إضافة عميل', createAlbum: 'إنشاء جلسة', totalSessions: 'إجمالي الجلسات', totalPhotos: 'إجمالي الصور',
    totalClients: 'إجمالي العملاء', todayDownloads: 'التنزيلات اليوم', yourSessions: 'جلساتك', viewAll: 'عرض الكل',
    noAlbums: 'لا توجد جلسات بعد. أنشئ أول جلسة!', noClients: 'لا يوجد عملاء بعد.', clientName: 'اسم العميل',
    albumName: 'اسم الجلسة', description: 'الوصف', selectClient: 'اختر العميل', cancel: 'إلغاء', save: 'حفظ',
    copyLink: 'نسخ الرابط', copied: 'تم النسخ', open: 'فتح', uploadMedia: 'رفع الوسائط', downloadPhotos: 'تحميل الصور',
    confirmDel: 'هل أنت متأكد من الحذف؟', logout: 'تسجيل الخروج', photosCount: 'صورة', files: 'ملفات',
    uploading: 'جاري الرفع...', uploaded: 'تم رفع', uploadComplete: 'اكتمل الرفع!', noMedia: 'لا توجد ملفات',
    image: 'صورة', video: 'فيديو', pending: 'طلبات معلقة', approved: 'المستخدمون المعتمدون', approve: 'موافقة', reject: 'رفض',
    viewer: 'مشاهد', editor: 'محرر', admin: 'مدير', noPending: 'لا توجد طلبات معلقة', noApproved: 'لا يوجد مستخدمون معتمدون',
    noUsers: 'لا يوجد مستخدمون', addUser: 'إضافة مستخدم', email: 'البريد الإلكتروني', help: 'هل تحتاج إلى مساعدة؟',
    helpDesc: 'تواصل معي لأي استفسار أو دعم فني.', whatsapp: 'تواصل عبر واتساب', photographer: 'Photographer',
    wedding: 'جلسة زفاف', portrait: 'جلسة بورتريه', event: 'مناسبات خاصة', other: 'أخرى', sessions: 'جلسة', user: 'مستخدم',
    capture: 'Capture Your Moments', invited: 'تم إرسال دعوة إلى', inviteFail: 'فشل إرسال الدعوة.'
  },
  en: {
    welcome: 'Welcome', welcomeSub: 'to browse your memories', welcomeDesc: 'Here is an overview of your sessions. You can now access and download your photos easily.',
    home: 'Home', clients: 'Clients', albums: 'Albums', permissions: 'Permissions', users: 'User Management',
    addClient: 'Add Client', createAlbum: 'Create Session', totalSessions: 'Total Sessions', totalPhotos: 'Total Photos',
    totalClients: 'Total Clients', todayDownloads: "Today's Downloads", yourSessions: 'Your Sessions', viewAll: 'View All',
    noAlbums: 'No sessions yet. Create your first one!', noClients: 'No clients yet.', clientName: 'Client Name',
    albumName: 'Session Name', description: 'Description', selectClient: 'Select Client', cancel: 'Cancel', save: 'Save',
    copyLink: 'Copy Link', copied: 'Copied', open: 'Open', uploadMedia: 'Upload Media', downloadPhotos: 'Download Photos',
    confirmDel: 'Are you sure you want to delete?', logout: 'Logout', photosCount: 'photos', files: 'files',
    uploading: 'Uploading...', uploaded: 'Uploaded', uploadComplete: 'Upload Complete!', noMedia: 'No files',
    image: 'Image', video: 'Video', pending: 'Pending Requests', approved: 'Approved Users', approve: 'Approve', reject: 'Reject',
    viewer: 'Viewer', editor: 'Editor', admin: 'Admin', noPending: 'No pending requests', noApproved: 'No approved users',
    noUsers: 'No users', addUser: 'Add User', email: 'Email', help: 'Need Help?',
    helpDesc: 'Contact me for any inquiry.', whatsapp: 'Contact via WhatsApp', photographer: 'Photographer',
    wedding: 'Wedding Session', portrait: 'Portrait Session', event: 'Special Events', other: 'Other', sessions: 'sessions', user: 'users',
    capture: 'Capture Your Moments', invited: 'Invitation sent to', inviteFail: 'Failed to send invitation.'
  }
};

const genToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
type Tab = 'home' | 'clients' | 'albums' | 'permissions' | 'users';
type Role = 'viewer' | 'editor' | 'admin';

export default function DashboardPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const t = (k: string) => tr[lang][k] || k;
  const rtl = lang === 'ar';
  const toggleTheme = () => {
    const n = theme === 'dark' ? 'light' : 'dark';
    setTheme(n);
    document.documentElement.setAttribute('data-theme', n);
  };

  const [tab, setTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<Role>('viewer');
  const [email, setEmail] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const [showClient, setShowClient] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [clientName, setClientName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [sessionType, setSessionType] = useState('wedding');
  const [sessionDate, setSessionDate] = useState('');
  const [selClient, setSelClient] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('viewer');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [managing, setManaging] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedN, setUploadedN] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingAlbum = useRef<any>(null);

  useEffect(() => { document.documentElement.setAttribute('data-theme', 'dark'); }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/'; return; }
      const e = (user.email || '').toLowerCase();
      setEmail(e);
      if (e === 'popbop202@gmail.com') {
        setUserRole('admin');
        await supabase.from('admins').upsert({ email: e }, { onConflict: 'email' });
        await loadData(); setLoading(false); return;
      }
      const { data: a } = await supabase.from('admins').select('email').ilike('email', e).single();
      if (a) { setUserRole('admin'); await loadData(); setLoading(false); return; }
      const { data: ap } = await supabase.from('approved_users').select('*').ilike('email', e).eq('is_active', true).single();
      if (ap) {
        if (ap.role !== 'admin') { window.location.href = '/client'; return; }
        setUserRole('admin'); await loadData(); setLoading(false); return;
      }
      await supabase.auth.signOut();
      window.location.href = '/';
    };
    init();
  }, []);

  const loadData = async () => {
    const { data: c } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (c) setClients(c);
    const { data: a } = await supabase.from('albums').select('*, clients(name)').order('created_at', { ascending: false });
    if (a) {
      setAlbums(a);
      const m: Record<string, number> = {};
      for (const al of a) {
        const { count } = await supabase.from('media').select('*', { count: 'exact', head: true }).eq('album_id', al.id);
        m[al.id] = count || 0;
      }
      setCounts(m);
    }
    await loadPerms(); await loadAllUsers();
  };
  const loadPerms = async () => {
    const { data: p } = await supabase.from('pending_users').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    if (p) setPendingUsers(p);
    const { data: a } = await supabase.from('approved_users').select('*').order('created_at', { ascending: false });
    if (a) setApprovedUsers(a);
  };
  const loadAllUsers = async () => {
    const { data: admins } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
    const { data: approved } = await supabase.from('approved_users').select('*').order('created_at', { ascending: false });
    const ae = new Set(admins?.map((x: any) => x.email.toLowerCase()) || []);
    setAllUsers([
      ...(admins?.map((u: any) => ({ ...u, role: 'admin' })) || []),
      ...(approved?.filter((u: any) => !ae.has(u.email.toLowerCase())) || [])
    ]);
  };

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/'; };

  // Clients
  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('clients').insert([{ name: clientName }]).select();
    if (!error && data) { setClients([data[0], ...clients]); setClientName(''); setShowClient(false); }
  };
  const delClient = async (id: string) => {
    if (!window.confirm(t('confirmDel'))) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (!error) { setClients(clients.filter(c => c.id !== id)); setAlbums(albums.filter(a => a.client_id !== id)); }
  };

  // Albums
  const addAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('albums').insert([{
      name: albumName, description: albumDesc, client_id: selClient || null, is_public: true,
      share_token: genToken(), session_type: sessionType, session_date: sessionDate || new Date().toISOString()
    }]).select();
    if (!error && data) {
      const cl = clients.find(c => c.id === selClient);
      setAlbums([{ ...data[0], clients: cl ? { name: cl.name } : null }, ...albums]);
      setCounts(p => ({ ...p, [data[0].id]: 0 }));
      setAlbumName(''); setAlbumDesc(''); setSessionType('wedding'); setSessionDate(''); setSelClient(''); setShowAlbum(false);
    }
  };
  const delAlbum = async (id: string) => {
    if (!window.confirm(t('confirmDel'))) return;
    const { error } = await supabase.from('albums').delete().eq('id', id);
    if (!error) { setAlbums(albums.filter(a => a.id !== id)); loadData(); }
  };
  const copyLink = (tok: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/album/${tok}`);
    setCopied(tok); setTimeout(() => setCopied(null), 2000);
  };
  const openAlbum = (tok: string) => { if (tok) window.open(`/album/${tok}`, '_blank'); };

  // Upload
  const pickFiles = (al: any) => { pendingAlbum.current = al; fileRef.current?.click(); };
  const onFiles = async (files: FileList | null) => {
    const al = pendingAlbum.current;
    if (!files || files.length === 0 || !al) return;
    let album = al;
    if (!album.share_token) {
      const { data } = await supabase.from('albums').update({ share_token: genToken() }).eq('id', album.id).select().single();
      if (data) album = data;
    }
    setManaging(album); setShowManage(true);
    const { data: m } = await supabase.from('media').select('*').eq('album_id', album.id).order('created_at', { ascending: false });
    if (m) setMedia(m);
    await upload(files, album);
    if (fileRef.current) fileRef.current.value = '';
  };
  const upload = async (files: FileList, album: any) => {
    setUploading(true); setProgress(0); setUploadedN(0); setUploadDone(false);
    let n = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.type.startsWith('image/') || f.type.startsWith('video/')) {
          const fd = new FormData();
          fd.append('file', f); fd.append('upload_preset', 'lens-upload');
          try {
            const r = await fetch('https://api.cloudinary.com/v1_1/hcs8l8f1h/auto/upload', { method: 'POST', body: fd });
            const res = await r.json();
            if (res.secure_url) await supabase.from('media').insert([{
              album_id: album.id, url: res.secure_url,
              type: res.resource_type === 'video' ? 'video' : 'image', cloudinary_public_id: res.public_id
            }]);
          } catch (err) { console.error('Upload error:', err); }
        }
        n++; setUploadedN(n); setProgress((n / files.length) * 100);
      }
      const { data: m } = await supabase.from('media').select('*').eq('album_id', album.id).order('created_at', { ascending: false });
      if (m) setMedia(m);
      await loadData(); setUploadDone(true);
    } finally { setUploading(false); }
  };
  const delMedia = async (id: string) => {
    if (!window.confirm(t('confirmDel'))) return;
    await supabase.from('media').delete().eq('id', id);
    setMedia(media.filter(m => m.id !== id)); loadData();
  };

  // Users
  const approve = async (em: string, role: 'viewer' | 'editor') => {
    await supabase.from('approved_users').upsert([{ email: em, role, is_active: true, session_token: genToken(), approved_at: new Date().toISOString() }], { onConflict: 'email' });
    await supabase.from('pending_users').update({ status: 'approved' }).eq('email', em);
    await loadPerms(); await loadAllUsers();
  };
  const reject = async (em: string) => {
    await supabase.from('pending_users').update({ status: 'rejected' }).eq('email', em);
    await loadPerms();
  };
  const deactivate = async (em: string) => {
    await supabase.from('approved_users').update({ is_active: false, session_token: null }).ilike('email', em);
    await loadPerms(); await loadAllUsers();
  };
  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    if (newRole === 'admin') await supabase.from('admins').upsert({ email: newEmail }, { onConflict: 'email' });
    await supabase.from('approved_users').upsert([{ email: newEmail, role: newRole, is_active: true, session_token: genToken(), approved_at: new Date().toISOString() }], { onConflict: 'email' });
    const { error } = await supabase.auth.signInWithOtp({ email: newEmail, options: { shouldCreateUser: true } });
    if (error) { alert(t('inviteFail')); return; }
    const sent = newEmail;
    setNewEmail(''); setNewRole('viewer'); setShowUser(false);
    await loadAllUsers(); alert(`✓ ${t('invited')} ${sent}`);
  };
  const editUser = async (u: any, role: Role) => {
    if (role === 'admin') await supabase.from('admins').upsert({ email: u.email }, { onConflict: 'email' });
    else await supabase.from('admins').delete().eq('email', u.email);
    await supabase.from('approved_users').upsert([{ email: u.email, role, is_active: true, approved_at: new Date().toISOString() }], { onConflict: 'email' });
    setEditingUser(null); await loadAllUsers();
  };
  const delUser = async (u: any) => {
    if (!window.confirm(t('confirmDel'))) return;
    await supabase.from('admins').delete().eq('email', u.email);
    await supabase.from('approved_users').delete().ilike('email', u.email);
    await loadAllUsers();
  };

  const totalPhotos = Object.values(counts).reduce((s, c) => s + c, 0);
  const typeLabel = (x: string) => t(['wedding', 'portrait', 'event'].includes(x) ? x : 'other');
  const fmtDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString(rtl ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const card = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' } as const;
  const muted = { color: 'var(--text-muted)' } as const;
  const field = { backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' } as const;
  const goldBtn = { background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', color: '#1a1206' } as const;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const nav: { id: Tab; icon: any; label: string }[] = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'clients', icon: Users, label: t('clients') },
    { id: 'albums', icon: Folder, label: t('albums') },
    { id: 'permissions', icon: Shield, label: t('permissions') },
    { id: 'users', icon: UserCog, label: t('users') },
  ];

  const AlbumRow = ({ al, full }: { al: any; full?: boolean }) => (
    <div className="rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4" style={card}>
      <div className="relative w-full md:w-44 h-28 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.25), var(--bg-secondary))' }}>
        <Camera className="w-10 h-10" style={{ color: 'var(--accent)', opacity: 0.6 }} />
        <span className="absolute bottom-2 start-2 glass px-2 py-1 rounded-lg text-xs text-white flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />{counts[al.id] || 0} {t('photosCount')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold truncate">{al.name}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm my-1" style={muted}>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{fmtDate(al.session_date || al.created_at)}</span>
          {al.clients?.name && <span className="flex items-center gap-1"><User className="w-4 h-4" />{al.clients.name}</span>}
        </div>
        <p className="text-sm mb-3" style={muted}>{al.description || typeLabel(al.session_type || 'other')}</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => pickFiles(al)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={goldBtn}><Upload className="w-4 h-4" />{t('uploadMedia')}</button>
          <button onClick={() => copyLink(al.share_token)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}><Copy className="w-4 h-4" />{copied === al.share_token ? t('copied') : t('copyLink')}</button>
          <button onClick={() => openAlbum(al.share_token)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}><ExternalLink className="w-4 h-4" />{t('open')}</button>
          {full && <button onClick={() => delAlbum(al.id)} className="p-2 rounded-lg" style={muted}><Trash2 className="w-4 h-4" /></button>}
        </div>
      </div>
    </div>
  );

  const Modal = ({ title, onClose, children, wide }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className={`rounded-2xl p-6 w-full ${wide ? 'max-w-2xl max-h-[90vh] overflow-y-auto' : 'max-w-md'}`} style={card}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} style={muted}><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
  const Btns = ({ onCancel }: { onCancel: () => void }) => (
    <div className="flex gap-3">
      <button type="button" onClick={onCancel} className="flex-1 px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>{t('cancel')}</button>
      <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-semibold" style={goldBtn}>{t('save')}</button>
    </div>
  );

  return (
    <div className="min-h-screen" dir={rtl ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 fixed top-0 bottom-0 flex-col p-5 z-30 end-0" style={{ backgroundColor: 'var(--bg-secondary)', borderInlineStart: '1px solid var(--border)' }}>
        <div className="text-center mb-8 mt-2">
          <Camera className="w-6 h-6 mx-auto mb-1" style={{ color: 'var(--accent)' }} />
          <h1 className="font-script text-5xl text-gold-gradient leading-none">Boles</h1>
          <p className="text-[10px] tracking-[0.35em] mt-1" style={muted}>PHOTOGRAPHY</p>
        </div>
        <nav className="flex-1 space-y-1">
          {nav.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
              style={tab === n.id ? goldBtn : { color: 'var(--text-secondary)' }}>
              <n.icon className="w-5 h-5" /><span className="font-medium">{n.label}</span>
              {n.id === 'permissions' && pendingUsers.length > 0 && <span className="ms-auto w-2 h-2 rounded-full bg-red-500" />}
            </button>
          ))}
        </nav>
        <p className="font-script text-3xl text-gold-gradient text-center my-4">{t('capture')}</p>
      </aside>

      {/* Mobile nav */}
      <nav className="lg:hidden flex gap-2 overflow-x-auto p-3 sticky top-0 z-40" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm"
            style={tab === n.id ? goldBtn : { color: 'var(--text-secondary)' }}>
            <n.icon className="w-4 h-4" />{n.label}
          </button>
        ))}
      </nav>

      <main className="lg:me-64">
        <header className="px-5 md:px-8 py-4 flex items-center justify-between sticky top-0 lg:top-0 z-20" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={goldBtn}><Camera className="w-5 h-5" /></div>
            <div><p className="text-sm font-semibold">Boles Elhamy</p><p className="text-xs" style={muted}>{t('photographer')}</p></div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setLang(rtl ? 'en' : 'ar')} className="p-2" style={{ color: 'var(--text-secondary)' }}><Globe className="w-5 h-5" /></button>
            <button onClick={toggleTheme} className="p-2" style={{ color: 'var(--text-secondary)' }}>{theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <button onClick={() => setTab('permissions')} className="p-2 relative" style={{ color: 'var(--text-secondary)' }}>
              <Bell className="w-5 h-5" />{pendingUsers.length > 0 && <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-red-500" />}
            </button>
            <button onClick={logout} className="p-2" style={{ color: 'var(--text-secondary)' }}><LogOut className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="p-5 md:p-8 space-y-8">
          {tab === 'home' && (
            <>
              <section className="relative rounded-3xl overflow-hidden h-60 md:h-72" style={{ background: 'linear-gradient(135deg, #2a1d10, #0a0a0a)' }}>
                <img src="/hero.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => ((e.currentTarget.style.display = 'none'))} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to ${rtl ? 'left' : 'right'}, rgba(0,0,0,0.9), rgba(0,0,0,0.5) 55%, transparent)` }} />
                <div className="relative h-full flex flex-col justify-center p-6 md:p-10 max-w-xl">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{t('welcome')}</h2>
                  <p className="text-xl md:text-3xl text-gold-gradient font-semibold mb-3">{t('welcomeSub')}</p>
                  <p className="text-white/70 text-sm md:text-base">{t('welcomeDesc')}</p>
                </div>
              </section>

              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Calendar, v: albums.length, l: t('totalSessions') },
                  { icon: ImageIcon, v: totalPhotos, l: t('totalPhotos') },
                  { icon: Users, v: clients.length, l: t('totalClients') },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl p-5" style={card}>
                    <div className="flex items-center justify-between mb-3">
                      <s.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} /><TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold">{s.v}</p><p className="text-sm" style={muted}>{s.l}</p>
                  </div>
                ))}
                <button onClick={() => setTab('albums')} className="rounded-2xl p-5 text-start" style={goldBtn}>
                  <Download className="w-6 h-6 mb-3" /><p className="text-lg font-bold">{t('albums')}</p><p className="text-sm opacity-80">{albums.length} {t('sessions')}</p>
                </button>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Camera className="w-5 h-5" style={{ color: 'var(--accent)' }} />{t('yourSessions')}</h2>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowAlbum(true)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm" style={goldBtn}><Plus className="w-4 h-4" />{t('createAlbum')}</button>
                    <button onClick={() => setTab('albums')} className="flex items-center gap-1 text-sm" style={{ color: 'var(--accent)' }}>{t('viewAll')}<ChevronLeft className={`w-4 h-4 ${rtl ? '' : 'rotate-180'}`} /></button>
                  </div>
                </div>
                <div className="space-y-4">
                  {albums.slice(0, 3).map(al => <AlbumRow key={al.id} al={al} />)}
                  {albums.length === 0 && <div className="rounded-2xl p-10 text-center" style={card}><p style={muted}>{t('noAlbums')}</p></div>}
                </div>
              </section>

              <section className="rounded-2xl p-6 grid md:grid-cols-2 gap-6" style={card}>
                <div>
                  <h3 className="text-lg font-bold mb-1">{t('help')}</h3>
                  <p className="text-sm mb-4" style={muted}>{t('helpDesc')}</p>
                  <a href="https://wa.me/201225979165" target="_blank" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl" style={goldBtn}><MessageCircle className="w-5 h-5" />{t('whatsapp')}</a>
                </div>
                <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
                  <a href="tel:+201225979165" className="flex items-center gap-3"><Phone className="w-5 h-5" /><span dir="ltr">+20 122 597 9165</span></a>
                  <a href="https://www.instagram.com/boles.photography" target="_blank" className="flex items-center gap-3"><InstagramIcon className="w-5 h-5" />Instagram</a>
                  <a href="https://www.facebook.com/share/1E6Xrgdz27/" target="_blank" className="flex items-center gap-3"><FacebookIcon className="w-5 h-5" />Facebook</a>
                </div>
              </section>
            </>
          )}

          {tab === 'clients' && (
            <>
              <div className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold">{t('clients')}</h2><p style={muted}>{clients.length}</p></div>
                <button onClick={() => setShowClient(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl" style={goldBtn}><Plus className="w-5 h-5" />{t('addClient')}</button>
              </div>
              <div className="space-y-3">
                {clients.map(c => {
                  const ca = albums.filter(a => a.client_id === c.id);
                  const ph = ca.reduce((s, a) => s + (counts[a.id] || 0), 0);
                  return (
                    <div key={c.id} className="rounded-2xl p-4 flex items-center justify-between" style={card}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={goldBtn}>{c.name.charAt(0).toUpperCase()}</div>
                        <div><h4 className="font-semibold">{c.name}</h4><p className="text-sm" style={muted}>{ca.length} {t('sessions')} • {ph} {t('photosCount')}</p></div>
                      </div>
                      <button onClick={() => delClient(c.id)} className="p-2" style={muted}><Trash2 className="w-5 h-5" /></button>
                    </div>
                  );
                })}
                {clients.length === 0 && <div className="rounded-2xl p-10 text-center" style={card}><p style={muted}>{t('noClients')}</p></div>}
              </div>
            </>
          )}

          {tab === 'albums' && (
            <>
              <div className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold">{t('albums')}</h2><p style={muted}>{albums.length} {t('sessions')}</p></div>
                <button onClick={() => setShowAlbum(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl" style={goldBtn}><Plus className="w-5 h-5" />{t('createAlbum')}</button>
              </div>
              <div className="space-y-4">
                {albums.map(al => <AlbumRow key={al.id} al={al} full />)}
                {albums.length === 0 && <div className="rounded-2xl p-10 text-center" style={card}><p style={muted}>{t('noAlbums')}</p></div>}
              </div>
            </>
          )}

          {tab === 'permissions' && (
            <>
              <h2 className="text-2xl font-bold">{t('permissions')}</h2>
              <div className="rounded-2xl p-5" style={card}>
                <h3 className="text-lg font-bold mb-4">{t('pending')} ({pendingUsers.length})</h3>
                {pendingUsers.length === 0 ? <p className="text-center py-6" style={muted}>{t('noPending')}</p> : (
                  <div className="space-y-3">
                    {pendingUsers.map(r => (
                      <div key={r.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)' }}>
                        <div><h4 className="font-semibold">{r.email}</h4><p className="text-sm" style={muted}>{new Date(r.created_at).toLocaleString()}</p></div>
                        <div className="flex gap-2">
                          <select id={`role-${r.id}`} className="px-3 py-2 rounded-lg text-sm" style={field}>
                            <option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option>
                          </select>
                          <button onClick={() => approve(r.email, (document.getElementById(`role-${r.id}`) as HTMLSelectElement).value as 'viewer' | 'editor')} className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2" style={{ backgroundColor: '#22c55e' }}><UserCheck className="w-4 h-4" />{t('approve')}</button>
                          <button onClick={() => reject(r.email)} className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2" style={{ backgroundColor: 'var(--danger)' }}><UserX className="w-4 h-4" />{t('reject')}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-5" style={card}>
                <h3 className="text-lg font-bold mb-4">{t('approved')} ({approvedUsers.length})</h3>
                {approvedUsers.length === 0 ? <p className="text-center py-6" style={muted}>{t('noApproved')}</p> : (
                  <div className="space-y-3">
                    {approvedUsers.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)' }}>
                        <div><h4 className="font-semibold">{u.email}</h4><p className="text-sm" style={muted}>{new Date(u.approved_at || u.created_at).toLocaleString()}</p></div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(212,165,116,0.2)', color: 'var(--accent)' }}>{u.role === 'editor' ? t('editor') : u.role === 'admin' ? t('admin') : t('viewer')}</span>
                          <button onClick={() => deactivate(u.email)} className="p-2" style={muted}><LogOut className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'users' && (
            <>
              <div className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold">{t('users')}</h2><p style={muted}>{allUsers.length} {t('user')}</p></div>
                <button onClick={() => setShowUser(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl" style={goldBtn}><Plus className="w-5 h-5" />{t('addUser')}</button>
              </div>
              <div className="space-y-3">
                {allUsers.length === 0 && <div className="rounded-2xl p-10 text-center" style={card}><p style={muted}>{t('noUsers')}</p></div>}
                {allUsers.map(u => (
                  <div key={u.email} className="rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3" style={card}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={goldBtn}>{u.email.charAt(0).toUpperCase()}</div>
                      <div><h4 className="font-semibold">{u.email}</h4><p className="text-sm" style={muted}>{new Date(u.created_at || u.approved_at).toLocaleString()}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      {editingUser?.email === u.email ? (
                        <>
                          <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="px-3 py-2 rounded-lg text-sm" style={field}>
                            <option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option><option value="admin">{t('admin')}</option>
                          </select>
                          <button onClick={() => editUser(u, editingUser.role)} className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2" style={{ backgroundColor: '#22c55e' }}><Save className="w-4 h-4" />{t('save')}</button>
                          <button onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)' }}>{t('cancel')}</button>
                        </>
                      ) : (
                        <>
                          <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(212,165,116,0.2)', color: 'var(--accent)' }}>{u.role === 'admin' ? t('admin') : u.role === 'editor' ? t('editor') : t('viewer')}</span>
                          <button onClick={() => setEditingUser(u)} className="p-2" style={muted}><Edit className="w-4 h-4" /></button>
                          <button onClick={() => delUser(u)} className="p-2" style={muted}><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <input ref={fileRef} type="file" className="hidden" multiple accept="image/*,video/*" onChange={e => onFiles(e.target.files)} />

      {showClient && (
        <Modal title={t('addClient')} onClose={() => setShowClient(false)}>
          <form onSubmit={addClient} className="space-y-4">
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder={t('clientName')} className="w-full px-4 py-3 rounded-xl" style={field} required />
            <Btns onCancel={() => setShowClient(false)} />
          </form>
        </Modal>
      )}

      {showAlbum && (
        <Modal title={t('createAlbum')} onClose={() => setShowAlbum(false)}>
          <form onSubmit={addAlbum} className="space-y-4">
            <input value={albumName} onChange={e => setAlbumName(e.target.value)} placeholder={t('albumName')} className="w-full px-4 py-3 rounded-xl" style={field} required />
            <textarea value={albumDesc} onChange={e => setAlbumDesc(e.target.value)} placeholder={t('description')} rows={3} className="w-full px-4 py-3 rounded-xl" style={field} />
            <select value={sessionType} onChange={e => setSessionType(e.target.value)} className="w-full px-4 py-3 rounded-xl" style={field}>
              <option value="wedding">{t('wedding')}</option><option value="portrait">{t('portrait')}</option>
              <option value="event">{t('event')}</option><option value="other">{t('other')}</option>
            </select>
            <input type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)} className="w-full px-4 py-3 rounded-xl" style={field} />
            <select value={selClient} onChange={e => setSelClient(e.target.value)} className="w-full px-4 py-3 rounded-xl" style={field}>
              <option value="">{t('selectClient')}</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Btns onCancel={() => setShowAlbum(false)} />
          </form>
        </Modal>
      )}

      {showUser && (
        <Modal title={t('addUser')} onClose={() => setShowUser(false)}>
          <form onSubmit={addUser} className="space-y-4">
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder={t('email')} className="w-full px-4 py-3 rounded-xl" style={field} required />
            <select value={newRole} onChange={e => setNewRole(e.target.value as Role)} className="w-full px-4 py-3 rounded-xl" style={field}>
              <option value="viewer">{t('viewer')}</option><option value="editor">{t('editor')}</option><option value="admin">{t('admin')}</option>
            </select>
            <Btns onCancel={() => setShowUser(false)} />
          </form>
        </Modal>
      )}

      {showManage && managing && (
        <Modal wide title={`${t('uploadMedia')}: ${managing.name}`} onClose={() => { setShowManage(false); setManaging(null); setUploadDone(false); }}>
          <p className="text-sm mb-4" style={muted}>{media.length} {t('files')}{uploading && ` - ${t('uploading')} ${Math.round(progress)}%`}{uploadDone && ` ✓ ${t('uploadComplete')}`}</p>
          <div className="space-y-3">
            {media.length === 0 && !uploading ? <p className="text-center py-8" style={muted}>{t('noMedia')}</p> : media.map(m => (
              <div key={m.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-hover)' }}>
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {m.type === 'image' ? <img src={m.url} alt="" className="w-full h-full object-cover" /> : <video src={m.url} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 flex items-center gap-2 text-sm" style={muted}>
                  {m.type === 'image' ? <FileImage className="w-4 h-4" style={{ color: 'var(--accent)' }} /> : <FileVideo className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
                  {m.type === 'image' ? t('image') : t('video')}
                </div>
                <button onClick={() => delMedia(m.id)} className="p-2" style={muted}><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {(uploading || uploadDone) && (
        <div className="fixed bottom-6 start-6 z-[60] rounded-2xl p-4 shadow-2xl min-w-[260px]" style={card}>
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-sm font-semibold">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent)' }} /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
              {uploadDone && !uploading ? t('uploadComplete') : t('uploading')}
            </span>
            <button onClick={() => { setUploading(false); setUploadDone(false); }} style={muted}><X className="w-4 h-4" /></button>
          </div>
          {!uploadDone && <div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: 'var(--bg-hover)' }}><div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }} /></div>}
          <p className="text-xs" style={muted}>{t('uploaded')}: <b className="text-green-500">{uploadedN}</b></p>
        </div>
      )}
    </div>
  );
}
