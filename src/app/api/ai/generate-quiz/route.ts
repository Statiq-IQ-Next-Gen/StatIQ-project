import { NextResponse } from "next/server";
import { db } from "@/db/store";
import { generateMcqs, validateQuestion } from "@/lib/ai/quiz";
import { canAccess, getSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !canAccess(session.role, "trainer")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const documents = db.listDocuments();
  const excerpt = documents[0]?.excerpt ?? "Official methods are the source of truth.";
  const questions = generateMcqs({
    topic: String(body.topic ?? "SQL"),
    competencyId: String(body.competencyId ?? "c-sql"),
    difficulty: body.difficulty ?? "medium",
    count: Number(body.count ?? 3),
    sourceExcerpt: excerpt,
  });
  const validated = questions.map((question) => ({
    ...question,
    validation: validateQuestion(question),
  }));
  db.addQuestions(questions);
  return NextResponse.json({ questions: validated });
}
