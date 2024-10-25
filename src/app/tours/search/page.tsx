'use client';

import React, {Suspense, useEffect, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import Navigation from "@/components/Navigation";
import Notiflix from "notiflix";
import TourCard from '@/components/TourCard';
import {TfiFaceSad} from 'react-icons/tfi';

const Page = () => {

    const searchParams = useSearchParams();
    const location = searchParams.get('location');
    const tourType = searchParams.get('tourType');
    const noOfNights = searchParams.get('noOfNights');
    const language = searchParams.get('language');

    const [empty, setEmpty] = useState(false);

    const ITEMS_PER_PAGE = 24;
    const [currentPage, setCurrentPage] = useState(1);
    const [listingData, setListingData] = useState([]);
    const totalPages = Math.ceil(listingData.length / ITEMS_PER_PAGE);

    const fetchToursData = async (location: string, tourType: string, noOfNights: string, language: string) => {
        try {
            const requestData = { location, tourType, noOfNights, language };

            const res = await fetch('/api/fetch-data/tours/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch listing data');
            }

            const data = await res.json();
            setListingData(data);
        } catch (e) {
            console.error('An error occurred while fetching data:', e);
            throw e;
        }

    };

    useEffect(() => {
        Notiflix.Loading.pulse('Loading...');
        fetchToursData(location || '', tourType || '', noOfNights || '', language || '')
            .then(() => {
                Notiflix.Loading.remove();
            }).catch(e => {
                console.error('An error occurred while fetching data:', e);
                Notiflix.Notify.failure('Failed to fetch data');
                setEmpty(true);
                Notiflix.Loading.remove();
            });
    }, [location, currentPage, searchParams]);

    const currentItems = listingData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const router = useRouter();
    const handleSingleView = (id: any) => {
        router.push(`/tours/detail?id=${id}`);
    };

    return (
        <Suspense fallback={
            <div className={`w-full h-screen flex justify-center items-center`}>
                <div className={`text-2xl`}>Loading...</div>
            </div>
        }>
            <>
                <Navigation />
                {empty ? (
                    <>
                        <section className="fixed top-0 left-0 flex items-center justify-center w-full h-screen py-10 bg-white sm:py-16 lg:py-24">
                            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                                <div className="max-w-2xl mx-auto text-center">
                                    <TfiFaceSad className='mx-auto text-5xl font-bold text-primary' />
                                    <h2 className="mt-10 text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">Item not
                                        Found</h2>
                                    <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">We couldn&apos;t find your Searched Item.
                                        <br />
                                        Please try using different search terms.</p>
                                </div>

                                <div
                                    className="flex flex-col items-center justify-center mt-8 space-y-4 md:space-y-0 md:space-x-4 md:flex-row lg:mt-4">

                                    <a href="/rental/search"
                                        className="inline-flex items-center justify-center px-4 py-4 transition-all duration-200 border-2 rounded-md text-primary border-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
                                        role="button">
                                        View All Items
                                    </a>
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        {/* Results */}
                        <div className="grid px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 max-w-[1300px] gap-10 mx-auto buttons-bar">
                            {currentItems.map((item: any, index) => (
                                <TourCard coverImg={item.images[0]?.name || '/images/placeholder.jpg'} title={item.title} price={item.price} noOfNights={item.noOfNights} rating={item.review} key={index} event={() => { handleSingleView(item.id) }} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="max-w-[1300px] mx-auto flex items-center justify-center gap-2 mt-12">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <div
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`w-11 font-medium aspect-square rounded-full flex items-center justify-center cursor-pointer ${currentPage === index + 1
                                            ? 'bg-primary text-white'
                                            : 'bg-white border border-neutral-300 text-neutral-400'
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </>
        </Suspense>
    );
};

export default Page;