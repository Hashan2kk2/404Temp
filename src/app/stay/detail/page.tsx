/* eslint-disable @next/next/no-img-element */
"use client";
import Navigation from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  BsArrowBarUp,
  BsCalendar4,
  BsCheckCircleFill,
  BsDot,
  BsHeart,
  BsPerson,
  BsPersonPlus,
} from "react-icons/bs";
import Label from "@/elements/Label";
import React, { Suspense, useEffect, useState } from "react";
import { IoBedOutline } from "react-icons/io5";
import { LiaBathSolid, LiaDoorOpenSolid } from "react-icons/lia";
import Footer from "@/components/Footer";
import NewsLetter from "@/components/NewsLetter";
import PrimaryButton from "@/elements/PrimaryButton";
import DateRangePick from "@/elements/DateRangePick";
import GuestsDropDown from "@/elements/GuestsDropDown";
import { useSearchParams } from "next/navigation";
import { all } from "deepmerge";
import Notiflix from "notiflix";
import CustomerReview from "@/components/CustomerReview";
import StarDisplay from "@/elements/StarDisplay";

const DetailPage = () => {
  const [dateRangePickerCustom, setDateRangePickerCustom] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [dataset, setDataset] = useState<any>([]);
  const [userDetails, setUserDetails] = useState({
    id: "",
    role: "",
    email: "",
    name: "",
  });

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (response.ok) {
        setUserDetails((prevState) => ({
          ...prevState,
          id: data.id,
          role: data.role,
          email: data.email,
          name: data.name ? data.name : data.firstName,
        }));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSingleData = async () => {
    try {
      const response = await fetch(`/api/fetch-data/listing?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tb: "all", id: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const res = await response.json();

      const parsedDescription = res[0].description
        ? JSON.parse(res[0].description)
        : {};
      res[0].description = parsedDescription;
      setDataset(res);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    Notiflix.Loading.pulse();
    fetchSingleData().then(() => {
      Notiflix.Loading.remove();
    });
    fetchUser().then((r) => r);
  }, [id]);

  const [formData, setFormData] = useState({
    checkInCheckOut: "",
    guestCount: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleListingBooking = async () => {
    Notiflix.Loading.circle("Submitting...");

    if (formData.checkInCheckOut === "" || formData.guestCount === "") {
      Notiflix.Loading.remove();
      Notiflix.Notify.warning("Please fill the required fields");
    } else {
      const response = await fetch(
        "https://formsubmit.co/ajax/info@404travels.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            "Mail Type": "Stay Booking",
            "Stay Name": dataset[0] && dataset[0].placeName,
            "Check In - Check Out": formData.checkInCheckOut,
            "Booking Date": new Date().toLocaleDateString(),
            "Booking Customer": userDetails.name,
            "Customer Email": userDetails.email,
            _template: "table",
          }),
        }
      );
      if (!response.ok) {
        Notiflix.Notify.failure("Failed to submit");
      } else {
        Notiflix.Notify.success("Submitted successfully");
      }
      Notiflix.Loading.remove();
    }
  };

  const pricingData = dataset[0]?.description?.pricing
    ? [
      {
        name: "Base Price for Weekdays",
        value: `$ ${dataset[0].description.pricing.basePriceForWeekdays}`,
      },
      {
        name: "Base Price for Weekends",
        value: `$ ${dataset[0].description.pricing.basePriceForWeekends}`,
      },
      {
        name: "Monthly Discount",
        value: `${dataset[0].description.pricing.monthlyDiscount}%`,
      },
    ]
    : [];

    const [isFlight, setIsFlight] = useState(false);
  
  return (
    <Suspense
      fallback={
        <div className={`w-full h-screen flex justify-center items-center`}>
          <div className={`text-2xl`}>Loading...</div>
        </div>
      }
    >
      <div className="w-full mx-auto dark:bg-gray-900">
        <Navigation />
        <div className={`w-full max-w-[1300px] mx-auto mt-5`}>
          <div
            className={`w-full h-auto grid grid-cols-4 grid-rows-4 md:grid-rows-2 gap-2 relative`}
          >
            {/*get the images from fetched data*/}
            {/*@ts-ignore*/}
            {dataset[0] &&
              dataset[0].images.slice(0, 5).map((image: any, index: number) => (
                <div
                  key={index}
                  className={`${index === 0
                    ? "col-span-3 row-span-4 md:col-span-2 md:row-span-2 "
                    : "col-span-1 row-span-1 md:col-span-1 md:row-span-1 aspect-video-horizontal-landscape"
                    } rounded-xl overflow-clip hover:brightness-75 transition-all duration-300 cursor-pointer bg-cover bg-center`}
                >
                  <img
                    src={`..${image}`}
                    alt="image"
                    className={`w-full h-full object-cover rounded-xl`}
                  />
                </div>
              ))}

            {/* <Button
                            className={`absolute bottom-3 left-3 bg-white text-black flex items-center justify-center px-4 rounded-xl hover:opacity-80`}><BsGrid /> Show
                            all photos</Button> */}
          </div>

          <div className={`w-full grid grid-cols-6 gap-3`}>
            <div className={`col-span-full md:col-span-3 lg:col-span-4`}>
              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] dark:border-neutral-600 border-neutral-200 gap-y-5 mt-10`}
              >
                <div className={`w-full flex justify-between items-center`}>
                  <Label
                    text={"Wooden house"}
                    textColor={"text-blue-800"}
                    bgColor={"bg-blue-100"}
                  />
                  <div className={`flex gap-x-5`}>
                    <button
                      className={`flex justify-center items-center p-2 gap-x-3 bg-transparent cursor-not-allowed`}
                    >
                      <BsArrowBarUp />
                      Share
                    </button>
                    <button
                      className={`flex justify-center items-center p-2 gap-x-3 bg-transparent cursor-not-allowed`}
                    >
                      <BsHeart />
                      Save
                    </button>
                  </div>
                </div>

                <h1 className={`text-3xl font-semibold`}>
                  {dataset[0] && dataset[0].placeName}
                </h1>
                <p>{dataset[0] && dataset[0].property_description}</p>

                <div className={`flex gap-x-2 items-center`}>
                  <StarDisplay
                    value={dataset[0]?.review}
                    fontClass={`text-orange-600`}
                  />
                  <span>Reviews</span>
                </div>

                {/* <div className={`w-full flex gap-x-5 text-sm item-center`}>
                                    <div className={`w-12 h-12 bg-neutral-100 rounded-full relative`}>
                                        <img aria-label="image" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                                            alt="clientSayMain"
                                            className={`w-full h-full absolute top-0 left-0 object-contain rounded-full `} />
                                        <BsCheckCircleFill
                                            className={`absolute right-0 top-0 text-green-500 bg-white rounded-full`} />
                                    </div>
                                    <p className={`flex items-center text-neutral-500 dark:text-neutral-100`}>Hosted by</p>
                                    <strong className={`flex items-center`}>Kevin Francis</strong>
                                </div> */}

                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600`}
                />

                <div
                  className={`w-full flex gap-x-8 text-neutral-700 dark:text-neutral-300`}
                >
                  <div className={`flex gap-x-3 items-center justify-center`}>
                    <BsPerson />
                    <p>{dataset[0] && dataset[0].guests} guests</p>
                  </div>
                  <div className={`flex gap-x-3 items-center justify-center`}>
                    <IoBedOutline />
                    <p>{dataset[0] && dataset[0].beds} beds</p>
                  </div>
                  <div className={`flex gap-x-3 items-center justify-center`}>
                    <LiaBathSolid />
                    <p>{dataset[0] && dataset[0].bathrooms} baths</p>
                  </div>
                  <div className={`flex gap-x-3 items-center justify-center`}>
                    <LiaDoorOpenSolid />
                    <p>{dataset[0] && dataset[0].bedrooms} bedrooms</p>
                  </div>
                </div>
              </div>

              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
              >
                <h2 className={`text-3xl font-semibold `}>Stay information</h2>
                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                />
                <div
                  className={`text-neutral-700 dark:text-neutral-300 flex flex-col gap-y-2`}
                >
                  <p className="text-2xl">Amenities:</p>
                  <ul>
                    {dataset[0] &&
                      dataset[0].description?.amenities &&
                      Object.keys(dataset[0].description.amenities).map(
                        (category) => (
                          <li key={category} className="mt-2">
                            <span className="font-bold">
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                              :
                            </span>
                            <ul className="text-sm text-neutral-600">
                              {dataset[0].description.amenities[category].map(
                                (amenity: any, index: any) => (
                                  <li key={index}>{amenity}</li>
                                )
                              )}
                            </ul>
                          </li>
                        )
                      )}
                  </ul>

                  <p className="mt-4 text-2xl">Rules for Guests:</p>
                  <ul className="text-sm text-neutral-600">
                    {dataset[0] &&
                      dataset[0].description?.rulesForGuests &&
                      dataset[0].description.rulesForGuests.map(
                        (rule: any, index: any) => {
                          let ruleValue;
                          switch (rule.value) {
                            case "Charge":
                              ruleValue = "Will Be Extra Charge";
                              break;
                            case "Allow":
                              ruleValue = "allowed";
                              break;
                            case "Do Not Allow":
                              ruleValue = "not allowed";
                              break;
                            default:
                              ruleValue = rule.value; // Default to original value if it's something else
                          }

                          return (
                            <li
                              key={index}
                              className="flex items-center mt-2 gap-x-3"
                            >
                              <BsCheckCircleFill className="text-primary-900" />
                              <span>
                                {rule.name.charAt(0).toUpperCase() +
                                  rule.name.slice(1)}{" "}
                                :
                              </span>
                              <span>{ruleValue}</span>
                            </li>
                          );
                        }
                      )}
                  </ul>

                  {/* <p>
                                        {
                                            // @ts-ignore
                                            dataset[0] && dataset[0].description

                                        }
                                    </p> */}
                </div>
              </div>

              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
              >
                <h2 className={`text-3xl font-semibold `}>Amenities</h2>
                <p className={`text-neutral-500 dark:text-neutral-100`}>
                  About the property&apos;s amenities and services
                </p>
                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                />
                <div className={`w-full grid grid-cols-2 md:grid-cols-3 gap-5`}>
                  {dataset[0] &&
                    dataset[0].description?.amenities &&
                    Object.keys(dataset[0].description.amenities).map(
                      (category) =>
                        dataset[0].description.amenities[category].map(
                          (amenity: any, index: any) => (
                            <div
                              key={index}
                              className={`flex gap-x-2 items-center`}
                            >
                              <BsCheckCircleFill className={`text-green-500`} />
                              <p>{amenity}</p>
                            </div>
                          )
                        )
                    )}
                </div>

                {/* <hr className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`} /> */}
                {/* <SecondaryButton content={'View more 20 amenities'} className={'w-fit'} events={''} /> */}
              </div>

              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
              >
                <h2 className={`text-3xl font-semibold `}>Room Rates</h2>
                <p className={`text-neutral-500 dark:text-neutral-100`}>
                  Prices may increase on weekends or holidays
                </p>
                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                />
                <Table
                  classNames={{
                    tr: "h-14",
                  }}
                  removeWrapper={true}
                  radius={"sm"}
                  shadow={"none"}
                  isStriped={true}
                  hideHeader={true}
                >
                  <TableHeader>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Value</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {pricingData.map((rate, index) => (
                      <TableRow key={index}>
                        <TableCell>{rate.name}</TableCell>
                        <TableCell>{rate.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {dataset[0]?.mapUrl && (
                <div
                  className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
                >
                  <h2 className={`text-3xl font-semibold `}>Location</h2>
                  <p className={`text-neutral-500 dark:text-neutral-100`}>
                    {dataset[0] && dataset[0].location}
                  </p>
                  <hr
                    className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                  />
                  <div className={`w-full h-[400px] bg-gray-200 rounded-xl`}>
                    <iframe
                      src={dataset[0]?.mapUrl}
                      className={`w-full h-full rounded-xl`}
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              )}

              <CustomerReview
                itemId={dataset[0]?.id}
                userId={userDetails.id}
                userRole={userDetails.role}
                type="property_listing"
              />

              {/* <div
                                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}>
                                <h2 className={`text-3xl font-semibold `}>Availability</h2>
                                <p className={`text-neutral-500 dark:text-neutral-100`}>Prices may increase on weekends or
                                    holidays</p>
                                <hr className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`} />
                                <div className="grid items-center justify-center grid-cols-2 gap-x-4">
                                    <RangeCalendar
                                        className={`shadow-none`}
                                        aria-label="Date (No Selection)" />
                                    <RangeCalendar
                                        className={`shadow-none`}
                                        aria-label="Date (Uncontrolled)"
                                        defaultValue={{
                                            start: today(getLocalTimeZone()),
                                            end: today(getLocalTimeZone()).add({ weeks: 1 }),
                                        }}
                                    />
                                </div>
                            </div> */}

              {/* <div
                                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}>
                                <h2 className={`text-3xl font-semibold `}>Things to know</h2>
                                <hr className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`} />

                                <div className={`w-full flex flex-col`}>
                                    <h3 className={`text-xl font-semibold `}>Cancellation policy</h3>
                                    <p className={`mt-5`}> Refund 50% of the booking value when customers cancel the room
                                        within 48 hours after
                                        successful booking and 14 days before the check-in time.</p>
                                    <p> Then, cancel the room 14 days before the check-in time, get a 50% refund of the
                                        total amount paid (minus the service fee).</p>
                                </div>
                                <hr className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`} />

                                <div className={`w-full flex flex-col`}>
                                    <h3 className={`text-xl font-semibold  mt-5`}>Check-in time</h3>
                                    <Table classNames={{
                                        tr: 'h-14',
                                    }}
                                        removeWrapper={true}
                                        radius={'sm'}
                                        shadow={'none'}
                                        isStriped={true} hideHeader={true}>
                                        <TableHeader>
                                            <TableColumn>Name</TableColumn>
                                            <TableColumn>Value</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Check-in</TableCell>
                                                <TableCell>08:00 am - 12:00 am</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Check-out</TableCell>
                                                <TableCell>02:00 pm - 04:00 pm</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                <hr className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`} />

                                <div className={`w-full flex flex-col`}>
                                    <h3 className={`text-xl font-semibold `}>Special Note</h3>
                                    <ul className={`list-disc list-inside mt-5`}>
                                        <li>Ban and I will work together to keep the landscape and environment green and
                                            clean by not littering, not using stimulants and respecting people around.
                                        </li>
                                        <li>Do not sing karaoke past 11:30</li>
                                    </ul>
                                </div>
                            </div> */}
            </div>

            <div className={`col-span-full md:col-span-3 lg:col-span-2`}>
              <div className="max-w-sm mx-auto bg-white dark:bg-[#1f2937] shadow-lg rounded-xl p-6 mt-10 border border-neutral-200 dark:border-neutral-600 sticky top-28">
                <div className="flex flex-col">
                  <div className="flex items-center gap-x-2">
                    <div className="text-2xl font-semibold">
                      {dataset[0]?.description?.pricing
                        ?.basePriceForWeekdays ? (
                        <p className="mb-2">
                          ${" "}
                          {
                            dataset[0]?.description?.pricing
                              ?.basePriceForWeekdays
                          }
                        </p>
                      ) : (
                        <p className="mb-2"></p>
                      )}
                    </div>
                    <p className={`text-neutral-500 dark:text-neutral-100`}>
                      night
                    </p>
                    <small>(Weekdays)</small>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="text-2xl font-semibold">
                      {dataset[0]?.description?.pricing
                        ?.basePriceForWeekends ? (
                        <p className="mb-2">
                          ${" "}
                          {
                            dataset[0]?.description?.pricing
                              ?.basePriceForWeekends
                          }
                        </p>
                      ) : (
                        <p className="mb-2"></p>
                      )}
                    </div>
                    <p className={`text-neutral-500 dark:text-neutral-100`}>
                      night
                    </p>
                    <small>(Weekends)</small>
                  </div>
                  {/* <div className="flex items-center gap-x-1">
                                        <StarDisplay value={4.5} fontClass={`text-orange-600`} />
                                    </div> */}
                </div>
                <div className="flex flex-col gap-4 p-4 mt-6 border border-neutral-200 dark:border-neutral-600 rounded-2xl">
                  <div className="flex items-center">
                    <BsCalendar4 className="text-4xl text-neutral-300" />
                    <DateRangePick
                      dateRangeLabelText={"Check-in - Check-out"}
                      setDateRangePickerCustom={setDateRangePickerCustom}
                      dateRangePickerCustom={dateRangePickerCustom}
                      handler={handleChange}
                      name="checkInCheckOut"
                    />
                  </div>
                  <hr className="my-2" />
                  <div className="flex items-center">
                    <BsPersonPlus className="text-4xl text-neutral-300" />
                    <div className="ps-4">
                      <GuestsDropDown
                        arrowIcon={false}
                        className="font-bold"
                        dropDownClassName="mt-6"
                        handler={handleChange}
                        name="guestCount"
                      />
                      <span className="text-neutral-400">Guests</span>
                    </div>
                  </div>
                </div>
                {/* <div className={`w-full flex flex-col gap-y-4 text-neutral-500 dark:text-neutral-100 mt-5`}>
                                    <div className={`flex w-full justify-between`}>
                                        <p>$119 x 3 night</p>
                                        <p>$357</p>
                                    </div>
                                    <div className={`flex w-full justify-between`}>
                                        <p>Service charge</p>
                                        <p>$0</p>
                                    </div>
                                    <hr className={`w-full border border-neutral-200 dark:border-neutral-600`} />
                                    <div className={`flex w-full justify-between`}>
                                        <p>Total</p>
                                        <p>$357</p>
                                    </div>
                                </div> */}
                <PrimaryButton
                  content={"Reserve"}
                  className={"w-full mt-5"}
                  events={handleListingBooking}
                />
              </div>
            </div>
          </div>

          <NewsLetter />
        </div>
        <Footer setIsFlight={setIsFlight}/>
      </div>
    </Suspense>
  );
};

export default DetailPage;