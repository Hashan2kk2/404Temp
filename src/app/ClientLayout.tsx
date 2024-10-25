'use client';

import {useEffect} from 'react';
import Notiflix from 'notiflix';
import {useRouter, useSearchParams} from 'next/navigation';

export default function ClientLayout({
                                         children,
                                     }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();

    useEffect(() => {
        Notiflix.Notify.init({
            position: 'right-top',
            timeout: 3000,
            cssAnimationStyle: 'from-top',
            cssAnimationDuration: 200,
            useIcon: false,
            pauseOnHover: true,
            failure: {
                background: '#fee2e2',
                textColor: '#991b1b',
            },
            success: {
                background: '#dcfce7',
                textColor: '#166534',
            },
            warning: {
                background: '#fef9c3',
                textColor: '#a16207',
            },
            info: {
                background: '#dbeafe',
                textColor: '#1d4ed8',
            },
        });
        Notiflix.Confirm.init({
            okButtonBackground: '#582d31',
            titleColor: '#582d31',
        });    
    }, [router,useSearchParams]);

    return <>{children}</>;
}
