import React, { useEffect, useState } from 'react';
import { Heart, Mail, MessageCircle, BookOpen, Menu, X, Sparkles, BrainCircuit } from 'lucide-react';
import { Hero } from './components/Hero';
import { ScriptureView } from './components/ScriptureView';
import { AICompanion } from './components/AICompanion';
import { BibleQuiz } from './components/BibleQuiz';
import { NotesWidget } from './components/NotesWidget';
import { NotesProvider } from './contexts/NotesContext';
import { notifyVisit } from './services/notificationService';
import { stories } from './data/stories';

const App: React.FC = () => {
  // Hardcoded to Moses for the dedicated website experience
  const currentStory = stories[0];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    notifyVisit();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLink = ({ target, label, icon: Icon }: { target: string, label: string, icon?: any }) => (
    <button 
      onClick={() => scrollToSection(target)}
      className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:text-orange-500 transition-colors"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );

  return (
    <NotesProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-200 selection:text-orange-900">
        
        {/* Website Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-stone-900/90 backdrop-blur-md py-4 border-b border-stone-800' : 'bg-transparent py-6'}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="font-display font-bold text-lg tracking-widest text-orange-500">Josphat</span>
              <span className="font-serif italic text-stone-400">Analysis</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink target="scripture" label="The Word" icon={BookOpen} />
              <NavLink target="study" label="Insight" icon={Sparkles} />
              <NavLink target="quiz" label="Quiz" icon={BrainCircuit} />
              <a href="#support" className="px-5 py-2 rounded-full border border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                Support
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-stone-900 border-t border-stone-800 p-6 flex flex-col gap-6 text-white shadow-2xl animate-fade-in">
              <NavLink target="scripture" label="The Word" icon={BookOpen} />
              <NavLink target="study" label="AI Insight" icon={Sparkles} />
              <NavLink target="quiz" label="Quiz" icon={BrainCircuit} />
            </div>
          )}
        </nav>

        <Hero story={currentStory} />
        
        <ScriptureView story={currentStory} />
        
        <AICompanion story={currentStory} />
        
        <BibleQuiz story={currentStory} />

        <NotesWidget />
        
        <section id="support" className="bg-white py-24 px-4 border-t border-stone-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-50 p-4 rounded-full ring-1 ring-orange-100">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h3 className="font-display text-3xl text-stone-800 mb-4">Support the Mission</h3>
            <p className="text-stone-600 mb-10 font-serif italic text-xl leading-relaxed">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
              <span className="block text-sm text-stone-400 mt-3 not-italic font-sans tracking-wide">— 2 Corinthians 9:7</span>
            </p>
            
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 inline-flex flex-col items-center w-full md:w-auto hover:shadow-lg transition-shadow duration-300">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">M-PESA Contribution</p>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="px-4 py-2 bg-green-600 rounded-lg text-white font-bold tracking-wider shadow-sm text-sm">
                  SEND TO
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-3xl font-bold text-stone-800 tracking-wide">0796 335 209</span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider text-center md:text-left">Josphat Wangui</span>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-stone-100">
               <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-6">Get in Touch</p>
               <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                  <a href="mailto:josphatwangui51@gmail.com" className="flex items-center gap-3 px-6 py-3 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all text-stone-600 group">
                    <Mail className="w-4 h-4 text-stone-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-sm font-medium">josphatwangui51@gmail.com</span>
                  </a>
                   <a href="https://wa.me/254796335209" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all text-stone-600 group">
                    <MessageCircle className="w-4 h-4 text-stone-400 group-hover:text-green-600 transition-colors" />
                    <span className="text-sm font-medium">WhatsApp Chat</span>
                  </a>
               </div>
            </div>
          </div>
        </section>

        <footer className="bg-stone-900 text-stone-400 py-12 px-6 border-t border-stone-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-white font-display text-lg tracking-wide mb-1">Josphat Bible Analysis</h3>
              <p className="text-sm opacity-50">Illuminating Scripture through Technology</p>
            </div>
            
            <div className="text-xs text-stone-600 font-medium tracking-wide">
               © {new Date().getFullYear()} All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>
    </NotesProvider>
  );
};

export default App;