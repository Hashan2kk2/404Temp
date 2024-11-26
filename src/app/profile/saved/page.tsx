'use client';
import { useEffect } from 'react';

const SavedPage = () => {
    useEffect(() => {
        window.location.href = '/profile?section=saved';
    }, []);

    return null;
};

export default SavedPage;