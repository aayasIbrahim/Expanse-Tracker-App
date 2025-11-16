import { NextRequest, NextResponse } from "next/server";
import  connectDB  from "@/libs/db";
import User from "@/models/User";

interface RequestBody {
  role: "admin" | "manager" | "user";
}

export async function PUT(req: NextRequest, context: { params: Promise<{ _id: string }> }) {
  try {
    await connectDB();

    const {_id } = await context.params; // ✅ Await params
    const { role }: RequestBody = await req.json();

    if (!["admin", "manager", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(_id, { role }, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /users/[id]/role error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}