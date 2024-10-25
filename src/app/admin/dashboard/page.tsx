"use client";
import Navigation from "@/components/admin/Navigation";
import TopNavigation from "@/components/admin/TopNavigation";
import {useEffect, useState} from "react";
import dynamic from 'next/dynamic';
import Notiflix from "notiflix";
import {getCookie} from "cookies-next";

// Dynamically import components with SSR disabled
const Dashboard = dynamic(() => import('@/components/admin/Dashboard'), { ssr: false });
const ManageStays = dynamic(() => import('@/components/admin/ManageStays'), { ssr: false });
const ManageRentals = dynamic(() => import('@/components/admin/ManageRentals'), { ssr: false });
const ManageTours = dynamic(() => import('@/components/admin/ManageTours'), { ssr: false });
const CustomerReviews = dynamic(() => import('@/components/admin/CustomerReviews'), { ssr: false });
const ManageUsers = dynamic(() => import('@/components/admin/ManageUsers'), { ssr: false });

const Page = () => {
    const [activeTab, setActiveTab] = useState("tab0");
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/admin/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            setUserDetails(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sessionToken = getCookie('next-auth.session-token');

    useEffect(() => {
        if (!sessionToken) {
            Notiflix.Notify.failure('You are not logged in! Redirecting to login page...');
            Notiflix.Loading.circle('Redirecting...');
            setTimeout(() => {
                window.location.href = '/sign-in';
            }, 2000);
        } else {
            Notiflix.Loading.circle('Loading...');
            fetchUser();
        }
    }, [sessionToken]);

    useEffect(() => {
        // @ts-ignore
        if (userDetails && userDetails.role !== 'admin') {
            Notiflix.Notify.failure('You are not authorized to access this page! Redirecting to home page...');
            Notiflix.Loading.circle('Redirecting...');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }
    }, [userDetails]);

    if (loading) {
        return null;
    }

    // @ts-ignore
    if (!userDetails || userDetails.role !== 'admin') {
        return null;
    }

    return (
        <div className="w-full h-screen p-4 gap-4 grid grid-cols-12 relative overflow-clip">
            <div
                className="w-80 aspect-square bg-neutral-200 opacity-15 absolute rounded-full blur-3xl -z-10 left-20 -top-52"></div>
            <div
                className="w-[700px] aspect-square bg-neutral-200 opacity-15 absolute rounded-full blur-3xl -z-10 top-0 -right-52"></div>
            <div
                className="w-[500px] aspect-square bg-neutral-200 opacity-15 absolute rounded-full blur-3xl -z-10 left-20 -bottom-52"></div>

            <div className="lg:col-span-3 xl:col-span-2 hidden lg:block">
                <Navigation userDetails={userDetails} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="col-span-full lg:col-span-9 xl:col-span-10 w-full h-full rounded-2xl flex flex-col">
                <TopNavigation userDetails={userDetails} activeTab={activeTab} setActiveTab={setActiveTab} />
                <div
                    className="w-full mt-4 h-[calc(100vh-8rem)] bg-white rounded-xl overflow-clip border-neutral-100 border backdrop-blur-2xl opacity-90">
                    {activeTab === "tab0" && <Dashboard userDetails={userDetails} />}
                    {activeTab === "tab1" && <ManageStays userDetails={userDetails} />}
                    {activeTab === "tab2" && <ManageRentals userDetails={userDetails} />}
                    {activeTab === "tab3" && <ManageTours userDetails={userDetails} />}
                    {activeTab === "tab4" && <CustomerReviews userDetails={userDetails} />}
                    {activeTab === "tab5" && <ManageUsers userDetails={userDetails} />}
                </div>
            </div>
        </div>
    );
};

export default Page;
