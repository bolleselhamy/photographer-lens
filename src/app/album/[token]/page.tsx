'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Heart, Download, X, Check, CheckSquare, Square, ArrowLeft, Trash2 } from 'lucide-react';

export default function AlbumPage() {
  const [token, setToken] = useState<string>('');
  const [album, setAlbum] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const tokenFromUrl = path.split('/album/')[1];
    setToken(tokenFromUrl || '');
    
    if (tokenFromUrl) {
      loadAlbum(tokenFromUrl);
    } else {
      setLoading(false);
    }
  }, []);

  const loadAlbum = async (albumToken: string) => {
    try {
      const { data: albumData, error } = await supabase
        .from('albums')
        .select('*, clients(name)')
        .eq('share_token', albumToken)
        .single();

      if (error || !albumData) {
        setLoading(false);
        return;
      }

      setAlbum(albumData);

      const { data: mediaData } = await supabase
        .from('media')
        .select('*')
        .eq('album_id', albumData.id)
        .order('created_at', { ascending: true });

      if (mediaData) {
        setMedia(mediaData);
      }
    } catch (err) {
      console.error('Error loading album:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === media.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(media.map(m => m.id)));
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
      window.open(url, '_blank');
    }
  };

  const handleDownload = async (url: string) => {
    const filename = url.split('/').pop() || 'download.jpg';
    await downloadFile(url, filename);
  };

  const downloadSelected = async () => {
    const itemsToDownload = media.filter(m => selectedItems.has(m.id));
    setDownloading(true);
    
    for (let i = 0; i < itemsToDownload.length; i++) {
      const item = itemsToDownload[i];
      const filename = item.url.split('/').pop() || `image-${i + 1}.jpg`;
      await downloadFile(item.url, filename);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setDownloading(false);
  };

  const deleteSelected = async () => {
    if (selectedItems.size === 0) return;
    if (!window.confirm('هل أنت متأكد من حذف الصور المحددة؟')) return;

    const itemsToDelete = Array.from(selectedItems);
    
    for (const id of itemsToDelete) {
      await supabase.from('media').delete().eq('id', id);
    }

    setMedia(media.filter(m => !selectedItems.has(m.id)));
    setSelectedItems(new Set());
    setSelectMode(false);
  };

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">الألبوم غير موجود</h1>
          <p className="text-gray-400">تأكد من صحة الرابط</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* زر الرجوع للداشبورد - بدون نص */}
            <button
              onClick={goToDashboard}
              className="flex items-center justify-center px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 rounded-lg transition-colors"
              title="العودة للداشبورد"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-amber-500">{album.name}</h1>
              {album.clients?.name && (
                <p className="text-gray-400 mt-1">العميل: {album.clients.name}</p>
              )}
              {album.description && (
                <p className="text-gray-500 text-sm mt-2">{album.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
              <span className="text-amber-400 font-bold">{media.length}</span>
              <span className="text-gray-400 mx-1">صورة</span>
              {selectMode && selectedItems.size > 0 && (
                <>
                  <span className="text-gray-500">|</span>
                  <span className="text-green-400 font-bold ml-1">{selectedItems.size}</span>
                  <span className="text-gray-400 ml-1">مختارة</span>
                </>
              )}
            </div>

            {media.length > 0 && (
              <>
                <button
                  onClick={() => {
                    setSelectMode(!selectMode);
                    if (selectMode) setSelectedItems(new Set());
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {selectMode ? <X className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                  {selectMode ? 'إلغاء' : 'اختيار'}
                </button>

                {selectMode && (
                  <>
                    <button
                      onClick={selectAll}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      {selectedItems.size === media.length ? 'إلغاء الكل' : 'اختيار الكل'}
                    </button>

                    {selectedItems.size > 0 && (
                      <>
                        <button
                          onClick={deleteSelected}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          حذف ({selectedItems.size})
                        </button>

                        <button
                          onClick={downloadSelected}
                          disabled={downloading}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {downloading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          {downloading ? 'جاري التحميل...' : `تحميل (${selectedItems.size})`}
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              <Heart className="w-5 h-5 text-red-500" />
              <span>LENS Photography</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {media.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-400 text-xl">لا توجد صور في هذا الألبوم بعد</p>
            <p className="text-gray-500 text-sm mt-2">المصور سيقوم برفع الصور قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => {
              const isSelected = selectedItems.has(item.id);
              return (
                <div 
                  key={item.id} 
                  className={`relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800 aspect-square ${isSelected ? 'ring-4 ring-amber-500' : ''}`}
                  onClick={() => {
                    if (selectMode) {
                      toggleSelect(item.id);
                    } else if (item.type === 'image') {
                      setSelectedImage(item.url);
                    }
                  }}
                >
                  {item.type === 'image' ? (
                    <img src={item.url} alt={album.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" controls />
                  )}
                  
                  {selectMode && (
                    <div className="absolute top-3 left-3 z-10">
                      {isSelected ? (
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center border-2 border-white">
                          <Square className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  )}

                  {!selectMode && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownload(item.url); }}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  )}

                  {item.type === 'video' && !selectMode && (
                    <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-amber-500 bg-gray-800/50 p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Full size" 
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            onClick={(e) => { e.stopPropagation(); handleDownload(selectedImage); }}
            className="absolute bottom-8 right-8 p-4 bg-amber-500 hover:bg-amber-600 rounded-full transition-colors"
          >
            <Download className="w-6 h-6 text-black" />
          </button>
        </div>
      )}
    </div>
  );
}