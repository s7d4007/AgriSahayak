import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, TrendingUp, CloudRain, ShieldCheck, ArrowRight, Smartphone, Github } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-200 selection:text-primary-900 overflow-x-hidden">
      {/* ─── NAVBAR ─────────────────────────────────────── */}
      <nav className="absolute top-0 w-full z-50 py-6 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AgriSahayak Logo" className="w-10 h-10 rounded-full shadow-md" />
          <span className="text-xl font-bold text-slate-800 tracking-tight">AgriSahayak</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/s7d4007/AgriSahayak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-800 transition-colors hidden sm:flex items-center gap-2 font-medium"
          >
            <Github className="w-5 h-5" />
            <span>Open Source</span>
          </a>
          <Link
            to="/app"
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Decorative background blobs */}
        <div className="absolute top-0 -left-64 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-64 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="flex-1 text-center lg:text-left z-10">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
            Farm Smart, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">
              Earn More.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Empower your farming with AI-driven plant disease detection, instant real-time market prices, and hyper-local crop advisory. Built for the modern farmer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/app"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Start Farming
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-full font-bold text-lg shadow-md transition-all hover:-translate-y-1 flex items-center justify-center"
            >
              Explore Features
            </a>
          </div>
          
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-3 text-sm font-medium text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>100% Free. No Sign-up required.</span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 perspective-1000">
          {/* A stylistic abstract farm/phone illustration placeholder using Tailwind */}
          <div className="w-full aspect-square relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 transform lg:rotate-y-[-10deg] transition-transform duration-700 hover:rotate-y-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-emerald-400 to-teal-500 opacity-90 mix-blend-overlay"></div>
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" 
              alt="Lush green farm field" 
              className="w-full h-full object-cover"
            />
            
            {/* Floating UI Elements */}
            <div className="absolute top-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl transform -rotate-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Wheat Market</p>
                  <p className="text-2xl font-black text-slate-800">₹2,150 <span className="text-sm font-medium text-emerald-500">↑ 12%</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-16 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl transform rotate-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <Camera className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Rust Disease Detected</p>
                  <p className="text-xs text-slate-500 mt-1">Apply sulfur-based fungicides within 2 days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ──────────────────────────────── */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Tools built for the field.</h2>
            <p className="text-lg text-slate-600">Complex agricultural data translated into simple, actionable insights that you can use daily.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Camera className="w-7 h-7 text-white" />}
              color="bg-orange-500"
              title="AI Disease Detector"
              description="Snap a picture of a sick plant. Our Hugging Face AI instantly identifies the disease and provides exact treatment procedures."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-7 h-7 text-white" />}
              color="bg-emerald-500"
              title="Real-time Mandi Prices"
              description="Track daily market prices across different commodities and markets so you always know what your yield is worth."
            />
            <FeatureCard 
              icon={<CloudRain className="w-7 h-7 text-white" />}
              color="bg-sky-500"
              title="Weather & Advisory"
              description="Hyper-local weather forecasts tied with agronomic advice on when to sow, irrigate, or protect your crops."
            />
            <FeatureCard 
              icon={<Smartphone className="w-7 h-7 text-white" />}
              color="bg-purple-500"
              title="Works Offline"
              description="Your planner tasks and basic knowledge base are cached securely on your phone. Perfect for low-network farm zones."
            />
            <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 custom-shadow relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 w-full sm:w-2/3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-4 h-4" /> User Privacy First
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Accounts. Complete Anonymity.</h3>
                <p className="text-slate-400">Unlike other ag-tech platforms, we do not lock you in with an account. Your farm plans and data are stored strictly on your local device. We never harvest your data.</p>
              </div>
              <div className="relative z-10 w-full sm:w-1/3 flex justify-start sm:justify-end">
                <Link to="/app" className="bg-primary-500 hover:bg-primary-400 text-slate-900 px-6 py-3 rounded-full font-bold transition-colors w-full sm:w-auto text-center">
                  Try it out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ─────────────────────────────────── */}
      <footer className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="AgriSahayak" className="w-8 h-8 rounded-full grayscale opacity-80" />
            <span className="text-lg font-bold text-slate-700">AgriSahayak</span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} AgriSahayak. Open access technology for agriculture.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://github.com/s7d4007/AgriSahayak" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, color, title, description }: { icon: React.ReactNode, color: string, title: string, description: string }) => (
  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-inner`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
