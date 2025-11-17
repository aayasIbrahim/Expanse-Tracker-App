import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/libs/db";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
