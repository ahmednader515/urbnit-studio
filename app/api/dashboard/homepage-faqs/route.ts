import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createHomepageFaq, listHomepageFaqs } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const faqs = await listHomepageFaqs();
  return NextResponse.json(faqs);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  let body: {
    question?: string;
    questionEn?: string;
    answer?: string;
    answerEn?: string;
    sortOrder?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  const question = String(body.question ?? "").trim();
  const answer = String(body.answer ?? "").trim();
  if (!question || !answer) {
    return NextResponse.json({ error: "السؤال والإجابة مطلوبان" }, { status: 400 });
  }
  const id = randomUUID();
  await createHomepageFaq({
    id,
    question,
    question_en: body.questionEn?.trim() || null,
    answer,
    answer_en: body.answerEn?.trim() || null,
    sort_order: body.sortOrder ?? 0,
  });
  return NextResponse.json({ id });
}
