import Link from "next/link";
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

async function getPostsByCategory(categorySlug: string) {
  // Tüm postları çekiyoruz, filtrelemeyi hata vermemesi için güvenli şekilde JS tarafında yapıyoruz
  const query = `*[_type == "post"] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    mainImage,
    "categories": categories[]->title
  }`;
  
  const posts = await client.fetch(query);

  // URL'den gelen slug'ı kategori adına çevirip eşleştiriyoruz (Örn: "book-and-thoughts" -> "book")
  const searchKeyword = categorySlug.replace(/-/g, ' ').toLowerCase();

  return posts.filter((post: any) => {
    if (!post.categories || !Array.isArray(post.categories)) return false;
    
    return post.categories.some((cat: string) => {
      if (!cat) return false;
      const catLower = cat.toLowerCase();
      
      // Eğer aranan kelime "book" içeriyorsa kategori adında da "book" arar
      if (searchKeyword.includes('book') && catLower.includes('book')) return true;
      
      // Diğer kategoriler için birebir veya kapsayan eşleşme bakar
      return catLower.includes(searchKeyword) || searchKeyword.includes(catLower);
    });
  });
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const posts = await getPostsByCategory(slug);

  // Başlığı tam istediğin gibi net ayarlıyoruz
  let categoryTitle = 'Books & Thoughts';
  if (slug && !slug.toLowerCase().includes('book')) {
    categoryTitle = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Kategori Başlık Alanı */}
        <div className="mb-8 pb-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Category Dispatch</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              {categoryTitle}
            </h1>
          </div>
          <Link href="/" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Yazı Listesi */}
        <div className="grid gap-4 sm:gap-6">
          {posts.length === 0 ? (
            <div className="text-center py-16 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="text-4xl mb-3">📭</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Dispatches Yet</h3>
              <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
                New entries for this category will appear here once published from the Sanity studio.
              </p>
              <Link href="/" className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-full shadow-md">
                Return to Home
              </Link>
            </div>
          ) : (
            posts.map((post: any) => {
              const fullText = post.excerpt || extractTestFromBlocks(post.body) || ""; // Güvenli metin çekme
              const limitedText = fullText.length > 130 ? fullText.slice(0, 130) + "..." : fullText;

              return (
                <div key={post.slug?.current} className="p-4 sm:p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                  
                  {post.mainImage && (
                    <div className="relative w-full sm:w-48 h-48 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={urlFor(post.mainImage).url()}
                        alt={post.title || "Post Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 w-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                        {limitedText}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs">
                      <span className="text-gray-400 font-medium">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </span>
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

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 py-6 text-center text-xs text-gray-500 mt-auto">
        <p>© {new Date().getFullYear()} Warrior's Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}
