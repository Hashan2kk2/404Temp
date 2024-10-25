'use client';

import {Suspense, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Notiflix from 'notiflix';

const SingleView = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const [testDataset, setTestDataset] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Notiflix.Loading.pulse('Loading');

        testFunction()
            .then(() => {
                setLoading(false);
                Notiflix.Loading.remove();
            })
            .catch((e) => {
                setError(e.message);
                setLoading(false);
                Notiflix.Loading.remove();
                Notiflix.Notify.failure('Error fetching data.');
            });
    }, [email,searchParams]);

    const testFunction = async () => {
        const response = await fetch(`/api/user/fetch-update?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const res = await response.json();
        setTestDataset(res);
    };

    if (loading) {
        return (
            <div className={`w-full h-screen flex justify-center items-center`}>
                <div className={`text-2xl`}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <h1>Single View</h1>
            <p>Email: {email}</p>
            <p>ID: {id}</p>
            <p>Type: {type}</p>
            <pre>Data: {JSON.stringify(testDataset, null, 2)}</pre>
        </>
    );
};

const Page = () => {
    return (
        <Suspense fallback={
            <div className={`w-full h-screen flex justify-center items-center`}>
                <div className={`text-2xl`}>Loading...</div>
            </div>
        }>
            <SingleView />
        </Suspense>
    );
};

export default Page;
