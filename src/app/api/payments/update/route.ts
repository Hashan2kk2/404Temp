import { NextRequest, NextResponse } from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Request data",data);

    const propertyId = data.id;
    const type = data.type;
    const updatedDataSet = data.updatedDataSet;
    const existingAvailabilitySchedule = data.existingAvailabilitySchedule;
    const userId = data.userId;
    const price = data.price;

    const availabilityScheduleArray: string[] = [
      ...existingAvailabilitySchedule,
    ];
    availabilityScheduleArray.push(...updatedDataSet.bookingDates);

    const conn = await connection;
    const [tourType]: any = await conn.execute(
      `SELECT id FROM t_property_type WHERE name = ?`,
      [type]
    );

    const propeTypeId = tourType[0].id;
    const updateQuery = `UPDATE ${type} SET availabilitySchedule = ? WHERE id = ?`;
    const values = [availabilityScheduleArray.toString(), propertyId];
    await conn.execute(updateQuery, values);

    const paymentId = Math.floor(Math.random() * 1000000);

    const insertQuery = `INSERT INTO transaction (property_id, price, payment_id, t_property_type,user_id,details) VALUES (?,?,?,?,?,?)`;
    const insertValues = [
      propertyId,
      price,
      paymentId,
      propeTypeId,
      userId,
      JSON.stringify(updatedDataSet),
    ];

    await conn.execute(insertQuery, insertValues);
    return NextResponse.json({message: "Success"},{ status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
