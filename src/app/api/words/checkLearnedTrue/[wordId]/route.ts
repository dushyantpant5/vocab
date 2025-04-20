import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { getUserId, UserData } from "@/helpers/auth";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ wordId: string }>;
  }
) {
  const { user, error }: UserData = await getUserId();
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  if (user.id.length === 0) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const { wordId } = await params;

  if (!wordId || wordId.length === 0) {
    return NextResponse.json(
      { error: "Params or Word ID not found" },
      { status: 400 }
    );
  }

  try {
    const updatedWordProgress = await prisma.wordprogress.update({
      where: {
        userid_wordid: {
          userid: user.id,
          wordid: wordId,
        },
      },
      data: {
        islearned: true,
      },
    });

    return NextResponse.json(updatedWordProgress);
  } catch {
    return NextResponse.json(
      { error: "Failed to update word progress" },
      { status: 500 }
    );
  }
}
