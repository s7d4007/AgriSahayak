import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Mic, MicOff, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type SpeechRecognitionResultItem = {
  transcript?: string;
};

type SpeechRecognitionResultLike = ArrayLike<SpeechRecognitionResultItem>;
type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
};

const navCommands = [
  {
    path: '/app',
    aliases: ['home', 'main page', 'dashboard', 'start page', 'होम', 'मुख्य पेज', 'मुख्यपेज', 'मुख्य पृष्ठ', 'मुख्यपृष्ठ'],
  },
  {
    path: '/app/crop-advisory',
    aliases: ['crop advisory', 'crop recommendation', 'advisory', 'फसल सलाह', 'फसल की सलाह', 'कृषि सलाह', 'सलाह', 'कृषि परामर्श'],
  },
  {
    path: '/app/prices',
    aliases: ['prices', 'price dashboard', 'market prices', 'mandi prices', 'कीमत', 'मंडी कीमत', 'बाजार कीमत', 'कीमत की जानकारी', 'मंडी दर'],
  },
  {
    path: '/app/price-calculator',
    aliases: ['price calculator', 'calculate price', 'price estimate', 'कीमत कैलकुलेटर', 'कीमत kalkulator', 'कीमत निकालें'],
  },
  {
    path: '/app/disease-detector',
    aliases: ['disease detector', 'plant disease', 'detect disease', 'disease check', 'रोग पहचान', 'रोग पता करें', 'पौधे का रोग', 'रोग देखें'],
  },
  {
    path: '/app/farm-planner',
    aliases: ['farm planner', 'crop planner', 'planning', 'कृषि योजना', 'खेती योजना', 'फार्म प्लानर', 'योजना'],
  },
  {
    path: '/app/news',
    aliases: ['news', 'weather news', 'agri news', 'alerts', 'समाचार', 'समाचार और सूचना', 'अलर्ट', 'मौसम समाचार', 'खबर'],
  },
  {
    path: '/app/settings',
    aliases: ['settings', 'preferences', 'language settings', 'सेटिंग', 'सेटिंग्स', 'पसंद', 'भाषा'],
  },
];

