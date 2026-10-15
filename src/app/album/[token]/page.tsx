'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  Image as ImageIcon, Download, ArrowLeft, Camera, 
  Phone, MessageCircle, ChevronLeft, ChevronRight,
  X, ZoomIn, ZoomOut
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

export default function AlbumPage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadAlbum = async () => {
      const { data: albumData } = await supabase
        .from('albums')
        .select('*, clients(name)')
        .eq('share_token', params.token)
        .single();

      if (albumData) {
        setAlbum(albumData);
        const { data: mediaData } = await supabase
          .from('media')
          .select('*')
          .eq('album_id', albumData.id)
          .order('created_at', { ascending: true });
        
        if (mediaData) setMedia(mediaData);
      }
      setLoading(false);
    };

    loadAlbum();
  }, [params.token]);

  const openImage = (index: number) => {
    setSelectedImage(media[index].url);
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedImage(media[currentIndex + 1].url);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedImage(media[currentIndex - 1].url);
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

  if (!album) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-16 h-16 text-amber-600/30 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">الألبوم غير موجود</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-900 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-amber-600 hover:text-amber-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-xl font-bold text-white">{album.name}</h1>
              <p className="text-sm text-gray-500">{album.clients?.name || 'Boles Elhamy Photography'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ImageIcon className="w-4 h-4" />
            <span>{media.length} صورة</span>
          </div>
        </div>
      </header>

      {/* Gallery */}
      <main className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openImage(index)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            >
              <img 
                src={item.url} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {media.length === 0 && (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-amber-600/30 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">لا توجد صور في هذا الألبوم</p>
          </div>
        )}
      </main>

      {/* Contact Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-950 border-t border-gray-800 p-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Camera className="w-8 h-8 text-amber-600" />
                <div>
                  <h3 className="text-xl font-bold text-white">Boles Elhamy Photography</h3>
                  <p className="text-sm text-gray-500">تواصل معي لأي استفسار</p>
                </div>
              </div>
              <a 
                href="https://wa.me/201225979165" 
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>تواصل عبر واتساب</span>
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
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button onClick={closeImage} className="absolute top-4 right-4 p-2 text-white hover:text-amber-600 transition-colors">
            <X className="w-8 h-8" />
          </button>
          
          <button 
            onClick={prevImage}
            disabled={currentIndex === 0}
            className="absolute left-4 p-2 text-white hover:text-amber-600 transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <img 
            src={selectedImage} 
            alt="" 
            className="max-w-full max-h-full object-contain"
          />
          
          <button 
            onClick={nextImage}
            disabled={currentIndex === media.length - 1}
            className="absolute right-4 p-2 text-white hover:text-amber-600 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}