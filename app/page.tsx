import Link from "next/link";
import Image from "next/image";
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc)[0...10] {
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    mainImage,
    "categories": categories[]->title,
    author->{name, image}
  }`;
  return await client.fetch(query);
}

function extractTextFromBlocks(body: any[]): string {
  if (!body || !Array.isArray(body)) return "";
  return body
    .map(block => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map((child: any) => child.text).join('');
    })
    .join(' ');
}

function calculateReadingTime(body: any[]) {
  const text = extractTextFromBlocks(body);
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200);
  return `${time} min read`;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between overflow-x-hidden">
      <div>
        {/* Panoramik Banner - Mobilde oranları dengelendi */}
        <div className="relative w-full h-[30vh] sm:h-[45vh] min-h-[220px] max-h-[480px]">
          <Image
            src="/sword.jpg"
            alt="The Warrior's Ledger - Panoramic Banner"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          <div className="absolute inset-0 blue/10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Hero Metin Alanı */}
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 bg-white p-6 sm:p-10 rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 -mt-12 sm:-mt-20 relative z-10">
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
              The Warrior's Ledger
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Chronicles of a warrior turning life's battles into a daily journal. Documenting personal growth, the art of living, and the raw drafts of a book in progress.
            </p>
          </div>

          {/* Recent Posts Section Header */}
          <div className="border-b border-gray-200 pb-4 sm:pb-5 mb-6 sm:mb-8 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Latest Dispatches
            </h2>
            <Link href="/all-posts" className="text-xs sm:text-sm font-medium text-indigo-600 hover:underline">
              All Posts
            </Link>
          </div>

          {/* Blog Kartları Listesi veya Boş Durum */}
          <div className="grid gap-4 sm:gap-6">
            {posts.length === 0 ? (
              <div className="text-center py-16 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Henüz Savaş Raporu Yok</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  Savaşçı henüz klavyesinin başına geçmedi veya yeni yazılar yolda. Sanity panelinden ilk yazını ekleyebilirsin.
                </p>
                <span className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-full shadow-md">
                  Ready for Battle
                </span>
              </div>
            ) : (
              posts.map((post: any) => {
                const extractedBodyText = extractTextFromBlocks(post.body);
                const fullText = post.excerpt || extractedBodyText || "Yazının içeriği yükleniyor...";
                const limitedText = fullText.length > 130 ? fullText.slice(0, 130) + "..." : fullText;
                const readingTime = calculateReadingTime(post.body);

                return (
                  <div key={post.slug?.current} className="p-4 sm:p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                    
                    {/* Kapak Görseli */}
                    {post.mainImage && (
                      <div className="relative w-full sm:w-48 h-48 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={urlFor(post.mainImage).url()}
                          alt={post.title || "Post Image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* İçerik Kısmı */}
                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
                          <span className="px-2.5 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full">
                            {post.categories?.[0] || 'Journey'}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs font-semibold text-gray-600">{readingTime}</span>
                          
                          {/* Yazar Bilgisi */}
                          {post.author && (
                            <>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center space-x-1.5">
                                {post.author.image && (
                                    <div className="relative w-5 h-5 rounded-full overflow-hidden">
                                      <Image
                                        src={urlFor(post.author.image).url()}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                )}
                                <span className="text-xs font-medium text-gray-700">{post.author.name}</span>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                          {limitedText}
                        </p>
                      </div>

                      {/* Alt Kısım: Tarih ve Buton */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs">
                        {post.publishedAt ? (
                          <span className="text-gray-400 font-medium">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        ) : <span />}

                        <Link 
                          href={`/posts/${post.slug?.current}`} 
                          className="inline-flex items-center px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
                        >
                          Read Dispatch →
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Copyright ve İletişim Alanı */}
      <footer className="w-full border-t border-gray-100 py-6 text-center text-xs text-gray-500 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p>© {new Date().getFullYear()} Warrior's Blog. All rights reserved.</p>
          <span className="hidden sm:inline text-gray-300">•</span>
          <a href="mailto:info@ceffblog.com" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            ✉️ info@ceffblog.com
          </a>
        </div>
      </footer>
    </div>
  );
}
