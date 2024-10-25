import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const email = data.email;
  const role = data.role;
  const name = data.name;

  if (!email || !role || !name) {
    return NextResponse.json({ message: "Email, role, and name are required" }, { status: 400 });
  }

  let userData: { firstName?: string } = {};
  try {
    const apiUrl = new URL(
      "/api/user/fetch-update?email=" + email,
      request.nextUrl.origin
    );
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const res = await response.json();
    userData = res[0];
  } catch (error) {
    console.error(error);
  }

  if (!userData) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const firstName = userData.firstName || "";
  const actionLink = "https://404travels.com";
  const actionText = "Explore Now";

  const Mailjet = require("node-mailjet");
  const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  );

  const requestMail = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "hashanlakruwan4156@gmail.com",
          Name: "404 Travels",
        },
        To: [
          {
            Email: email,
            Name: firstName,
          },
        ],
        Subject: "Welcome to 404 Travels",
        TextPart: "Welcome to 404 Travels",
        HTMLPart: `
       <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welcome to 404 Travels</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                            <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #fff; padding: 20px; border-radius: 8px;">
                                        <tr>
                                            <td align="center" style="padding: 10px 0;">
                                                <h1 style="background: #4a1c1c; font-size: 24px; margin: 0; color:#ffff; padding:10px 0; border-radius: 5px;">404 Travels</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 0;">
                                                <img src="https://i.ibb.co/rbXZxGR/logo.png" alt="404 Travels Logo" style="width: 100px; height: auto;" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 10px 20px;">
                                                <h2 style="color: #4a1c1c; font-size: 24px; margin: 0;">Hello, ${name}!</h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 20px;">
                                                <p style="color: #666666; font-size: 16px; margin: 0;">
                                                    ${role === 'admin' ? "Welcome to the 404 Travels admin portal! We're excited to have you on board." : role === 'user' ? "We're thrilled to have you join our community at 404 Travels! To get started on your travel adventure, we've compiled some useful resources and tips just for you. Click the button below to explore." : role === 'owner' ? "We're excited to have you on board. Start listing your properties and vehicles today to reach a wider audience and maximize your earnings!" : ''}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px;">
                                                <a href="${actionLink}" style="background-color: #4a1c1c; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">${actionText}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px; color: #999999; font-size: 12px;">
                                                <p>&copy; 2024 404 Travels. All rights reserved.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
        `,
      },
    ],
  });

  try {
    await requestMail;
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }

}
