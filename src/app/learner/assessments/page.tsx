import Link from "next/link";
import { db } from "@/db/store";
import { Notice } from "@/components/app-shell";
import { Activity, ArrowRight } from "lucide-react";

export default function AssessmentsIndex() {
  const assessments = db.listAssessments();
  return (
    <div className="space-y-8 animate-fade-up">
      <Notice />
      
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary-container/30 bg-secondary-container/10 font-label-caps text-label-caps text-secondary-fixed-dim">
          <Activity className="w-4 h-4 text-secondary-fixed-dim" />
          ACTIVE EVALUATIONS
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
          Adaptive Assessments
        </h1>
        <p className="max-w-2xl text-on-surface-variant text-lg">
          Scores update competency evidence with weight <strong className="text-on-surface">0.4</strong>. Role readiness is recalculated immediately after submit.
        </p>
      </header>

      <ul className="mt-8 space-y-4">
        {assessments.map((item) => (
          <li key={item.id} className="glass-panel glass-panel-interactive rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-on-surface group-hover:text-primary-container transition-colors">
                {item.title}
              </h2>
              <div className="flex items-center gap-3">
                 <span className="text-xs font-label-caps text-on-surface-variant/80 bg-surface-container-low px-2 py-1 rounded border border-white/5 uppercase">
                   {item.questionCount} Questions
                 </span>
                 <span className={`text-xs font-label-caps px-2 py-1 rounded border uppercase ${
                   item.adaptive 
                    ? "bg-secondary-container/10 border-secondary-container/30 text-secondary-fixed-dim" 
                    : "bg-surface-container border-white/10 text-on-surface-variant"
                 }`}>
                   {item.adaptive ? "Adaptive Mode" : "Fixed Mode"}
                 </span>
              </div>
            </div>
            
            <Link 
              href={`/learner/assessments/${item.id}`} 
              className="glow-button-secondary inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-label-caps text-label-caps tracking-widest font-bold whitespace-nowrap"
            >
              START TEST
              <ArrowRight className="w-4 h-4" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
