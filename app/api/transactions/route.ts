import { NextResponse } from "next/server";
import connectDB from "@/libs/db";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/authOption"; // your NextAuth config

// ✅ POST — Add new transaction
export async function POST(req: Request) {
  try {
    await connectDB();

    // Get session to identify the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, category, amount, note, date } = body;

    if (!type || !category || !amount || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      userId: session.user.id, // ✅ Attach logged-in user
      type,
      category,
      amount,
      note,
      date,
    });

    return NextResponse.json(
      { success: true, transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /transactions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ GET — Fetch all transactions for logged-in user
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await Transaction.find({ userId: session.user.id }).sort({
      date: -1,
    });

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    console.error("GET /transactions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
