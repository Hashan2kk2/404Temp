'use client';
import { useEffect } from 'react';

const MyBookingsPage = () => {
    useEffect(() => {
        window.location.href = '/profile?section=my-bookings';
    }, []);

    return null;
}

export default MyBookingsPage;