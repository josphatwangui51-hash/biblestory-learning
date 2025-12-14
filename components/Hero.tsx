import React, { useState, useEffect } from 'react';
import { ArrowDown, Film, Loader2, Volume2 } from 'lucide-react';
import { StoryData } from '../types';
import { generateSceneVideo, generateSpeech } from '../services/geminiService';
import { playAudioContent } from '../utils/audioPlayer';

interface HeroProps {
  story: StoryData;
}

export const Hero: React.FC<HeroProps> = ({ story }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  // Reset video when story changes
  useEffect(() => {
    setVideoUrl(null);
  }, [story.id]);

  const handleVisualize = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setLoadingStep('Creating scene...');
    
    try {
      // 1. Generate Video
      const prompt = `Cinematic, photorealistic shot of ${story.titlePrefix} ${story.titleHighlight} in the bible. ${story.theme}. 4k, atmospheric lighting, slow motion movement.`;
      const generatedUrl = await generateSceneVideo(prompt);
      
      if (generatedUrl) {
        setVideoUrl(generatedUrl);
        
        // 2. Generate and Play Audio Narration
        setLoadingStep('Preparing audio...');
        const audioData = await generateSpeech(story.text);
        if (audioData) {
          await playAudioContent(audioData);
        }
      }
    } catch (e) {
      console.error("Visualization failed", e);
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  return (
    <div id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center px-4 bg-stone-900 transition-all duration-700">
      {/* Background Media Layer */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div 
            key={story.backgroundImage}
            className="absolute inset-0 opacity-40 bg-cover bg-center animate-fade-in transition-opacity duration-1000"
            style={{ backgroundImage: `url('${story.backgroundImage}')` }}
          ></div>
        )}
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-stone-900 opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center mt-16">
        <span key={`chap-${story.id}`} className="text-orange-400 font-sans tracking-[0.3em] text-sm md:text-base uppercase mb-6 animate-fade-in-up">{story.chapterRef}</span>
        <h1 key={`title-${story.id}`} className="text-5xl md:text-7xl lg:text-9xl font-display text-white mb-8 drop-shadow-2xl animate-fade-in-up">
          {story.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">{story.titleHighlight}</span>
        </h1>
        <p key={`theme-${story.id}`} className="text-xl md:text-2xl text-stone-300 font-serif italic max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in-up animation-delay-200 border-l-2 border-orange-500 pl-6">
          “{story.theme}”
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 items-center animate-fade-in-up animation-delay-300">
          <button 
            onClick={() => document.getElementById('scripture')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-3 text-white hover:text-orange-200 transition-colors duration-300 border border-white/20 hover:border-orange-500/50 hover:bg-orange-500/10 px-8 py-4 rounded-full backdrop-blur-sm"
          >
            <span className="uppercase text-xs tracking-[0.2em] font-bold font-sans">Read Story</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>

          <button 
            onClick={handleVisualize}
            disabled={isGenerating}
            className={`group flex items-center gap-3 px-8 py-4 rounded-full backdrop-blur-md transition-all duration-300 border ${isGenerating ? 'bg-orange-900/50 border-orange-500/50 text-orange-200' : 'bg-orange-600 hover:bg-orange-500 border-transparent text-white shadow-lg hover:shadow-orange-900/50'}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="uppercase text-xs tracking-[0.2em] font-bold font-sans">{loadingStep}</span>
              </>
            ) : videoUrl ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span className="uppercase text-xs tracking-[0.2em] font-bold font-sans">Replay Narration</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span className="uppercase text-xs tracking-[0.2em] font-bold font-sans">Visualize Scene</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};