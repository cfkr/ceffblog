import Link from "next/link";
import Image from "next/image";
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

export const revalidate = 0;

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    slug,
    publishedAt,
    _createdAt,
    body,
    mainImage,
    "categories": categories[]->title,
    author->{name, image}
  }`;
  return await client.fetch(query, { slug });
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

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dispatch Not Found</h1>
          <Link href="/" className="text-indigo-600 hover:underline text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.body);
  const displayDate = post.publishedAt || post._createdAt;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Geri Dönüş Butonu (İngilizce yapıldı) */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Yazı Üst Bilgileri */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full">
              {post.categories?.[0] || 'Journey'}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-semibold text-gray-500">
              {displayDate ? new Date(displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-semibold text-gray-500">{readingTime}</span>
            
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

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Ana Görsel */}
        {post.mainImage && (
          <div className="relative w-full h-[50vh] min-h-[300px] max-h-[450px] rounded-2xl overflow-hidden mb-8 bg-gray-100 shadow-sm">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title || "Post Image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Yazı İçeriği (PortableText) */}
        <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed space-y-6 text-base sm:text-lg">
          <PortableText value={post.body} />
        </div>

      </div>

      <footer className="w-full border-t border-gray-100 py-6 text-center text-xs text-gray-500 mt-auto">
        <p>© {new Date().getFullYear()} Warrior's Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}
