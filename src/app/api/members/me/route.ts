import { NextResponse } from "next/server";
import { getMemberEmailFromCookie } from "@/lib/member-auth";
import { getMemberByEmail } from "@/lib/members-store";

export async function GET() {
  const email = await getMemberEmailFromCookie();
  if (!email) {
    return NextResponse.json({ member: null }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const member = await getMemberByEmail(email);
  if (!member) {
    return NextResponse.json({ member: null }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(
    {
      member: {
        email: member.email,
        name: member.name,
        firstDiscountUsed: member.firstDiscountUsed,
        createdAt: member.createdAt,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
