import axios from 'axios';

const RSS_URL =
  process.env.NEWS_RSS_URL ||
  'https://news.google.com/rss/search?q=agriculture+india&hl=en-IN&gl=IN&ceid=IN:en';

interface RssItem {
  title?: string;
  link?: string;
  description?: string;
  content?: string;
  guid?: string;
  pubDate?: string;
  author?: string;
  source?: string;
}

const stripHtml = (value = '') =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const classifyCategory = (title: string, description: string): string => {
  const text = `${title} ${description}`.toLowerCase();
  if (/(weather|rain|storm|heat|drought|temperature|cyclone|monsoon|flood)/i.test(text))
    return 'weather';
  if (/(scheme|subsidy|government|kisan|pm|loan|support|benefit|policy)/i.test(text))
    return 'scheme';
  return 'market';
};

const FALLBACK_NEWS = [
  { id: 'news-1', category: 'scheme', title: 'PM Kisan Yojana Beneficiaries Increased', description: 'Government increases support for small farmers under PM Kisan scheme', date: new Date().toISOString(), source: 'Agricultural Ministry', type: 'info', articleUrl: 'https://pmkisan.gov.in' },
  { id: 'news-2', category: 'weather', title: 'Monsoon Season Update', description: 'IMD issues seasonal forecast for agricultural regions', date: new Date().toISOString(), source: 'IMD', type: 'warning', articleUrl: 'https://mausam.imd.gov.in' },
  { id: 'news-3', category: 'market', title: 'Rice Prices at FCI Procurement', description: 'Food Corporation of India updates rice procurement MSP', date: new Date().toISOString(), source: 'FCI', type: 'info', articleUrl: 'https://fci.gov.in' },
];

export const fetchAgriculturalNews = async () => {
  try {
    const response = await axios.get<{ items?: RssItem[] }>(
      'https://api.rss2json.com/v1/api.json',
      { params: { rss_url: RSS_URL }, timeout: 15000 }
    );

    const items: RssItem[] = response.data?.items ?? [];
    const mapped = items
      .filter((item) => item?.title && item?.link)
      .slice(0, 12)
      .map((item, index) => {
        const title = stripHtml(item.title);
        const description = stripHtml(item.description || item.content || '');
        return {
          id: item.guid || item.link || `news-${index}`,
          category: classifyCategory(title, description),
          title,
          description: description || 'Read the full article for more details.',
          date: item.pubDate || new Date().toISOString(),
          source: item.author || item.source || 'Live News Feed',
          type: index === 0 ? 'alert' : index === 1 ? 'warning' : 'info',
          articleUrl: item.link,
        };
      });

    return { success: true, data: mapped.length > 0 ? mapped : FALLBACK_NEWS };
  } catch (error) {
    console.error('[newsService] Error fetching news:', error);
    return { success: true, data: FALLBACK_NEWS };
  }
};
