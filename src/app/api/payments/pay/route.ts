import { NextRequest, NextResponse } from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const userId = data.userId;
    const price = data.price;

    const conn = await connection;
    const [user]: any = await conn.execute(
      `SELECT email, mobile FROM user WHERE id = ?`,
      [userId]
    );

    const email = user[0].email;
    const mobile = user[0].mobile;

    const merchantRID = Math.floor(Math.random() * 100);

    console.log("Merchant RID : ",merchantRID);
    console.log("Mobile : ",mobile);
    console.log("Email : ",email);
    
    const apiUrl = new URL(
      "https://dev.app.marx.lk/api/v2/ipg/orders",
      request.nextUrl.origin
    );
    const response = await fetch(apiUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_secret:
          "\$2a\$10\$0.ogcTfS46TZIlKdyUeKHu0Hr2cDGcbNiufzIybnDtYpULkd4V3Li",
      },
      body: JSON.stringify({
        merchantRID: merchantRID,
        amount: price,
        validTimeLimit: 5,
        returnUrl: "https://www.404travels.com",
        customerMail: email,
        customerMobile: mobile,
        mode: "WEB",
        orderSummary: "Order Description",
        customerReference: "CUST" + userId,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }

    const dataSet = await response.json();
    console.log("Marx create order response",dataSet);

    return NextResponse.json(
      {
        message: "Success",
        payUrl: dataSet.data.payUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// payment details

// card number : 5506 9001 4010 0305 / 4440000042200014
// url : https://dev.merchant.marx.lk/
// portal username : Mobiz_International
// portal password : MobiZ@714
