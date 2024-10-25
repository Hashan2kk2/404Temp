import { NextRequest, NextResponse } from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
  try {
    const { tb, count } = await request.json();
    if (count) {
      const query = "SELECT COUNT(*) AS count FROM " + tb;
      const conn = await connection;
      const [rows] = await conn.execute(query);
      return NextResponse.json(rows, { status: 200 });
    } else {
      if (tb === "admin" || tb === "user" || tb === "owner") {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 401 }
        );
      } else {
        const query = "SELECT * FROM " + tb;
        const conn = await connection;
        const [rows] = await conn.execute(query);
        return NextResponse.json(rows, { status: 200 });
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving data", error },
      { status: 500 }
    );
  }
}
