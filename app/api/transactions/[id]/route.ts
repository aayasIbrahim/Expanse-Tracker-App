import { NextResponse } from "next/server";
import connectDB from "@/libs/db";
import Transaction from "@/models/Transaction";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updatedTransaction)
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { success: true, transaction: updatedTransaction },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /transactions/:id error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deletedTransaction = await Transaction.findByIdAndDelete(params.id);

    if (!deletedTransaction)
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { success: true, transaction: deletedTransaction },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /transactions/:id error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
