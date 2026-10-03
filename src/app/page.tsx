'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Globe, Loader2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'pending'>('success');
  const router = useRouter();

  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');

  // التحقق من الـ auth callback عند تحميل الصفحة
  useEffect(() => {
    const checkAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const userEmail = user.email?.toLowerCase();
          
          // التحقق من الأدمن
          const { data: adminData } = await supabase
            .from('admins')
            .select('email')
            .ilike('email', userEmail || '')
            .single();

          if (adminData) {
            router.push('/dashboard');
            return;
          }

          // التحقق من المستخدم المعتمد
          const { data: approvedData } = await supabase
            .from('approved_users')
            .select('*')
            .ilike('email', userEmail || '')
            .eq('is_active', true)
            .single();

          if (approvedData) {
            router.push('/dashboard');
            return;
          }

          // مش معتمد
          await supabase.auth.signOut();
          setMessage(
            lang === 'ar' 
              ? ' حسابك في انتظار الموافقة.' 
              : '⏳ Your account is pending approval.'
          );
          setMessageType('pending');
          window.location.hash = '';
        }
      }
    };

    checkAuthCallback();
  }, [router, lang]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/dashboard` 
      }
    });
    if (error) {
      console.error('Google login error:', error);
      setMessage(
        lang === 'ar' ? 'حدث خطأ في تسجيل الدخول.' : 'Login error occurred.'
      );
      setMessageType('error');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithOtp({ email });
      
      if (error) {
        setMessage(lang === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'Error occurred.');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // التحقق من الأدمن
      const { data: adminData } = await supabase
        .from('admins')
        .select('email')
        .ilike('email', email.toLowerCase())
        .single();

      if (adminData) {
        setMessage(
          lang === 'ar' ? '✓ تم إرسال رابط الدخول (أدمن)' : '✓ Admin login link sent'
        );
        setMessageType('success');
      } else {
        // التحقق من المستخدم المعتمد
        const { data: approvedData } = await supabase
          .from('approved_users')
          .select('*')
          .ilike('email', email.toLowerCase())
          .eq('is_active', true)
          .single();

        if (approvedData) {
          setMessage(
            lang === 'ar' ? '✓ تم إرسال رابط الدخول' : '✓ Login link sent'
          );
          setMessageType('success');
        } else {
          // مش معتمد - إضافة طلب معلق
          await supabase.from('pending_users').upsert(
            [{ email: email.toLowerCase(), status: 'pending' }],
            { onConflict: 'email' }
          );

          setMessage(
            lang === 'ar' 
              ? '⏳ تم إرسال طلب الدخول. في انتظار موافقة المدير.' 
              : '⏳ Access requested. Waiting for admin approval.'
          );
          setMessageType('pending');
        }
      }
    } catch (err) {
      setMessage(lang === 'ar' ? 'حدث خطأ غير متوقع.' : 'Unexpected error.');
      setMessageType('error');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* الخلفية مع Blur */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/mybackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="fixed inset-0 bg-black/70 z-0" />

      {/* زر تغيير اللغة */}
      <button 
        onClick={toggleLang} 
        className="fixed top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors border border-white/10"
      >
        <Globe className="w-4 h-4 text-white" />
      </button>

      {/* الـ Card الرئيسي */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-3xl mx-4 shadow-2xl"
      >
        <div className="flex items-center gap-8">
          {/* الجزء الأيسر: اللوجو والعنوان */}
          <div className="flex-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-black border-2 border-amber-500/30 flex items-center justify-center overflow-hidden shadow-lg">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="mb-4">
              <h1 className="text-3xl font-bold text-white mb-1">Welcome</h1>
              <h2 className="text-2xl font-bold text-amber-500 mb-1">Boles Elhamy</h2>
              <p className="text-gray-400 text-sm">Photography</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-4">
              <Shield className="w-4 h-4" />
              <span>{lang === 'ar' ? 'دخول بالموافقة فقط' : 'Invite Only Access'}</span>
            </div>
          </div>

          {/* الفاصل العمودي */}
          <div className="w-px h-64 bg-white/10"></div>

          {/* الجزء الأيمن: الأزرار والنموذج */}
          <div className="flex-1">
            {/* زر Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition-all mb-4 border border-white/10 hover:border-white/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {lang === 'ar' ? 'تسجيل الدخول بـ Google' : 'Sign in with Google'}
            </button>

            {/* الفاصل OR */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-gray-500 text-xs">OR</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* نموذج الإيميل */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <p className="text-gray-400 text-center text-xs">
                {lang === 'ar' ? 'أدخل إيميلك لطلب إذن الدخول' : 'Enter your email to request access'}
              </p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full pl-10 pr-3 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition-all border border-white/10 hover:border-white/20 disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {lang === 'ar' ? 'طلب إذن الدخول' : 'Request Access'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* رسالة النجاح/الخطأ/الانتظار */}
            {message && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center mt-3 text-xs ${
                  messageType === 'success' ? 'text-green-400' : 
                  messageType === 'pending' ? 'text-amber-400' : 
                  'text-red-400'
                }`}
              >
                {message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <p className="text-gray-600 text-xs">© 2025 Boles Elhamy Photography</p>
        </div>
      </motion.div>
    </div>
  );
}