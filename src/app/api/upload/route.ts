import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// إعدادات Cloudinary الآمنة (تشتغل على السيرفر فقط)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'لا يوجد ملف للرفع' }, { status: 400 });
    }

    // تحويل الملف إلى صيغة يفهمها Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // رفع الصورة للسحابة
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'photographer-portal', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // إرجاع رابط الصورة الآمن للموقع
    return NextResponse.json({ 
      success: true, 
      url: (result as any).secure_url 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'فشل في رفع الصورة' }, { status: 500 });
  }
}