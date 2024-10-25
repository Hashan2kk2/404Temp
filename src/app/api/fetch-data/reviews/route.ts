import {NextRequest, NextResponse} from 'next/server';
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    try {
        const {table,type} = await request.json();

        let column = '';
        if(type === 'property_listing'){
            column = 'placeName';
        }else if(type === 'vehicle'){
            column = 'vehicleNumber';
        }else{
            column = 'title';
        }

        const query = "SELECT " + table + ".review_id," + table + "." + type + "_id,review.`user`,review.review,review.point,review.createdTime,`status`.id AS 'status_id',`status`.`name` AS 'status',`user`.firstName,`user`.lastName," + type + "." + column + " as 'itemTitle' FROM  " + table + " INNER JOIN review ON " + table + ".review_id = review.id INNER JOIN `status` ON review.status_id = `status`.id INNER JOIN `user` ON review.`user` = `user`.id INNER JOIN " + type + " ON " + table + "." + type + "_id = " + type + ".id";
        const conn = await connection;
        const [result] = await conn.execute(query);
        return NextResponse.json(result, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error retrieving data', error}, {status: 500});
    }
}

export async function GET(request: NextRequest) {
    try {
        const query = "SELECT flight_review.id AS 'review_id',flight_review.`user`,flight_review.review,flight_review.point,flight_review.createdTime,flight_review.status_id,`status`.`name` AS 'status',`user`.firstName,`user`.lastName FROM flight_review INNER JOIN `status` ON flight_review.`status_id` = `status`.id INNER JOIN `user` ON flight_review.`user` = `user`.id";
        const conn = await connection;
        const [result] = await conn.execute(query);
        return NextResponse.json(result, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error retrieving data', error}, {status: 500});
    }
}
