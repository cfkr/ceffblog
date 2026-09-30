import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    publishedAt,
    body,
    mainImage,
    "categories": categories[]->title
  }`;
  return await client.fetch(query, { slug });
}

// Okuma süresi hesaplama fonksiyonu
function calculateReadingTime(body: any[]) {
  if (!body) return "1 min read";
  const text = body
    .map((block) => block._type === 'block' && block.children ? block.children.map((c: any) => c.text).join('') : '')
    .join(' ');
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200);
  return `${time} min read`;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Yazı bulunamadı.</h1>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">Ana sayfaya dön</Link>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.body);
  const postUrl = `http://localhost:3000/posts/${post.slug?.current}`;

  return (
    <div className="min-h-screen bg-white py-12 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Geri Dönüş Linki */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-lg font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> 
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Kategori, Tarih ve Okuma Süresi */}
        <div className="flex items-center space-x-3 mb-4 text-xs">
          {post.categories?.[0] && (
            <span className="px-3 py-1 font-semibold text-indigo-700 bg-indigo-50 rounded-full">
              {post.categories[0]}
            </span>
          )}
          {post.publishedAt && (
            <span className="text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          <span className="text-gray-300">•</span>
          <span className="text-gray-700 font-semibold">{readingTime}</span>
        </div>

        {/* Başlık */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Ana Görsel */}
        {post.mainImage && (
          <div className="relative w-full h-[350px] sm:h-[450px] rounded-2xl overflow-hidden mb-8 shadow-md">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title || "Post Image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* İçerik Alanı */}
        <div className="prose prose-indigo max-w-none text-gray-700 space-y-4 mb-12">
          {post.body ? (
            post.body.map((block: any, index: number) => {
              if (block._type === 'block' && block.children) {
                return (
                  <p key={index} className="leading-relaxed">
                    {block.children.map((child: any) => child.text).join('')}
                  </p>
                );
              }
              return null;
            })
          ) : (
            <p>İçerik yükleniyor...</p>
          )}
        </div>

        {/* Sosyal Medya / Paylaşım Alanı (2x2 Grid Düzeni & İngilizce Metin) */}
        <div className="border-t border-gray-100 pt-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm font-semibold text-gray-800 text-center md:text-left">
            Did you like this article? You can share or follow:
          </div>
          
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-bold text-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Twitter / X
            </a>
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} -${postUrl}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-bold text-center text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
            >
              WhatsApp
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-bold text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-bold text-center text-white bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:opacity-90 rounded-xl transition-opacity"
            >
              Instagram
            </a>
          </div>
        </div>

      </div>

      {/* Footer / Alt Bilgi */}
      <footer className="w-full border-t border-gray-100 py-8 mt-auto text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Warrior's Blog. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
