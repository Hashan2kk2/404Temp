import { NextRequest, NextResponse } from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
  try {
    const { tb, id } = await request.json();
    let query = "";

    if (tb === "all") {
      if (id) {
        query =
          "SELECT vehicle.*,transmission_type.name AS transmissionName,vehicle_type.name AS vehicleTypeName,fuel_type.name AS fuelTypeName,district.name AS districtName FROM vehicle INNER JOIN transmission_type ON vehicle.transmissionType = transmission_type.id INNER JOIN vehicle_type ON vehicle.vehicleType = vehicle_type.id INNER JOIN fuel_type ON vehicle.fuel_type_id = fuel_type.id INNER JOIN district ON vehicle.district_id = district.id WHERE vehicle.availability_id = 1 AND vehicle.id = ?";

        const conn = await connection;
        const [unformattedRentalList] = await conn.execute(query, [id]);

        const vehicleImages: { vehicleId: any; image: any }[] = [];

        // @ts-ignore
        for (const vehicle of unformattedRentalList) {
          const vehicleId = vehicle.id;
          const imageQuery = `SELECT *
                                        FROM vehicle_images
                                        WHERE vehicleId = ?`;

          const [imagesList] = await conn.execute(imageQuery, [vehicleId]);
          // @ts-ignore
          for (const image of imagesList) {
            vehicleImages.push({
              vehicleId: vehicleId,
              image: image.ref,
            });
          }
        }

        // @ts-ignore
        const rentalList = unformattedRentalList.map((rental: any) => {
          rental.pricing = JSON.parse(rental.pricing);
          return rental;
        });

      return NextResponse.json({ rentalList, vehicleImages });

      } else {
        query =
          "SELECT vehicle.*, transmission_type.name AS transmissionName FROM vehicle JOIN transmission_type ON vehicle.transmissionType = transmission_type.id WHERE vehicle.availability_id = 1";

        const conn = await connection;
        const [unformattedRentalList] = await conn.execute(query);

        const vehicleImages: { vehicleId: any; image: any }[] = [];

        // @ts-ignore
        for (const vehicle of unformattedRentalList) {
          const vehicleId = vehicle.id;
          const imageQuery = `SELECT *
                                        FROM vehicle_images
                                        WHERE vehicleId = ?`;

          const [imagesList] = await conn.execute(imageQuery, [vehicleId]);
          // @ts-ignore
          for (const image of imagesList) {
            vehicleImages.push({
              vehicleId: vehicleId,
              image: image.ref,
            });
          }
        }

        // @ts-ignore
        const rentalList = unformattedRentalList.map((rental: any) => {
          rental.pricing = JSON.parse(rental.pricing);
          return rental;
        });

      return NextResponse.json({ rentalList, vehicleImages });
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
