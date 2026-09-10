"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayCircle, CheckCircle2, ChevronLeft, Award, Play } from "lucide-react";
import type { Course } from "@/types/domain";

export function CoursePlayer({ course }: { course: Course }) {
  // Mock modules based on duration
  const modules = [
    { id: "m1", title: "Introduction to " + course.title, duration: "10:00" },
    { id: "m2", title: "Core Concepts and Fundamentals", duration: "45:30" },
    { id: "m3", title: "Advanced Techniques", duration: "1:20:00" },
    { id: "m4", title: "Practical Application & Case Study", duration: "55:15" },
    { id: "m5", title: "Summary and Next Steps", duration: "15:00" },
  ];

  const [activeModuleId, setActiveModuleId] = useState(modules[0].id);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeModule = modules.find(m => m.id === activeModuleId)!;
  const isComplete = completedModules.includes(activeModuleId);
  const courseComplete = completedModules.length === modules.length;

  const toggleComplete = () => {
    if (isComplete) {
      setCompletedModules(prev => prev.filter(id => id !== activeModuleId));
    } else {
      setCompletedModules(prev => [...prev, activeModuleId]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[calc(100vh-12rem)] min-h-[600px]">
      
      {/* Video Player Area */}
      <div className="flex-1 flex flex-col gap-6">
        <Link href={`/learner/courses/${course.id}`} className="inline-flex items-center gap-2 text-sm font-label-caps text-on-surface-variant hover:text-primary-container transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" />
          BACK TO COURSE DETAILS
        </Link>
        
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col flex-1 border-t-[3px] border-t-primary-container shadow-2xl relative">
          
          {/* Mock Video Container */}
          <div className="bg-black aspect-video relative flex items-center justify-center group overflow-hidden">
            {/* Fake video background */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            {courseComplete ? (
              <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
                <Award className="w-24 h-24 text-primary-container mb-4" />
                <h2 className="font-display text-3xl font-bold text-white mb-2">Course Completed!</h2>
                <p className="text-on-surface-variant">You have finished all modules.</p>
                <Link href="/learner/achievements" className="mt-6 glow-button px-8 py-3 rounded-full font-label-caps tracking-widest text-sm font-bold">
                  VIEW CERTIFICATE
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`relative z-10 w-20 h-20 rounded-full bg-primary-container/20 border-2 border-primary-container flex items-center justify-center text-primary-container backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary-container hover:text-black shadow-[0_0_30px_rgba(57,255,20,0.3)] ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
              >
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </button>
            )}

            {/* Fake progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
              <div className={`h-full bg-primary-container ${isPlaying ? 'w-1/3 transition-all duration-[10000ms] ease-linear' : 'w-0'}`} />
            </div>
          </div>

          {/* Module Info & Controls */}
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-surface-container-lowest">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 rounded bg-surface-container border border-white/5 text-[10px] font-label-caps text-on-surface-variant tracking-wider">
                  MODULE {modules.findIndex(m => m.id === activeModuleId) + 1} OF {modules.length}
                </span>
                <span className="text-sm text-on-surface-variant">{activeModule.duration}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface">{activeModule.title}</h2>
              <p className="mt-4 text-on-surface-variant leading-relaxed">
                In this module, we will explore the fundamental concepts outlined in the {course.provider.toUpperCase()} curriculum. 
                Pay close attention to the practical examples provided, as they will be crucial for the final assessment.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={toggleComplete}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-label-caps tracking-widest text-sm font-bold transition-all border ${
                  isComplete 
                  ? 'bg-primary-container/10 border-primary-container/30 text-primary-container' 
                  : 'glow-button-secondary'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${isComplete ? 'fill-primary-container/20' : ''}`} />
                {isComplete ? 'COMPLETED' : 'MARK AS COMPLETE'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Playlist */}
      <div className="lg:w-96 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col h-full overflow-hidden border border-white/5">
          <div className="mb-6">
            <h3 className="font-display text-xl font-bold text-on-surface line-clamp-1">{course.title}</h3>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-container/60 to-primary-container transition-all duration-500"
                  style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-label-caps text-on-surface-variant">
                {Math.round((completedModules.length / modules.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {modules.map((mod, i) => {
              const isActive = mod.id === activeModuleId;
              const isDone = completedModules.includes(mod.id);
              
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModuleId(mod.id);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all flex gap-4 ${
                    isActive 
                      ? 'bg-primary-container/10 border border-primary-container/30 shadow-[0_0_15px_rgba(57,255,20,0.05)]' 
                      : 'hover:bg-surface-container border border-transparent'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-primary-container" />
                    ) : (
                      <PlayCircle className={`w-5 h-5 ${isActive ? 'text-primary-container' : 'text-on-surface-variant'}`} />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium text-sm leading-snug mb-1 ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                      {i + 1}. {mod.title}
                    </p>
                    <p className="text-xs text-on-surface-variant/70">{mod.duration}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
