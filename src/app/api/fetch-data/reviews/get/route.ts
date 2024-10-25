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
    const searchQuery = `SELECT * FROM ${table} INNER JOIN review ON ${table}.review_id = review.id INNER JOIN user ON review.user = user.id WHERE ${data.type}_id = ? AND review.status_id='1' ORDER BY review.createdTime DESC`;
    const conn = await connection;
    const [searchResult]: any = await conn.query(searchQuery, [data.itemId]);

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error(error);
  }
}
