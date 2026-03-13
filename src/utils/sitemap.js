import { queryDocuments, COLLECTIONS } from '../services/firebase/firestore';
import { where } from 'firebase/firestore';

// Generate XML sitemap
export const generateSitemap = async () => {
  try {
    const baseUrl = 'https://applefamtv.com';
    const currentDate = new Date().toISOString();
    
    // Static pages
    const staticPages = [
      { url: '', changefreq: 'daily', priority: '1.0' },
      { url: '/international-news', changefreq: 'daily', priority: '0.9' },
      { url: '/business-news', changefreq: 'daily', priority: '0.9' },
      { url: '/regional-news', changefreq: 'daily', priority: '0.9' },
      { url: '/opportunities', changefreq: 'daily', priority: '0.8' },
      { url: '/events', changefreq: 'daily', priority: '0.8' },
      { url: '/about-us', changefreq: 'monthly', priority: '0.6' },
      { url: '/submit-story', changefreq: 'monthly', priority: '0.7' },
    ];

    // Fetch dynamic content
    const [articles, events, opportunities] = await Promise.all([
      queryDocuments(COLLECTIONS.ARTICLES, [where('status', '==', 'active')]),
      queryDocuments(COLLECTIONS.EVENTS, [where('status', '==', 'active')]),
      queryDocuments(COLLECTIONS.OPPORTUNITIES, [where('status', '==', 'active')])
    ]);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add articles
    articles.forEach(article => {
      const lastmod = article.updatedAt || article.createdAt;
      const date = lastmod?.seconds ? new Date(lastmod.seconds * 1000).toISOString() : currentDate;
      
      sitemap += `
  <url>
    <loc>${baseUrl}/article/${article.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add events
    events.forEach(event => {
      const lastmod = event.updatedAt || event.createdAt;
      const date = lastmod?.seconds ? new Date(lastmod.seconds * 1000).toISOString() : currentDate;
      
      sitemap += `
  <url>
    <loc>${baseUrl}/event/${event.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add opportunities
    opportunities.forEach(opportunity => {
      const lastmod = opportunity.updatedAt || opportunity.createdAt;
      const date = lastmod?.seconds ? new Date(lastmod.seconds * 1000).toISOString() : currentDate;
      
      sitemap += `
  <url>
    <loc>${baseUrl}/opportunity/${opportunity.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return null;
  }
};

// Generate robots.txt
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/

# Sitemap
Sitemap: https://applefamtv.com/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
};

// Generate RSS feed
export const generateRSSFeed = async () => {
  try {
    const baseUrl = 'https://applefamtv.com';
    const currentDate = new Date().toUTCString();
    
    // Fetch latest articles
    const articles = await queryDocuments(COLLECTIONS.ARTICLES, [
      where('status', '==', 'active')
    ]);
    
    // Sort by creation date and take latest 20
    const latestArticles = articles
      .sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      })
      .slice(0, 20);

    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Apple Fam TV - Cameroon News &amp; Stories</title>
    <link>${baseUrl}</link>
    <description>Your trusted digital media platform for Cameroon news, international updates, job opportunities, events, and community stories.</description>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/assets/apple-tv-logo.png</url>
      <title>Apple Fam TV</title>
      <link>${baseUrl}</link>
    </image>`;

    latestArticles.forEach(article => {
      const pubDate = article.createdAt?.seconds 
        ? new Date(article.createdAt.seconds * 1000).toUTCString()
        : currentDate;
      
      const description = article.excerpt || (article.content ? article.content.substring(0, 200) + '...' : '');
      
      rss += `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/article/${article.id}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${baseUrl}/article/${article.id}</guid>
      <category>${article.category}</category>
      ${article.author ? `<author>${article.author}</author>` : ''}
      ${article.imageUrl ? `<enclosure url="${article.imageUrl}" type="image/jpeg" />` : ''}
    </item>`;
    });

    rss += `
  </channel>
</rss>`;

    return rss;
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return null;
  }
};