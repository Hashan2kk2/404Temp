import React from 'react';

interface EmailTemplateProps {
    name: string;
    code: string;
    emailType: string;
}

export const EmailTemplatePasswordVerify: React.FC<Readonly<EmailTemplateProps>> = ({name, code, emailType}) => (
    <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <table style={{width: '100%', maxWidth: '800px', minHeight: '200px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '16px', borderCollapse: 'collapse', marginLeft: 'auto', marginRight: 'auto'}}>

            {/* Header */}
            <thead>
            <tr>
                <th style={{height: '64px', backgroundColor: '#582d31', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', color: 'white', fontSize: '24px', fontWeight: '600', textAlign: 'center'}}>
                    404 Travels
                </th>
            </tr>
            </thead>

            {/* Content */}
            <tbody>
            <tr>
                <td style={{padding: '32px 64px', textAlign: 'center'}}>
                    <h1 style={{fontSize: '30px'}}>
                        {emailType === 'activation' ? 'Activate your account' : 'Reset your password'}
                    </h1>
                    <p style={{color: '#374151', fontSize: '24px'}}>Hello, {name},</p>
                    <p style={{color: '#4B5563', fontSize: '20px'}}>
                        {emailType === 'activation'
                            ? "We're excited to have you on board! To complete your registration, please enter the verification code below."
                            : "We received a request to reset your password. Please enter the verification code below to reset your password."}
                    </p>

                    <div style={{display: 'inline-block', minWidth: '200px', margin: '40px 0', fontWeight: '600', padding: '16px 24px', backgroundColor: '#F3F4F6', borderRadius: '12px'}}>
                        <span style={{fontSize: '30px', color: '#582d31'}}>{code}</span>
                    </div>

                    <div style={{width: '100%', marginTop: '16px'}}>
                        <p style={{color: '#6B7280'}}>
                            {emailType === 'activation'
                                ? "If you didn't request this, you can safely ignore this email."
                                : 'This code will expire in 10 minutes.'}
                        </p>
                        <small>
                            <span style={{color: '#6B7280'}}>This email was sent to you by 404 Travels. If you have any questions, please contact us at </span>
                            <a aria-label="link" href="mailto:support@404travelers.com" style={{color: '#582d31'}}>support@404travelers.com</a>
                        </small>
                    </div>
                </td>
            </tr>
            </tbody>

            {/* Footer */}
            <tfoot>
            <tr>
                <td style={{height: '64px', backgroundColor: '#FAFAFA', color: '#6B7280', textAlign: 'center', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'}}>
                    <small>© 2024 404 Travels. All rights reserved.</small>
                </td>
            </tr>
            </tfoot>

        </table>
    </div>
);
