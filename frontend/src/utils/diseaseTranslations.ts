import type { DiseaseInfo } from './diseaseMapping';

type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'gu' | 'as' | 'or' | 'pa';

const diseaseNames: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  'apple-black-rot': {
    hi: 'सेब का काला सड़न रोग',
    mr: 'सफरचंदाचा काळा कुज रोग',
    bn: 'আপেলের কালো পচা রোগ',
    gu: 'સફરજનનો કાળો સડો',
    as: 'আপেলৰ কʼলা পচা ৰোগ',
    or: 'ସେଓର କଳା ପଚା ରୋଗ',
    pa: 'ਸੇਬ ਦਾ ਕਾਲਾ ਸੜਨ ਰੋਗ',
  },
  'apple-scab': {
    hi: 'सेब का झुलसा रोग',
    mr: 'सफरचंदाचा खरूज रोग',
    bn: 'আপেলের স্ক্যাব রোগ',
    gu: 'સફરજનનો સ્કેબ રોગ',
    as: 'আপেলৰ স্কেব ৰোগ',
    or: 'ସେଓର ସ୍କାବ ରୋଗ',
    pa: 'ਸੇਬ ਦਾ ਸਕੈਬ ਰੋਗ',
  },
  'powdery-mildew': {
    hi: 'चूर्णिल आसिता',
    mr: 'भुरी रोग',
    bn: 'পাউডারি মিলডিউ',
    gu: 'ભૂકી છારો',
    as: 'পাউডাৰী মিলডিউ',
    or: 'ପାଉଡରୀ ମିଲଡିଉ',
    pa: 'ਚੂਰਨੀ ਫ਼ਫ਼ੂੰਦੀ',
  },
  'rust-disease': {
    hi: 'रतुआ रोग',
    mr: 'तांबेरा रोग',
    bn: 'মরিচা রোগ',
    gu: 'રસ્ટ રોગ',
    as: 'মৰিছা ৰোগ',
    or: 'କଳଙ୍କ ରୋଗ',
    pa: 'ਕੰਗਾਲੀ ਰੋਗ',
  },
  'blight-disease': {
    hi: 'झुलसा रोग',
    mr: 'करपा रोग',
    bn: 'ব্লাইট রোগ',
    gu: 'બ્લાઈટ રોગ',
    as: 'ব্লাইট ৰোগ',
    or: 'ବ୍ଲାଇଟ୍ ରୋଗ',
    pa: 'ਝੁਲਸਾ ਰੋਗ',
  },
  anthracnose: {
    hi: 'एन्थ्रेक्नोज',
    mr: 'अँथ्रॅक्नोज',
    bn: 'অ্যানথ্রাকনোজ',
    gu: 'એન્થ્રેકનોઝ',
    as: 'এন্থ্ৰাকনোজ',
    or: 'ଆନ୍ଥ୍ରାକ୍ନୋଜ୍',
    pa: 'ਐਂਥ੍ਰੈਕਨੋਜ਼',
  },
  healthy: {
    hi: 'स्वस्थ पौधा',
    mr: 'निरोगी पीक',
    bn: 'সুস্থ গাছ',
    gu: 'તંદુરસ્ત છોડ',
    as: 'সুস্থ উদ্ভিদ',
    or: 'ସୁସ୍ଥ ଗଛ',
    pa: 'ਸਿਹਤਮੰਦ ਪੌਦਾ',
  },
  unknown: {
    hi: 'पहचान नहीं हो सकी',
    mr: 'ओळख पटली नाही',
    bn: 'শনাক্ত করা যায়নি',
    gu: 'ઓળખી શકાયું નથી',
    as: 'চিনাক্ত কৰিব পৰা নগʼল',
    or: 'ଚିହ୍ନଟ କରାଯାଇପାରିଲା ନାହିଁ',
    pa: 'ਪਛਾਣ ਨਹੀਂ ਹੋ ਸਕੀ',
  },
};

export const getLocalizedDisease = (
  disease: DiseaseInfo,
  language: string
): DiseaseInfo => {
  const supportedLanguage = (language.split('-')[0] as SupportedLanguage) || 'en';
  return {
    ...disease,
    name: diseaseNames[disease.id]?.[supportedLanguage] || disease.name,
  };
};
