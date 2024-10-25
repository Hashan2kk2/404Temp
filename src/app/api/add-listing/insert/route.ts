import { NextRequest, NextResponse } from "next/server";
import connection from "@/utils/Connection";
import fs from "fs";
import { writeFile } from "fs/promises";
import {cookies} from 'next/headers';
// @ts-ignore
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const dataSet = await request.formData();

    const coverImage = dataSet.get("coverImageRef") as File;
    const propertyImages = dataSet.getAll(
      "propertyImages"
    ) as unknown as File[];

    if (propertyImages.length === 0) {
      return NextResponse.json({ message: "No files found" }, { status: 400 });
    } else if (!coverImage) {
      return NextResponse.json(
        { message: "Cover image not found" },
        { status: 400 }
      );
    }

    const uploadDir = "public/uploads/properties";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let coverImagePath = "";
    const propertyImagePaths: string[] = [];

    const propertyType = dataSet.get("propertyType");
    const placeName = dataSet.get("placeName");
    const pickLocation = dataSet.get("pickLocation");
    const address = dataSet.get("address");
    const size = dataSet.get("size");
    const propertySizeType = dataSet.get("propertySizeType");
    const additionalRules = dataSet.get("additionalRules");
    const description = dataSet.get("description");
    const nightMin = dataSet.get("nightMin");
    const nightMax = dataSet.get("nightMax");
    const availabilitySchedule = dataSet.get("availabilitySchedule");
    const guests = dataSet.get("guests");
    const bedrooms = dataSet.get("bedrooms");
    const beds = dataSet.get("beds");
    const bathrooms = dataSet.get("bathrooms");
    const kitchen = dataSet.get("kitchen");
    const location = dataSet.get("location");
    const propertyDescription = dataSet.get("propertyDescription");
    const mapUrl = dataSet.get("mapUrl");
    const country = dataSet.get("country");

    if (
      !propertyType ||
      !placeName ||
      !pickLocation ||
      !address ||
      !size ||
      !propertySizeType ||
      !additionalRules ||
      !description ||
      !nightMin ||
      !nightMax ||
      !availabilitySchedule ||
      !guests ||
      !bedrooms ||
      !beds ||
      !bathrooms ||
      !kitchen ||
      !location ||
      !propertyDescription ||
      !country
    ) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 400 }
      );
    }

    const owner = userId();
    const ownerId = owner.id;

    for (const file of propertyImages) {
      const bytes = await file.arrayBuffer();
      const imageBuffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const newFileName = `${uniqueSuffix}-${file.name}`;
      const imagePath = `${uploadDir}/${newFileName}`;
      await writeFile(imagePath, imageBuffer);
      propertyImagePaths.push(imagePath.replace("public", ""));
    }

    const coverImageBytes = await coverImage.arrayBuffer();
    const coverImageBuffer = Buffer.from(coverImageBytes);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFileName = `${uniqueSuffix}-${coverImage.name}`;
    coverImagePath = `${uploadDir}/${newFileName}`;
    await writeFile(coverImagePath, coverImageBuffer);
    const cvrImg = coverImagePath.replace("public", "");

    const addListingQuery = `
            INSERT INTO property_listing (placeName,
                                          propertyType,
                                          pickLocation,
                                          address,
                                          size,
                                          propertySizeType,
                                          additionalRules,
                                          description,
                                          coverImageRef,
                                          availability,
                                          owner,
                                          nightMin,
                                          nightMax,
                                          availabilitySchedule,
                                          guests,
                                          bedrooms,
                                          beds,
                                          bathrooms,
                                          kitchen,
                                          location,
                                          property_description,
                                          mapUrl,
                                          country)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

    const addListingValues = [
      placeName,
      propertyType,
      pickLocation,
      address,
      size,
      propertySizeType,
      additionalRules,
      description,
      cvrImg,
      1,
      ownerId,
      nightMin,
      nightMax,
      availabilitySchedule,
      guests,
      bedrooms,
      beds,
      bathrooms,
      kitchen,
      location,
      propertyDescription,
      mapUrl,
      country,
    ];

    const conn = await connection;

    const [addListingResult] = await conn.execute(
      addListingQuery,
      addListingValues
    );

    // @ts-ignore
    const propertyId = addListingResult.insertId;

    for (const imagePath of propertyImagePaths) {
      const propertyImgQuery = `INSERT INTO property_images (ref, propertyListingId)
                                      VALUES (?, ?);`;
      const propertyImgValues = [imagePath, propertyId];
      await conn.execute(propertyImgQuery, propertyImgValues);
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}


const userId = () => {
  try {
      // Retrieve the session token from the cookie
      const cookieStore = cookies();
      const sessionToken = cookieStore.get('next-auth.session-token');

      // Ensure the session token exists before proceeding
      if (!sessionToken) {
          throw new Error("Session token not found");
      }

      // Decode the JWT token to extract the user details
      const decodedToken = jwt.decode(sessionToken.value) as {
          email?: string;
          firstName?: string;
          lastName?: string;
          name?: string;
          id?: number;
          role?: string;
      };

      // If the email exists in the decoded token, return the user's data
      if (decodedToken?.name) {
          return {
              email: decodedToken.email,
              name: decodedToken.name,
              id: decodedToken.id,
              role: decodedToken.role
          };
      } else if (decodedToken?.firstName) {
          return {
              email: decodedToken.email,
              firstName: decodedToken.firstName,
              lastName: decodedToken.lastName,
              id: decodedToken.id,
              role: decodedToken.role
          };
      } else {
          // Handle the case where the token does not contain an email
          throw new Error("Invalid token");
      }
  } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error("Error decoding token");
  }
}