const getSpeechRecognitionConstructor = () => {
  const browserWindow = window as Window & {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  };

  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Tap the mic to use voice commands');
  const location = useLocation();
  const navigate = useNavigate();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const navItems = [
    { path: '/app', label: t('nav.home') },
    { path: '/app/crop-advisory', label: t('nav.cropAdvisory') },
    { path: '/app/prices', label: t('nav.priceInfo') },
    { path: '/app/price-calculator', label: t('nav.priceCalculator') },
    { path: '/app/disease-detector', label: t('nav.diseaseDetector') },
    { path: '/app/farm-planner', label: t('nav.farmPlanner') },
    { path: '/app/news', label: t('nav.news') },
    { path: '/app/settings', label: t('nav.settings') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleVoiceCommand = (rawText: string) => {
    const normalizedText = rawText.toLowerCase().trim();
    const resolvedCommand = navCommands.find(({ aliases }) =>
      aliases.some((alias) => normalizedText.includes(alias))
    );

    if (resolvedCommand) {
      navigate(resolvedCommand.path);
      setVoiceStatus(`Opening ${resolvedCommand.path === '/' ? 'Home' : resolvedCommand.path.replace('/', '').replace('-', ' ')}`);
      setIsListening(false);
      return;
    }

    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    const dictationCommand = normalizedText.match(/^(write|type|enter|fill|say|set)\s+(.*)$/i);

    if (dictationCommand && activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      const value = dictationCommand[2].trim();
      if (value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;

        if (nativeInputValueSetter && activeElement.tagName === 'INPUT') {
          nativeInputValueSetter.call(activeElement, value);
        } else if (nativeTextAreaValueSetter && activeElement.tagName === 'TEXTAREA') {
          nativeTextAreaValueSetter.call(activeElement, value);
        } else {
          activeElement.value = value;
        }

        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.dispatchEvent(new Event('change', { bubbles: true }));
        activeElement.focus();
        setVoiceStatus(`Inserted: ${value}`);
        setIsListening(false);
        return;
      }
    }

    const openMatch = normalizedText.match(/\b(open|go to|navigate to|show)\s+(.*)$/i);
    if (openMatch) {
      const possiblePath = openMatch[2].trim();
      const fallback = navCommands.find(({ aliases }) => aliases.some((alias) => possiblePath.includes(alias)));
      if (fallback) {
        navigate(fallback.path);
        setVoiceStatus(`Opening ${fallback.path === '/' ? 'Home' : fallback.path.replace('/', '').replace('-', ' ')}`);
        setIsListening(false);
        return;
      }
    }

    setVoiceStatus(`I heard: “${rawText}”. Try saying “open farm planner” or “write rice”.`);
    setIsListening(false);
  };

  const startVoiceAssistant = () => {
    const isSecureOrigin = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();

    if (!isSecureOrigin) {
      setVoiceStatus('Voice input needs a secure browser connection. Use localhost or HTTPS.');
      return;
    }

    if (!SpeechRecognitionConstructor) {
      setVoiceStatus('Voice recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }

    const recognition = new SpeechRecognitionConstructor();
    
    // Choose primary language based on user's current setting
    const lang = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('Listening... say a page name or a short sentence.');
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const latestTranscript = Array.from(event.results as ArrayLike<SpeechRecognitionResultLike>)
        .map((result) => (result[0] as SpeechRecognitionResultItem | undefined)?.transcript ?? '')
        .join(' ')
        .trim();

      if (latestTranscript) {
        setVoiceStatus(`Heard: “${latestTranscript}”`);
        handleVoiceCommand(latestTranscript);
      }
    };

    recognition.onerror = (event: Event & { error?: string }) => {
      const error = event.error ?? 'unknown';
      setIsListening(false);

      if (error === 'not-allowed' || error === 'service-not-allowed') {
        setVoiceStatus('Microphone permission blocked. Please allow mic access and try again.');
        return;
      }
      
      if (error === 'no-speech') {
        setVoiceStatus('No speech detected. Tap mic to try again.');
        return;
      }

      if (error === 'network') {
        setVoiceStatus('Voice service unavailable (Offline/Network error). Try Chrome/Edge.');
        return;
      }

      setVoiceStatus(`Voice input error: ${error}. Please try again.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceStatus('Could not start voice service. Please refresh and try again.');
    }
  };

  const stopVoiceAssistant = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setVoiceStatus('Voice assistant stopped.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-accent-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-primary-600">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 md:py-2">
            {/* Logo */}
            <Link to="/app" className="flex items-center gap-2 group shrink-0">
              <div className="p-0">
                <img
                  src="/logo.png"
                  alt="AgriSahayak"
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/fallback-logo.png';
                  }}
                />
              </div>
              <div className="hidden sm:block leading-tight">
                <h1 className="text-xl font-bold text-primary-700">AgriSahayak</h1>
                <p className="text-xs text-secondary-600">Farm Smart, Earn More</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-4 xl:gap-6 overflow-x-auto px-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`shrink-0 text-sm xl:text-base font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive(item.path)
                      ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                      : 'text-accent-600 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Language and Mobile Menu */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={isListening ? stopVoiceAssistant : startVoiceAssistant}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  isListening ? 'bg-red-100 text-red-700 ring-2 ring-red-200' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
                aria-label="Toggle voice assistant"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">Voice</span>
              </button>

              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                    i18n.language === 'en'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('hi')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                    i18n.language === 'hi'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                  }`}
                >
                  हि
                </button>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-accent-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-accent-100 bg-accent-50/80 px-4 py-2 text-center text-xs text-accent-700">
          <span className={`inline-flex items-center gap-2 ${isListening ? 'text-red-700' : 'text-accent-700'}`}>
            <span className={`h-2 w-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
            {voiceStatus}
          </span>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-accent-200 bg-white">
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-accent-600 hover:bg-accent-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-4 px-4">
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                    i18n.language === 'en'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-700'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    changeLanguage('hi');
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                    i18n.language === 'hi'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-700'
                  }`}
                >
                  हि
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="AgriSahayak" className="w-8 h-8 rounded-full" />
                <h3 className="font-bold text-lg">AgriSahayak</h3>
              </div>
              <p className="text-sm text-gray-300">{t('footer.description')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.features')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/crop-advisory" className="hover:text-primary-400">{t('nav.cropAdvisory')}</a></li>
                <li><a href="/prices" className="hover:text-primary-400">{t('nav.priceInfo')}</a></li>
                <li><a href="/disease-detector" className="hover:text-primary-400">{t('nav.diseaseDetector')}</a></li>
                <li><a href="/farm-planner" className="hover:text-primary-400">{t('nav.farmPlanner')}</a></li>
                <li><a href="/news" className="hover:text-primary-400">{t('nav.news')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/privacy" className="hover:text-primary-400">{t('footer.privacyPolicy')}</a></li>
                <li><a href="/terms" className="hover:text-primary-400">{t('footer.termsOfService')}</a></li>
                <li><a href="mailto:support@agrisahayak.com" className="hover:text-primary-400">{t('footer.contact')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} AgriSahayak. {t('footer.copyright')} | {t('footer.madeWith')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
