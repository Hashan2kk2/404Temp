import React from 'react';

const EmailTemplateWelcome = ({ name, actionLink, actionText, role }: {
    name: string;
    actionLink: string;
    actionText?: string;
    role: string;
}) => {
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <table style={{ width: '100%', maxWidth: '800px', minHeight: '200px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '16px', borderCollapse: 'collapse', marginLeft: 'auto', marginRight: 'auto' }}>

                <thead>
                    <tr>
                        <th style={{ height: '64px', backgroundColor: '#582d31', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', color: 'white', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>
                            404 Travels
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td style={{ padding: '32px 64px', textAlign: 'center' }}>

                            <img
                                src="https://i.ibb.co/cw1VJt8/logo.png"
                                alt="Welcome to 404 Travels"
                                style={{ width: '100%', maxWidth: '200px', borderRadius: '12px', marginBottom: '24px', marginLeft: 'auto', marginRight: 'auto' }} />

                            <h1 style={{ fontSize: '28px', color: '#582d31' }}>Welcome, {name}!</h1>
                            <p style={{ color: '#4B5563', fontSize: '16px', marginBottom: '24px' }}>
                                {role === 'admin' ? "Welcome to the 404 Travels admin portal! We're excited to have you on board." : role === 'user' ? "We're thrilled to have you join our community at 404 Travels! To get started on your travel adventure, we've compiled some useful resources and tips just for you. Click the button below to explore." : role === 'owner' ? "We're excited to have you on board. Start listing your properties and vehicles today to reach a wider audience and maximize your earnings!" : ''}
                            </p>

                            <a href={actionLink} style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: '#582d31', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '500', marginBottom: '24px' }}>
                                {actionText || "Explore Now"}
                            </a>

                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td style={{ height: '64px', backgroundColor: '#FAFAFA', color: '#6B7280', textAlign: 'center', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                            <small>© 2024 404 Travels. All rights reserved.</small>
                        </td>
                    </tr>
                </tfoot>

            </table>
        </div>
    );
};

export default EmailTemplateWelcome;
