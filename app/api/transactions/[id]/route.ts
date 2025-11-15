import { NextResponse } from "next/server";
import connectDB from "@/libs/db";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOption";
import mongoose from "mongoose";

// ✅ Update transaction (PUT)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ params is a Promise now
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Unwrap the promise to access params
    const { id } = await context.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).populate("userId", "name email");

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, transaction: updatedTransaction },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ Delete transaction (DELETE)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ unwrap the promise
    const { id } = await context.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
