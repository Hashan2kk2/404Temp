import connection from "@/utils/Connection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    const query = `SELECT * FROM property_listing WHERE id = ?`;
    const queryImages = `SELECT * FROM property_images WHERE propertyListingId = ?`;

    const conn = await connection;
    const [property]: any = await conn.execute(query, [id]);
    const [images]: any = await conn.execute(queryImages, [id]);

    property[0].images = images;
    property[0].description = JSON.parse(property[0].description);

    return NextResponse.json(property[0]);

  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving data', error }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    const query = `SELECT 
      pl.placeName AS 'placeName', 
      pl.id AS 'id', 
      pt.name AS 'propertyType', 
      location, 
      pl.coverImageRef AS 'coverImage', 
      availability.name AS 'availability', 
      owner.firstName AS 'ownerFirstName', 
      owner.lastName AS 'ownerLastName', 
      review, 
      insertedDate 
    FROM property_listing pl 
    INNER JOIN property_type pt ON pl.propertyType = pt.id 
    INNER JOIN availability ON pl.availability = availability.id 
    INNER JOIN owner ON pl.owner = owner.id
    ${id ? `WHERE owner.id = ${id}` : ''}`;

    const conn = await connection;
    const [properties]: any = await conn.execute(query);

    return NextResponse.json(properties);

  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving data', error }, { status: 500 });
  }
}
