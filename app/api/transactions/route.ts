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

export async function GET(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(session.user.id).select("role name email");
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdminOrManager =
      currentUser.role === "admin" || currentUser.role === "manager";

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query = isAdminOrManager
      ? Transaction.find()
      : Transaction.find({ userId: currentUser._id });

    const total = await query.clone().countDocuments();

    // ✅ Calculate totals for all transactions (not just paginated)
    const allTransactions = await query.clone();
    const totalIncome = allTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = allTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // ✅ Paginated transactions
    const transactions = await query
      .populate({ path: "userId", select: "name email", model: "User" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        transactions,
        total,
        page,
        limit,
        totalIncome,
        totalExpense,
        balance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /transactions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}