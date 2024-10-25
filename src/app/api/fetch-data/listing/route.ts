import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
  try {
    const { tb, id } = await request.json();
    let query = "";

    if (tb === "all") {
      if (id) {
        query = `select *, property_listing.id as id  from property_listing where property_listing.id = ${id}`;

        const conn = await connection;
        const [rows] = await conn.execute(query);

        const getImg =
          "SELECT ref FROM property_images WHERE propertyListingId = ?";

        const [img] = await conn.execute(getImg, [id]);

        // @ts-ignore
        const images = img.map((img: { ref: any }) => img.ref);

                // @ts-ignore
                rows[0].images = images;
                return NextResponse.json(rows, {status:200});

            } else {
                query = "SELECT *, property_listing.id AS id FROM property_listing INNER JOIN country ON country = country.id";

        const conn = await connection;
        const [rows] = id
          ? await conn.execute(query, [id])
          : await conn.execute(query);
        return NextResponse.json(rows, { status: 200 });
      }
    } else {
      // Handle other cases if needed
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { message: "Error retrieving data", error },
      { status: 500 }
    );
  }
}
