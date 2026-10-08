import Link from "next/link";

import { client } from '@/sanity/lib/client';

import PostCard from "@/app/components/PostCard";



async function getBooksPosts() {

  const query = `*[_type == "post"] | order(publishedAt desc) {

    title, slug, publishedAt, excerpt, body, mainImage, "categories": categories[]->title

  }`;

  const posts = await client.fetch(query);

  

  return posts.filter((post: any) => 

    post.categories && post.categories.some((cat: string) => cat && cat.toLowerCase().includes("book"))

  );

}



export default async function BooksPage() {

  const posts = await getBooksPosts();



  return (

    <div className="min-h-screen bg-white py-12">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 border-b border-gray-200 pb-6">

          <div className="flex items-center space-x-2 mb-2">

            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">Home</Link>

            <span className="text-gray-300">/</span>

            <span className="text-sm font-semibold text-indigo-600">Books</span>

          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Books Dispatches</h1>

          <p className="text-gray-600 mt-2 text-sm sm:text-base">Raw drafts, literary thoughts, and book progress updates.</p>

        </div>

        <div className="grid gap-6">

          {posts.length === 0 ? (

            <p className="text-gray-500 text-sm py-8">Bu kategoride henüz yayınlanmış bir yazı yok.</p>

          ) : (

            posts.map((post: any) => <PostCard key={post.slug?.current} post={post} />)

          )}

        </div>

      </div>

    </div>

  );

}
