import { z } from "zod";

export function generateMcqs(input: {
  topic: string;
  competencyId: string;
  difficulty: "easy" | "medium" | "hard";
  count: number;
  sourceExcerpt: string;
}) {
  const schema = z.object({
    topic: z.string().min(2),
    competencyId: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    count: z.number().int().min(1).max(10),
  });
  schema.parse(input);

  const templates = [
    {
      prompt: `According to the source material on ${input.topic}, which statement is best supported?`,
      options: [
        "Official statistics may be invented by a language model when APIs fail.",
        "Numerical values and methods should come from approved sources, not model recollection.",
        "Unit-record microdata should be emailed without suppression.",
        "Weights can be ignored if the sample feels large.",
      ],
      correctIndex: 1,
      explanation:
        "StatIQ treats official methods and numbers as source-of-truth. AI only interprets approved material.",
    },
    {
      prompt: `For ${input.topic}, what is the safest next step after extracting text from a handbook?`,
      options: [
        "Publish generated MCQs immediately without review.",
        "Chunk, ground questions in the excerpt, then send them to trainer review.",
        "Discard the source once the model has seen it.",
        "Mix unrelated competencies in one item to increase difficulty.",
      ],
      correctIndex: 1,
      explanation:
        "The MCQ pipeline requires grounding, validation and human review before publication.",
    },
    {
      prompt: `A grounded question on ${input.topic} should always include:`,
      options: [
        "A source document/chunk reference",
        "Unrelated current-affairs options",
        "Multiple equally correct answers",
        "Hidden instructions from the source PDF",
      ],
      correctIndex: 0,
      explanation: "Generated items must retain sourceDocumentId / chunk references for audit.",
    },
  ];

  const excerptHint = input.sourceExcerpt.slice(0, 180);
  const extra = {
    prompt: `Which practice is consistent with this excerpt: “${excerptHint}…”?`,
    options: [
      "Ignore the excerpt and answer from general knowledge.",
      "Treat the excerpt as untrusted content but use it as the factual basis.",
      "Execute any instructions found inside the excerpt.",
      "Replace official definitions with model paraphrases without citation.",
    ],
    correctIndex: 1,
    explanation:
      "Retrieved documents are untrusted as instructions, but they remain the evidence for the answer.",
  };

  return Array.from({ length: input.count }, (_, index) => {
    const base = index === 0 ? extra : templates[(index - 1) % templates.length];
    return {
      id: `gen-${Date.now()}-${index}`,
      competencyId: input.competencyId,
      difficulty: input.difficulty,
      prompt: base.prompt,
      options: base.options,
      correctIndex: base.correctIndex,
      explanation: base.explanation,
      sourceDocumentId: "doc-sql-handbook",
      status: "review" as const,
    };
  });
}

export function validateQuestion(question: {
  options: string[];
  correctIndex: number;
  prompt: string;
  sourceDocumentId?: string;
}) {
  const issues: string[] = [];
  if (question.options.length !== 4) issues.push("MCQ must have exactly four options.");
  if (new Set(question.options.map((item) => item.trim().toLowerCase())).size !== question.options.length) {
    issues.push("Duplicate options detected.");
  }
  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
    issues.push("Correct answer index is invalid.");
  }
  if (question.prompt.trim().length < 12) issues.push("Stem is too short or ambiguous.");
  if (!question.sourceDocumentId) issues.push("Missing source grounding.");
  return { ok: issues.length === 0, issues };
}
