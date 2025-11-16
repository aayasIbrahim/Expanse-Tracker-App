import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/libs/db";

export async function GET() {
  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(users);
}