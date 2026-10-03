'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/dashboard',
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('✅ تم إرسال رابط تسجيل الدخول إلى إيميلك!');
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/dashboard',
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src="/logo.png"
                alt="Boles Elhamy Photography Logo"
                fill
                sizes="128px"
                className="object-contain rounded-full"
              />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <h2 className="text-2xl font-semibold text-amber-400 mb-2">Boles Elhamy</h2>
          <p className="text-gray-300 text-lg">Photography</p>
        </div>

        {/* زر Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-800 py-3 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-100 transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              أدخل إيميلك لتسجيل الدخول
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="example@gmail.com"
                required
              />
            </div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-300 text-sm flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                إرسال رابط تسجيل الدخول
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          🔒 آمن وسريع
        </p>
      </motion.div>
    </div>
  );
}