'use client';
import { useEffect } from 'react';

const SettingsPage = () => {
    useEffect(() => {
        window.location.href = '/profile?section=settings';
    }, []);
    return null;
}

export default SettingsPage;