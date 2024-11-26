import { NextRequest, NextResponse } from "next/server";
import connection from "@/utils/Connection";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("id");

    const conn = await connection;
    const [transactions]: any = await conn.execute('SELECT * FROM transaction INNER JOIN user ON transaction.user_id = user.id');

    const transactionsByType: { stay: any[]; tour: any[]; rental: any[] } = {
      stay: [],
      tour: [],
      rental: [],
    };

    transactions.forEach((transaction: any) => {
      transaction.details = JSON.parse(transaction.details);
    });

    transactions.forEach((transaction: any) => {
      transaction.t_property_type === 1 &&
        transactionsByType.stay.push(transaction);
      transaction.t_property_type === 2 &&
        transactionsByType.tour.push(transaction);
      transaction.t_property_type === 3 &&
        transactionsByType.rental.push(transaction);
    });

    return NextResponse.json({ data: transactionsByType }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
