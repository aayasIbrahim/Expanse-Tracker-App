import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/libs/db";

interface Params {
  id: string;
}

interface UpdateBody {
  role: string;
}
export async function PUT(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const body: UpdateBody = await req.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,            
      { role },
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully", user },
      { status: 200 }
    );

  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
