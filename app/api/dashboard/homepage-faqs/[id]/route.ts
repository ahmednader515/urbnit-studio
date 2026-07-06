import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteHomepageFaq, updateHomepageFaq } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const { id } = await ctx.params;
  let body: {
    question?: string;
    questionEn?: string | null;
    answer?: string;
    answerEn?: string | null;
    sortOrder?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  await updateHomepageFaq(id, {
    question: body.question,
    question_en: body.questionEn,
    answer: body.answer,
    answer_en: body.answerEn,
    sort_order: body.sortOrder,
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const { id } = await ctx.params;
  await deleteHomepageFaq(id);
  return NextResponse.json({ success: true });
}
