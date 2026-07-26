import {
  blogPostMetadata,
  BlogPostRoute,
  generatePostStaticParams,
} from '../../../_views/blog-post-page'

// Closed publish set: only allowlisted slugs from generateStaticParams.
// Unknown paths 404 without streaming a blog loading shell first.
export const dynamicParams = false

export const generateStaticParams = generatePostStaticParams

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return blogPostMetadata('en', (await params).slug)
}

export default function EnglishBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <BlogPostRoute params={params} locale="en" />
}
