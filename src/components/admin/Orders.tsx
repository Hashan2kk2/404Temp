import { Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from '@nextui-org/react';
import { user } from '@nextui-org/theme';
import Notiflix from 'notiflix';
import React, { useEffect, useState } from 'react'

const Orders = ({ userDetails }: { userDetails: any }) => {

    interface BookedItems {
        stay: any[];
        tour: any[];
        rental: any[];
    }

    const [allItems, setAllItems] = useState<BookedItems>({
        stay: [],
        tour: [],
        rental: [],
    });

    const [boookedItems, setBookedItems] = useState<BookedItems>({
        stay: [],
        tour: [],
        rental: [],
    });

    useEffect(() => {
        initialFetch().then(() => fetchTransactions());
    }, []);

    const initialFetch = async () => {
        try {
            const [toursResponse, staysResponse, rentalsResponse] = await Promise.all([
                fetch('/api/fetch-data/tours/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tb: 'all' }),
                }),
                fetch('/api/fetch-data/stays/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tb: 'all' }),
                }),
                fetch('/api/fetch-data/rental/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tb: 'all' }),
                }),
            ]);

            const toursData = await toursResponse.json();
            const staysData = await staysResponse.json();
            const rentalsData = await rentalsResponse.json();

            setAllItems({
                stay: staysData,
                tour: toursData,
                rental: rentalsData,
            });


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchTransactions = async () => {
        const response = await fetch('/api/fetch-data/orders',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            Notiflix.Notify.failure("Failed to fetch transactions");
        }

        const data = await response.json();
        console.log(data);
        if (data === null) {
            setBookedItems({} as any);
        } else {
            setBookedItems(data.data);
        }
    }

    const formatDate = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="w-full h-full p-8 overflow-y-auto overflow-x-hidden custom-overflow">
            <h1>Orders</h1>
            <hr className="my-4" />

            <div>
                <Tabs aria-label="booking-category">
                    <Tab key="stays" title="Stays">
                        {boookedItems.stay && boookedItems.stay.length !== 0 ? (
                            <Table aria-label="Stay Bookings" shadow='none'>
                                <TableHeader>
                                    <TableColumn>Payment ID</TableColumn>
                                    <TableColumn>Description</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {boookedItems.stay.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                #{item.payment_id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-y-1">
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Customer Name</span>
                                                        {item.firstName} <span className='text-[12px] bg-primary rounded-full text-white px-2'>{item.email}</span>
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Property Name</span>
                                                        {allItems.stay.find((stay) => stay.id === item.property_id)?.placeName}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Price</span>
                                                        ${item.price}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Guest Count</span>
                                                        {item.details.guestCount} Guests
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Booking Dates</span>
                                                        {item.details.bookingDates.map((date: string) => (
                                                            <span key={date} className="ms-2 my-1 px-2 text-[12px] bg-neutral-100 rounded-full">
                                                                {date}
                                                            </span>
                                                        ))}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Ordered Date</span>
                                                        {formatDate(item.inserted_date)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className={`text-center w-full col-span-full`}>
                                <p className={`text-xl`}>
                                    No booked stay items
                                </p>
                            </div>
                        )
                        }
                    </Tab>
                    <Tab key="tours" title="Tours">
                        {boookedItems.tour && boookedItems.tour.length !== 0 ? (
                            <Table aria-label="Tour Bookings" shadow='none'>
                                <TableHeader>
                                    <TableColumn>Payment ID</TableColumn>
                                    <TableColumn>Description</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {boookedItems.tour.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                #{item.payment_id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-y-1">
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Customer Name</span>
                                                        {item.firstName} <span className='text-[12px] bg-primary rounded-full text-white px-2'>{item.email}</span>
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Tour Title</span>
                                                        {allItems.tour.find((tour) => tour.id === item.property_id)?.title}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Price</span>
                                                        ${item.price}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Booking Dates</span>
                                                        {item.details.bookingDates.map((date: string) => (
                                                            <span key={date} className="ms-2 my-1 px-2 text-[12px] bg-neutral-100 rounded-full">
                                                                {date}
                                                            </span>
                                                        ))}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Ordered Date</span>
                                                        {formatDate(item.inserted_date)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className={`text-center w-full col-span-full`}>
                                <p className={`text-xl`}>
                                    No booked tour items
                                </p>
                            </div>
                        )
                        }
                    </Tab>
                    <Tab key="rentals" title="Rentals">
                        {boookedItems.rental && boookedItems.rental.length !== 0 ? (
                            <Table aria-label="Rental Bookings" shadow='none'>
                                <TableHeader>
                                    <TableColumn>Payment ID</TableColumn>
                                    <TableColumn>Description</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {boookedItems.rental.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                #{item.payment_id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-y-1">
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Customer Name</span>
                                                        {item.firstName} <span className='text-[12px] bg-primary rounded-full text-white px-2'>{item.email}</span>
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Vehicle</span>
                                                        {allItems.rental.find((rental) => rental.id === item.property_id)?.vehicleBrand} {allItems.rental.find((rental) => rental.id === item.property_id)?.model}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Price</span>
                                                        ${item.price}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Booking Dates</span>
                                                        {item.details.bookingDates.map((date: string) => (
                                                            <span key={date} className="ms-2 my-1 px-2 text-[12px] bg-neutral-100 rounded-full">
                                                                {date}
                                                            </span>
                                                        ))}
                                                    </p>
                                                    <p>
                                                        <span className="text-[10px] me-3 font-bold">Ordered Date</span>
                                                        {formatDate(item.inserted_date)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className={`text-center w-full col-span-full`}>
                                <p className={`text-xl`}>
                                    No booked rental items
                                </p>
                            </div>
                        )
                        }
                    </Tab>
                </Tabs>
            </div>

        </div>
    )
}

export default Orders;
