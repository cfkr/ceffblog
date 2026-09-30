import Link from "next/link";
import Image from "next/image";
import { urlFor } from '@/sanity/lib/image';

function extractTextFromBlocks(body: any[]): string {
  if (!body || !Array.isArray(body)) return "";
  return body
    .map(block => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map((child: any) => child.text).join('');
    })
    .join(' ');
}

export default function PostCard({ post }: { post: any }) {
  const extractedBodyText = extractTextFromBlocks(post.body);
  const fullText = post.excerpt || extractedBodyText || "Yazının içeriği yükleniyor...";
  const limitedText = fullText.length > 150 ? fullText.slice(0, 150) + "..." : fullText;

  return (
    <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-center">
      {post.mainImage && (
        <div className="relative w-full sm:w-48 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title || "Post Image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 w-full flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full">
              {post.categories?.[0] || 'Dispatch'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {limitedText}
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs">
          {post.publishedAt ? (
            <span className="text-gray-400 font-medium">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          ) : <span />}
          <Link 
            href={`/posts/${post.slug?.current}`} 
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
          >
            Read Dispatch →
          </Link>
        </div>
      </div>
    </div>
  );
}