import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/libs/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  // ⛔ params is a Promise → FIX: await it
  const { id } = await context.params;
  const { role } = await req.json();

  if (!["admin", "manager", "user"].includes(role)) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role updated", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
