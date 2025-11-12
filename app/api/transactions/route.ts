import { NextResponse } from "next/server";
import connectDB from "@/libs/db";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/authOption";

// ✅ POST — Add new transaction
export async function POST(req: Request) {
  try {
    await connectDB();

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

    // ✅ Check if user exists (extra safety)
    const user = await User.findById(session.user.id).select("name email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Create new transaction
    const newTransaction = new Transaction({
      userId: user._id,
      type,
      category,
      amount,
      note,
      date,
    });

    await newTransaction.save();

    // ✅ Force populate user details after save
    await newTransaction.populate({
      path: "userId",
      select: "name email",
      model: "User",
    });

    return NextResponse.json(
      { success: true, transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /transactions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET — Fetch transactions (Admin → All, User → Own)
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Load current user from DB
    const currentUser = await User.findById(session.user.id).select("role name email");
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdminOrManager =
      currentUser.role === "admin" || currentUser.role === "manager";

    let transactions;

    if (isAdminOrManager) {
      // ✅ Admin/Manager → All transactions with user info
      transactions = await Transaction.find()
        .populate({ path: "userId", select: "name email", model: "User" })
        .sort({ date: -1 });
    } else {
      // ✅ Normal user → Only own transactions
      transactions = await Transaction.find({ userId: currentUser._id })
        .populate({ path: "userId", select: "name email", model: "User" })
        .sort({ date: -1 });
    }

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    console.error("GET /transactions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
