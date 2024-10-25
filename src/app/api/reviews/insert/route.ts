import connection from "@/utils/Connection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  let table;
  if (data.type === "tours") {
    table = "tours_has_review";
  } else if (data.type === "property_listing") {
    table = "property_listing_has_review";
  } else if (data.type === "vehicle") {
    table = "vehicle_has_review";
  }

  try {
    if (data.rating === 0 || data.review === "") {
      return NextResponse.json(
        { message: "Please provide a rating and review before submitting." },
        { status: 400 }
      );
    }

    const tiQuery = `INSERT INTO review (user, review, status_id, point) VALUES (?, ?, ?, ?)`;
    const conn = await connection;
    const [tiResult]: any = await conn.query(tiQuery, [
      data.userId,
      data.review,
      1,
      data.rating,
    ]);

    const reviewId = tiResult.insertId;
    const thrQuery = `INSERT INTO ${table} (${data.type}_id, review_id) VALUES (?, ?)`;
    await conn.query(thrQuery, [data.itemId, reviewId]);

    const avgQuery = `SELECT AVG(point) as avg FROM review INNER JOIN ${table} ON review.id = ${table}.review_id WHERE ${data.type}_id = ?`;
    const [avgResult]: any = await conn.query(avgQuery, [data.itemId]);
    const avg = parseFloat(avgResult[0].avg).toFixed(1);

    const updateQuery = `UPDATE ${data.type} SET review = ? WHERE id = ?`;
    await conn.query(updateQuery, [avg, data.itemId]);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error:any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}