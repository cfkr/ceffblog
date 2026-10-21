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
