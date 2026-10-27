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

    return { success: true, data: mapped, live: true };
  } catch (error) {
    console.error('[newsService] Error fetching news:', error);
    return { success: false, data: [], live: false, error: 'Live news is currently unavailable.' };
  }
};
