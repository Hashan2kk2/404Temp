import { NextRequest, NextResponse } from "next/server";
const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    "ee5cac60a9580f4d69146c998e2134f4",
    "18ccecba810546edcfe07f000445b53c",
);

export async function POST(request: NextRequest) {

    const data = await request.json();
    const email = data.email;
    let userName = '';
    try {
        const apiUrl = new URL("/api/owner/fetch-user", request.nextUrl.origin);
        const response = await fetch(apiUrl.toString(), {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
            }),
        });
        const res = await response.json();
        userName = res[0].firstName;
    } catch (error) {
        console.error(error);
    }

    const emailType = data.emailType;
    const subject = emailType === 'activation' ? 'Activate your account - 404 Travels' : 'Reset your password - 404 Travels';
    const code = data.code;

    const requestMail = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "hashanlakruwan4156@gmail.com",
                        Name: "404 Travels"
                    },
                    To: [
                        {
                            Email: email,
                            Name: userName
                        }
                    ],
                    Subject: subject,
                    TextPart: subject,
                    HTMLPart: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${subject}</title>
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
                                                <h2 style="color: #4a1c1c; font-size: 24px; margin: 0;">Hello, ${userName}!</h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 20px;">
                                                <p style="color: #666666; font-size: 16px; margin: 0;">
                                                    ${emailType === 'activation' ? 'Welcome to 404 Travels! <br/> Please copy the code below to activate your account.' : 'You have requested to reset your password. <br/> Please copy the code below to reset your password.'}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px;">
                                               <p style="background-color: #4a1c1c; color: #ffffff; padding: 15px 25px; font-size: 16px; text-decoration: none; border-radius: 5px; display: inline-block;">${code}</p>
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
        return NextResponse.json({ message: 'success' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to send verification code' }, { status: 500 });
    }
}