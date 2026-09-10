import { redirect } from "next/navigation";
import { Notice } from "@/components/app-shell";
import { getSession } from "@/lib/auth/session";
import { backendJson } from "@/lib/backend";

export default async function PassportPage() {
  const session = await getSession();
  if (!session?.employeeId) redirect("/login");
  
  // Call the live FRAC backend API
  const data = await backendJson<any>(`/api/competencies?employeeId=${session.employeeId}`);
  if (!data || !data.passport) {
    return <div className="p-8 text-on-surface">Failed to load competency passport from backend.</div>;
  }
  const passport = data.passport;

  return (
    <div className="space-y-8 animate-fade-up">
      <Notice />
      
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-container/30 bg-primary-container/10 font-label-caps text-label-caps text-primary-container">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
          MAPPED DOMAINS
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
          Competency Passport
        </h1>
        <p className="max-w-2xl text-on-surface-variant text-lg">
          Evidence, proficiency and trends against your baseline score.
        </p>
      </header>

      <div className="glass-panel rounded-2xl overflow-hidden mt-8">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface-container-low border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant tracking-widest">Competency</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant tracking-widest">Category</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant tracking-widest text-right">Score</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant tracking-widest">Level</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant tracking-widest">Evidence</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant tracking-widest text-right">Last assessed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {passport.map((item: any) => (
                <tr key={item.competencyId} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface">{item.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant capitalize">{item.domain?.replace(/_/g, " ")}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-on-surface text-base">{item.currentScore}</span>
                      {item.trend && item.trend !== "STABLE" && (
                        <span className={`text-xs font-label-caps px-2 py-0.5 rounded-full ${item.trend === "IMPROVING" ? "text-primary-container bg-primary-container/10" : "text-error bg-error/10"}`}>
                          {item.trend}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-label-caps border border-white/10 text-on-surface-variant">
                      {item.currentScore >= 80 ? 'ADVANCED' : item.currentScore >= 50 ? 'INTERMEDIATE' : 'BEGINNER'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant capitalize">{item.askType || 'Knowledge'}</td>
                  <td className="px-6 py-4 text-right text-on-surface-variant text-xs font-label-caps">
                    {item.lastAssessedAt ? new Date(item.lastAssessedAt).toISOString().slice(0, 10) : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
