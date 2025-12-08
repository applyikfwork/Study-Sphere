import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://class10thpdf.vercel.app'

const subjects = [
  { slug: 'science', name: 'Science', chapters: 15 },
  { slug: 'maths', name: 'Mathematics', chapters: 15 },
  { slug: 'sst', name: 'Social Science', chapters: 23 },
  { slug: 'english', name: 'English', chapters: 20 },
  { slug: 'hindi', name: 'Hindi', chapters: 17 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/class-10`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sample-papers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pyqs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const subjectPages: MetadataRoute.Sitemap = subjects.map((subject) => ({
    url: `${baseUrl}/class-10/${subject.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }))

  const chapterPages: MetadataRoute.Sitemap = subjects.flatMap((subject) => {
    const chapters: MetadataRoute.Sitemap = []
    for (let i = 1; i <= subject.chapters; i++) {
      chapters.push({
        url: `${baseUrl}/class-10/${subject.slug}/chapter-${i}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    }
    return chapters
  })

  return [...staticPages, ...subjectPages, ...chapterPages]
}
