"use client"
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import InputWLabel from "@/elements/InputWLabel";
import PrimaryButton from "@/elements/PrimaryButton";
import SecondaryButton from "@/elements/SecondaryButton";
import SelectWLabel from "@/elements/SelectWLabel";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, DatePicker, Divider, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@nextui-org/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Notiflix from "notiflix";
import { SetStateAction, useEffect, useState } from "react";
import { BsEye, BsTrash } from "react-icons/bs";

const Page = () => {
    interface UserDetails {
        email: string;
        id?: string;
        firstName?: string;
        lastName?: string;
        mobile?: string;
        gender?: string;
        birthday?: string;
        country?: string;
        language?: string;
    }

    const [userDetails, setuserDetails] = useState<UserDetails>({ email: '' });
    const [resetPassword, setResetPassword] = useState({});
    const [genderOptions, setGenderOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [languageOptions, setLanguageOptions] = useState([]);
    const [defaultSelectedSection, setDefaultSelectedSection] = useState('my-bookings');

    const searchParams = useSearchParams();
    const section = searchParams.get('section');
    useEffect(() => {
        if (section) {
            setDefaultSelectedSection(section);
        }
    }, [section]);

    useEffect(() => {
        if (defaultSelectedSection !== '') {
            window.history.replaceState({}, document.title, "/profile/" + defaultSelectedSection);
        }
    }, [defaultSelectedSection]);

    const [passwordSection, setPasswordSection] = useState(false);

    const fetchList = [
        {
            "setter": setGenderOptions,
            "table": "gender",
        },
        {
            "setter": setCountryOptions,
            "table": "country",
        },
        {
            "setter": setLanguageOptions,
            "table": "language",
        }
    ]

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to fetch user', errorData);
                throw new Error(`Failed to fetch user: ${errorData?.error || response.statusText}`);
            }
            const data = await response.json();

            try {
                const response = await fetch('/api/profile/fetch-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: data.email, id: data.id })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to fetch user', errorData);
                    throw new Error(`Failed to fetch user: ${errorData?.error || response.statusText}`);
                }
                const userData = await response.json();
                setuserDetails(userData);
                Notiflix.Loading.remove();
            } catch (error) {
                console.error('Failed to fetch user', error || response.statusText);
            }

        } catch (error) {
            console.error('Failed to fetch user', error);
            Notiflix.Notify.failure('You are not logged in');
            Notiflix.Loading.circle('Redirecting to login page');
            setTimeout(() => {
                window.location.href = '/sign-in';
            }, 2000);
        }
    };

    const fetchListData = async (setter: { (value: SetStateAction<never[]>): void; (arg0: any): void; }, table: string) => {
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tb: table })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Failed to fetch ${table}`, errorData);
                throw new Error(`Failed to fetch ${table}: ${errorData?.error || response.statusText}`);
            }
            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error(`Failed to fetch ${table}`, error);
        }
    }

    useEffect(() => {
        Notiflix.Loading.circle('Fetching user data');
        fetchList.forEach((item) => {
            fetchListData(item.setter, item.table);
        });
        fetchUser().then(() => {
            Notiflix.Loading.remove();
        });

    }, []);

    const changeHandler = (e: any) => {
        let { name, value } = e.target;

        if (name === 'birthday') {
            value = value.year + '-' + value.month + '-' + value.day;
        }

        if (name.includes('Password')) {
            setResetPassword((prevState: any) => ({
                ...prevState,
                [name]: value
            }));
            return;
        }

        setuserDetails((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    }

    const submitHandler = async () => {
        try {
            setuserDetails((prevState: any) => ({
                ...prevState,
                ['password']: 'false'
            }));
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails)
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update user', errorData);
                throw new Error(`Failed to update user: ${errorData.message}`);
            }
            Notiflix.Notify.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update user', error);
            Notiflix.Notify.failure(`Failed to update profile ${error}`);
        }
    }

    const submitPasswordHandler = async () => {
        // @ts-ignore
        if (resetPassword['newPassword'] !== resetPassword['confirmPassword']) {
            Notiflix.Notify.failure('Passwords do not match');
            return;
            // @ts-ignore
        } else if (resetPassword['newPassword'].length < 8) {
            Notiflix.Notify.failure('Password must be at least 8 characters');
            return;
            // @ts-ignore
        } else if (resetPassword['newPassword'] === resetPassword['currentPassword']) {
            Notiflix.Notify.failure('New password must be different from current password');
            return;
        } else {
            try {

                setResetPassword((prevState: any) => ({
                    ...prevState,
                    // @ts-ignore
                    ['id']: userDetails['id'],
                    // @ts-ignore
                    ['email']: userDetails['email'],
                    ['password']: 'true'
                }));


                const response = await fetch('/api/profile/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(resetPassword)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to update user', errorData);
                    throw new Error(`Failed to update user: ${errorData?.error || response.statusText}`);
                }
                Notiflix.Notify.success('Password updated successfully');
            } catch (error) {
                console.error('Failed to update user', error);
                Notiflix.Notify.failure('Failed to update password');
            }
        }
    }

    const [, setIsFlight] = useState(false);

    interface SavedItems {
        stay: StayItem[];
        tour: TourItem[];
        rental: RentalItem[];
    }

    const [savedItemsList, setSavedItemsList] = useState<SavedItems>({
        stay: [],
        tour: [],
        rental: [],
    });

    const [boookedItems, setBookedItems] = useState<SavedItems>({
        stay: [],
        tour: [],
        rental: [],
    });

    const [allItems, setAllItems] = useState<SavedItems>({
        stay: [],
        tour: [],
        rental: [],
    });

    interface StayItem {
        id: string;
        placeName: string;
        propertyType: string;
        location: string;
        coverImage: string;
    }

    interface TourItem {
        id: string;
        title: string;
        location: string;
        tourCategory: string;
        tourType: string;
        images: { name: string }[];
    }

    interface RentalItem {
        id: string;
        vehicleBrand: string;
        model: string;
        manufactureYear: string;
        location: string;
        fuelType: string;
        transmissionType: string;
        images: { ref: string }[];
    }

    interface SavedItems {
        stay: StayItem[];
        tour: TourItem[];
        rental: RentalItem[];
    }

    const [savedItems, setSavedItems] = useState<SavedItems>({
        stay: [],
        tour: [],
        rental: [],
    });

    const fetchSavedItems = async () => {
        const response = await fetch(
            `/api/user/manage-saved?email=${userDetails.email}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            Notiflix.Notify.failure("Failed to fetch saved items");
        }

        const data = await response.json();
        if (data === null) {
            setSavedItemsList({} as SavedItems);
        } else {
            setSavedItemsList(data);
        }

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

    };

    const fetchTransactions = async () => {
        const response = await fetch(
            `/api/user/manage-transaction?id=${userDetails.id}`,
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
        if (data === null) {
            setBookedItems({} as SavedItems);
        } else {
            setBookedItems(data.data);
        }
    }

    const handleRemoveSavedItem = async (id: string, type: string) => {
        // @ts-ignore
        const updatedSavedItems = savedItemsList[type].filter((item) => item !== id);
        setSavedItemsList((prevState) => ({
            ...prevState,
            [type]: updatedSavedItems,
        }));

        try {
            const response = await fetch('/api/user/manage-saved', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userDetails.email,
                    savedItem: {
                        ...savedItemsList,
                        [type]: updatedSavedItems,
                    },
                }),
            });

            if (!response.ok) {
                Notiflix.Notify.failure('Failed to remove item');
            } else {
                Notiflix.Notify.success('Item removed successfully');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            Notiflix.Notify.failure('Failed to remove item from saved list');
        }
    }

    useEffect(() => {
        if (userDetails.email !== '') {
            fetchSavedItems();
            fetchTransactions();
        }
    }, [userDetails]);

    useEffect(() => {
        if (allItems.stay && savedItemsList.stay) {
            // @ts-ignore
            const savedStayItems = allItems.stay.filter((item) => savedItemsList.stay.includes(item.id.toString()));
            setSavedItems((prevState) => ({
                ...prevState,
                stay: savedStayItems,
            }));
        }

        if (allItems.tour && savedItemsList.tour) {
            // @ts-ignore
            const savedTourItems = allItems.tour.filter((item) => savedItemsList.tour.includes(item.id.toString()));
            setSavedItems((prevState) => ({
                ...prevState,
                tour: savedTourItems,
            }));
        }

        if (allItems.rental && savedItemsList.rental) {
            // @ts-ignore
            const savedRentalItems = allItems.rental.filter((item) => savedItemsList.rental.includes(item.id.toString()));
            setSavedItems((prevState) => ({
                ...prevState,
                rental: savedRentalItems,
            }));
        }

    }, [allItems, savedItemsList]);

    const formatDate = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero to month
        const day = String(d.getDate()).padStart(2, '0'); // Add leading zero to day
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <Navigation />
            <div className={`w-full h-auto`}>
                <div className={`w-full max-w-[1300px] mx-auto p-5`}>
                    <Tabs variant="underlined" color="primary" selectedKey={defaultSelectedSection}>
                        <Tab key="my-bookings" title={
                            <div onClick={() => { setDefaultSelectedSection('my-bookings') }}>
                                <span>My Bookings</span>
                                <Chip className="ms-2" size="sm">{boookedItems.stay?.length + boookedItems.tour?.length + boookedItems.rental?.length}</Chip>
                            </div>
                        }>

                            <div className={`w-full p-5 rounded-2xl`}>
                                <h1 className={`text-2xl text-center`}>
                                    My Bookings
                                </h1>
                                <Divider className={'my-5'} />

                                <Tabs aria-label="booking-category">
                                    <Tab key="stays" title="Stays">
                                        {boookedItems.stay && boookedItems.stay.length !== 0 ? (
                                            <Table aria-label="Stay Bookings" shadow="none">
                                                <TableHeader>
                                                    <TableColumn>Payment ID</TableColumn>
                                                    <TableColumn>Description</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {boookedItems.stay.map((item: any) => (
                                                        <TableRow key={item.id} className="border-b">
                                                            <TableCell>
                                                                #{item.payment_id}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-y-1">
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
                                            <Table aria-label="Tour Bookings" shadow="none">
                                                <TableHeader>
                                                    <TableColumn>Payment ID</TableColumn>
                                                    <TableColumn>Description</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {boookedItems.tour.map((item: any) => (
                                                        <TableRow key={item.id} className="border-b">
                                                            <TableCell>
                                                                #{item.payment_id}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-y-1">
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
                                            <Table aria-label="Rental Bookings" shadow="none">
                                                <TableHeader>
                                                    <TableColumn>Payment ID</TableColumn>
                                                    <TableColumn>Description</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {boookedItems.rental.map((item: any) => (
                                                        <TableRow key={item.id} className="border-b">
                                                            <TableCell>
                                                                #{item.payment_id}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-y-1">
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

                        </Tab>
                        <Tab key="saved" title={
                            <div onClick={() => { setDefaultSelectedSection('saved') }}>
                                <span>Saved Items</span>
                                <Chip className="ms-2" size="sm">{savedItems.stay?.length + savedItems.tour?.length + savedItems.rental?.length}</Chip>
                            </div>
                        }>
                            <div className={`w-full p-5 rounded-2xl`}>
                                <h1 className={`text-2xl text-center`}>
                                    Saved Items
                                </h1>
                                <Divider className={'my-5'} />
                                {savedItems.stay || savedItems.tour || savedItems.rental ? (
                                    <Tabs>
                                        <Tab key="stay" title="Stay">
                                            <div className="grid grid-cols-4 gap-4">
                                                {savedItems.stay && savedItems.stay.length !== 0 && savedItems.stay.map((item) => (
                                                    <Card key={item.id} className="border" shadow="none">
                                                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                            <h4 className="text-large">{item.placeName}</h4>
                                                            <p className="text-tiny uppercase">{item.propertyType}</p>
                                                            <small className="text-default-500">{item.location}</small>
                                                        </CardHeader>
                                                        <CardBody className="overflow-visible py-2">
                                                            <Image
                                                                alt="Card background"
                                                                className="object-cover rounded-xl aspect-video w-full"
                                                                src={item.coverImage}
                                                                width={400}
                                                                height={200}
                                                            />
                                                        </CardBody>
                                                        <CardFooter className="flex justify-between items-center px-4 gap-x-2">
                                                            <Button size="sm" className="w-full bg-primary text-white" onClick={() => {
                                                                window.open(`/stay/detail?id=${item.id}`), '_blank';
                                                            }}>
                                                                View <BsEye />
                                                            </Button>
                                                            <Button size="sm" isIconOnly onClick={() => {
                                                                handleRemoveSavedItem(`${item.id}`, 'stay');
                                                            }}>
                                                                <BsTrash />
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>

                                                )) || (
                                                        <div className={`text-center w-full col-span-full`}>
                                                            <p className={`text-xl`}>
                                                                No saved stay items
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        </Tab>
                                        <Tab key="tour" title="Tour">
                                            <div className="grid grid-cols-4 gap-4">
                                                {savedItems.tour && savedItems.tour.length !== 0 && savedItems.tour.map((item) => (
                                                    <Card key={item.id} className="border" shadow="none">
                                                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                            <h4 className="text-large">{item.title}</h4>
                                                            <p className="text-tiny uppercase">{item.location}</p>
                                                            <small className="text-default-500 flex items-center gap-x-3 w-full">{item.tourCategory} <Divider orientation="vertical" className="h-3" /> {item.tourType}</small>
                                                        </CardHeader>
                                                        <CardBody className="overflow-visible py-2">
                                                            <Image
                                                                alt="Card background"
                                                                className="object-cover rounded-xl aspect-video w-full"
                                                                src={item.images[0].name}
                                                                width={400}
                                                                height={200}
                                                            />
                                                        </CardBody>
                                                        <CardFooter className="flex justify-between items-center px-4 gap-x-2">
                                                            <Button size="sm" className="w-full bg-primary text-white" onClick={() => {
                                                                window.open(`/tours/detail?id=${item.id}`), '_blank';
                                                            }}>
                                                                View <BsEye />
                                                            </Button>
                                                            <Button size="sm" isIconOnly onClick={() => {
                                                                handleRemoveSavedItem(`${item.id}`, 'tour');
                                                            }}>
                                                                <BsTrash />
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                )) || (
                                                        <div className={`text-center w-full col-span-full`}>
                                                            <p className={`text-xl`}>
                                                                No saved tour items
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        </Tab>
                                        <Tab key="rental" title="Rental">
                                            <div className="grid grid-cols-4 gap-4">
                                                {savedItems.rental && savedItems.rental.length !== 0 && savedItems.rental.map((item) => (
                                                    <Card key={item.id} className="border" shadow="none">
                                                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                            <h4 className="text-large">
                                                                {item.vehicleBrand} {item.model} {item.manufactureYear}
                                                            </h4>
                                                            <p className="text-tiny uppercase">{item.location}</p>
                                                            <small className="text-default-500 flex items-center gap-x-3 w-full">{item.fuelType} <Divider orientation="vertical" className="h-3" /> {item.transmissionType}</small>
                                                        </CardHeader>
                                                        <CardBody className="overflow-visible py-2">
                                                            <Image
                                                                alt="Card background"
                                                                className="object-cover rounded-xl aspect-video w-full"
                                                                src={item.images[0].ref}
                                                                width={400}
                                                                height={200}
                                                            />
                                                        </CardBody>
                                                        <CardFooter className="flex justify-between items-center px-4 gap-x-2">
                                                            <Button size="sm" className="w-full bg-primary text-white" onClick={() => {
                                                                window.open(`/rental/detail?id=${item.id}`), '_blank';
                                                            }}>
                                                                View <BsEye />
                                                            </Button>
                                                            <Button size="sm" isIconOnly onClick={() => {
                                                                handleRemoveSavedItem(`${item.id}`, 'rental');
                                                            }}>
                                                                <BsTrash />
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                )) || (
                                                        <div className={`text-center w-full col-span-full`}>
                                                            <p className={`text-xl`}>
                                                                No saved rental items
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                ) : (
                                    <div className={`text-center w-full col-span-full`}>
                                        <p className={`text-xl`}>
                                            No saved items
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Tab>
                        <Tab key="settings" title={
                            <div onClick={() => { setDefaultSelectedSection('settings') }}>
                                <span>Settings</span>
                            </div>
                        }>
                            <div className={`w-full p-5 rounded-2xl`}>

                                <h1 className={`text-2xl text-center`}>
                                    Account Information
                                </h1>

                                <Divider className={'my-5'} />

                                {passwordSection ? (
                                    <div className={`grid grid-cols-1 gap-5`}>
                                        {/*@ts-ignore*/}
                                        <InputWLabel placeHolder={'*****'} name={'currentPassword'} label={'Current Password'} inputType={'password'} handler={changeHandler} value={resetPassword['currentPassword']} />
                                        {/*@ts-ignore*/}
                                        <InputWLabel placeHolder={'*****'} name={'newPassword'} label={'New Password'} inputType={'password'} handler={changeHandler} value={resetPassword['newPassword']} />
                                        {/*@ts-ignore*/}
                                        <InputWLabel placeHolder={'*****'} name={'confirmPassword'} label={'Confirm Password'} inputType={'password'} handler={changeHandler} value={resetPassword['confirmPassword']} />
                                    </div>
                                ) : (
                                    <div className={`w-full`}>
                                        <p className={`text-xl py-5`}>
                                            {/*@ts-ignore*/}
                                            Hello {userDetails['firstName']}
                                        </p>
                                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5`}>
                                            {/*@ts-ignore*/}
                                            <InputWLabel label={'First Name'} inputType={'text'} placeHolder={'First Name'} handler={changeHandler} name={'firstName'} value={userDetails['firstName']} />
                                            {/*@ts-ignore*/}
                                            <InputWLabel label={'Last Name'} inputType={'text'} placeHolder={'Last Name'} handler={changeHandler} name={'lastName'} value={userDetails['lastName']} />
                                            {/*@ts-ignore*/}
                                            <InputWLabel label={'Email Address'} inputType={'email'} placeHolder={'Email Address'} handler={changeHandler} name={'email'} value={userDetails['email']} />
                                            {/*@ts-ignore*/}
                                            <InputWLabel label={'Phone Number'} inputType={'text'} placeHolder={'Phone Number'} handler={changeHandler} name={'mobile'} value={userDetails['mobile']} />
                                            {/*@ts-ignore*/}
                                            <SelectWLabel label={'Gender'} options={genderOptions} handler={changeHandler} name={'gender'} defaultSelectedItem={userDetails['gender']} />
                                            <div className={`relative`}>
                                                <DatePicker showMonthAndYearPickers={true} name={'birthday'} label={'Date of Birth'} onChange={(e) => {
                                                    changeHandler({ target: { name: 'birthday', value: e } });
                                                }}
                                                    labelPlacement={'outside'} />
                                                <div className={`bg-neutral-100 w-[90%] absolute top-9 left-3 flex flex-col text-sm`}>
                                                    {/*@ts-ignore*/}
                                                    {userDetails['birthday'] ? (
                                                        <p className={`text-gray-500`}>
                                                            {/*@ts-ignore*/}
                                                            {new Date(userDetails['birthday']).toLocaleDateString()}
                                                        </p>
                                                    ) : (
                                                        <p className={`text-gray-500`}>
                                                            Please select your date of birth
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {/*@ts-ignore*/}
                                            <SelectWLabel label={'Country'} options={countryOptions} handler={changeHandler} name={'country'} defaultSelectedItem={userDetails['country']} />
                                            {/*@ts-ignore*/}
                                            <SelectWLabel label={'Language'} options={languageOptions} handler={changeHandler} name={'language'} defaultSelectedItem={userDetails['language']} />
                                        </div>
                                    </div>
                                )}

                                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5`}>
                                    {
                                        passwordSection ? (
                                            <PrimaryButton content={'Update Password'} events={submitPasswordHandler} className={''} />
                                        ) : (
                                            <PrimaryButton content={'Update'} events={submitHandler} className={''} />
                                        )
                                    }
                                    <SecondaryButton content={passwordSection ? 'Back' : 'Change Password'} events={() => {
                                        setPasswordSection(!passwordSection);
                                    }} className={''} />
                                </div>

                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <Footer setIsFlight={setIsFlight} />
        </>

    );
}
export default Page;
