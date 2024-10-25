import {useEffect, useState} from 'react';
import Notiflix from 'notiflix';

const useFetchUser = () => {
    const [loading, setLoading] = useState(true);

    const handleUserRedirect = (role: string, url: string) => {
        Notiflix.Notify.success('You are already signed in');
        Notiflix.Loading.circle('Redirecting...');
        setTimeout(() => {
            window.location.href = url;
        }, 2000);
    };

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();

            if (response.ok) {
                switch (data.role) {
                    case 'owner':
                        handleUserRedirect(data.role, '/');
                        break;
                    case 'admin':
                        handleUserRedirect(data.role, '/admin/dashboard');
                        break;
                    case 'user':
                        handleUserRedirect(data.role, '/dashboard');
                        break;
                    default:
                        setLoading(false);
                        break;
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser().then(r => r);
    }, []);

    return loading;
};

export default useFetchUser;
