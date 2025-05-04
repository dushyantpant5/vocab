import { getUserId } from "@/helpers/auth";

export async function GET() {
  const { user } = await getUserId();

  if (!user || user.id.length === 0) {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  } else {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
}
