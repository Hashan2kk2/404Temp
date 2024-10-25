"use client";
import Navigation from "@/components/Navigation";
import {
  BsArrowBarUp,
  BsCalendar4,
  BsCheckCircleFill,
  BsCloudFill,
  BsDot,
  BsHeart,
  BsPersonCircle,
  BsStarFill,
  BsTranslate,
} from "react-icons/bs";
import Label from "@/elements/Label";
import React, { Suspense, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import NewsLetter from "@/components/NewsLetter";
import PrimaryButton from "@/elements/PrimaryButton";
import { useSearchParams } from "next/navigation";
import Notiflix from "notiflix";
import CustomerReview from "@/components/CustomerReview";
import StarDisplay from "@/elements/StarDisplay";
import DateRangePick from "@/elements/DateRangePick";

const DetailPage = () => {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("id");
  const [dateRangePickerCustom, setDateRangePickerCustom] = useState(false);

  const [tourData, setTourData] = useState<any>([]);
  const [tourImages, setTourImages] = useState([]);
  const [userDetails, setUserDetails] = useState({
    id: "",
    role: "",
    email: "",
    name: "",
  });
  const [formData, setFormData] = useState({
    checkInCheckOut: "",
  });

  useEffect(() => {
    Notiflix.Loading.pulse();
    initialFetch().finally(() => Notiflix.Loading.remove());
  }, [searchParams]);

  const initialFetch = async () => {
    await fetchUser();
    await fetchTourDetails(searchParams.get("id"));
  };

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

  const fetchTourDetails = async (tourId: string | null) => {
    try {
      const response = await fetch("/api/fetch-data/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: tourId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch-data");
      }
      const data = await response.json();
      setTourData(data.toursList);
      setTourImages(data.tourImages);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(formData);
  };

  const bookTour = async () => {
    Notiflix.Loading.circle("Booking Tour..");
    const response = await fetch(
      "https://formsubmit.co/ajax/vidhuraneethika000@gmail.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          "Mail Type": "Tour Booking",
          "Tour Name": tourData[0]?.title,
          Price: "$ " + tourData[0]?.price + ".00",
          Host: tourData[0]?.host,
          "Tour Type": tourData[0]?.tourType,
          "Tour Language": tourData[0]?.language,
          "Booking Customer": userDetails.name,
          "Customer Email": userDetails.email,
          "Check In - Check Out": formData.checkInCheckOut,
          _template: "table",
          _subject: "Tour Booking",
        }),
      }
    );
    if (!response.ok) {
      Notiflix.Notify.failure("Booking Failed");
      Notiflix.Loading.remove();
    } else {
      Notiflix.Notify.success("Booking Successful. We will contact you soon.");
      Notiflix.Loading.remove();
    }
    // payNow();
  };

  const payNow = async () => {

    const merchantRID = Math.floor(Math.random() * 100);

    const response = await fetch("https://dev.app.marx.lk/api/v2/ipg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_secret:
          "$2a$10$UWuAe5ffzVQJ5BZSwWJpFuK0G5/djFGpulhpUupAjwl04K/TU6UnO",
      },
      body: JSON.stringify({
        merchantRID: merchantRID,
        amount: 300.0,
        validTimeLimit: 5,
        returnUrl: "https://www.abc.com",
        customerMail: "vidhuraneethika000@gmail.com",
        customerMobile: "0761821354",
        mode: "WEB",
        orderSummary: "Order Description",
        customerReference: "CT2020/09/09/CUST0001",
      }),
    });

    if (!response.ok) {
      Notiflix.Notify.failure("Payment Failed");
    } 

    const data = await response.json();
    console.log(data.data.payUrl);
    window.location.href = data.data.payUrl;

  };

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
            {tourImages.slice(0, 6).map((image: any, index) => (
              <div
                key={index}
                className={`${
                  index === 0
                    ? "col-span-3 row-span-4 md:col-span-2 md:row-span-2 "
                    : "col-span-1 row-span-1 md:col-span-1 md:row-span-1 aspect-video-horizontal-landscape"
                } rounded-xl overflow-clip hover:brightness-75 transition-all duration-300 cursor-pointer bg-cover bg-center`}
              >
                <img
                  src={`..${image.image}`}
                  alt="image"
                  className={`w-full h-full object-cover rounded-xl`}
                />
              </div>
            ))}
            {/*<Button*/}
            {/*    className={`absolute bottom-3 left-3 bg-white text-black flex items-center justify-center px-4 rounded-xl hover:opacity-80`}><BsGrid/> Show*/}
            {/*    all photos</Button>*/}
          </div>

          <div className={`w-full grid grid-cols-6 gap-3`}>
            <div className={`col-span-full md:col-span-3 lg:col-span-4`}>
              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] dark:border-neutral-600 border-neutral-200 gap-y-5 mt-10`}
              >
                <div className={`w-full flex justify-between items-center`}>
                  <Label
                    text={tourData[0]?.tourType}
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
                  {tourData[0]?.title}
                </h1>

                <div className={`w-full flex gap-x-5 text-sm`}>
                  <div className={`flex gap-x-2 items-center`}>
                    <StarDisplay
                      value={tourData[0]?.review}
                      fontClass={`text-orange-600`}
                    />
                    <span>Reviews</span>
                  </div>
                  <BsDot />
                  <div className={`flex gap-x-2 items-center`}>
                    <BsCloudFill />
                    <p>Number of Nights : {tourData[0]?.noOfNight}</p>
                  </div>
                  <BsDot />
                  <div className={`flex gap-x-2 items-center`}>
                    <BsTranslate />
                    <p>Language : {tourData[0]?.language}</p>
                  </div>
                </div>

                <div className={`w-full flex gap-x-5 text-sm item-center`}>
                  <div
                    className={`w-12 h-12 bg-neutral-100 rounded-full relative flex items-center justify-center`}
                  >
                    <BsPersonCircle className="text-3xl text-neutral-500" />
                    <BsCheckCircleFill
                      className={`absolute right-0 top-0 text-green-500 bg-white rounded-full`}
                    />
                  </div>
                  <p
                    className={`flex items-center text-neutral-500 dark:text-neutral-100`}
                  >
                    Hosted by
                  </p>
                  <strong className={`flex items-center`}>
                    {tourData[0]?.host}
                  </strong>
                </div>
                <div>{tourData[0]?.description?.des}</div>
              </div>

              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
              >
                <h2 className={`text-3xl font-semibold `}>
                  Inclusions & Exclusions
                </h2>
                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                />
                <div
                  className={`text-neutral-700 dark:text-neutral-300 flex flex-col gap-y-2`}
                >
                  <p>
                    Inclusions :{" "}
                    {tourData[0]?.inclusions_exclusions?.inclusions}
                  </p>
                  <p>
                    Exclusions :{" "}
                    {tourData[0]?.inclusions_exclusions?.exclusions}
                  </p>
                </div>
              </div>

              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
              >
                <h2 className={`text-3xl font-semibold `}>
                  Guests Requirements
                </h2>
                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                />
                <div
                  className={`text-neutral-700 dark:text-neutral-300 flex flex-col gap-y-2`}
                >
                  <p>{tourData[0]?.description?.guestRequirement}</p>
                </div>
              </div>

              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
              >
                <h2 className={`text-3xl font-semibold `}>What to Bring</h2>
                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                />
                <div
                  className={`text-neutral-700 dark:text-neutral-300 flex flex-col gap-y-2`}
                >
                  <p>{tourData[0]?.description?.whatToBring}</p>
                </div>
              </div>

              <div
                className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
              >
                <h2 className={`text-3xl font-semibold `}>Other</h2>
                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                />
                <div
                  className={`text-neutral-700 dark:text-neutral-300 flex flex-col gap-y-2`}
                >
                  <p>PAX: {tourData[0]?.description?.pax}</p>
                  <p>Special Note: {tourData[0]?.description?.specialNote}</p>
                </div>
              </div>

              <CustomerReview
                itemId={tourData[0]?.tourId}
                userId={userDetails.id}
                userRole={userDetails.role}
                type="tours"
              />
            </div>

            <div className={`col-span-full md:col-span-3 lg:col-span-2`}>
              <div className="max-w-sm mx-auto bg-white dark:bg-[#1f2937] shadow-lg rounded-xl p-6 mt-10 border border-neutral-200 dark:border-neutral-600 sticky top-28">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className={`text-2xl font-semibold`}>
                      $ {tourData[0]?.price}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-full flex flex-col gap-y-4 text-neutral-500 dark:text-neutral-100 mt-5`}
                >
                  <h2 className={`text-xl font-semibold `}>
                    Cancellation Policy
                  </h2>
                  <hr
                    className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
                  />
                  <div
                    className={`text-neutral-700 dark:text-neutral-300 flex flex-col gap-y-2`}
                  >
                    <p>{tourData[0]?.description?.cancellationPolicy}</p>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="flex items-center my-6">
                  <BsCalendar4 className="text-4xl text-neutral-300" />
                  <DateRangePick
                    dateRangeLabelText={"Start - End"}
                    setDateRangePickerCustom={setDateRangePickerCustom}
                    dateRangePickerCustom={dateRangePickerCustom}
                    handler={handleChange}
                    name="checkInCheckOut"
                  />
                </div>

                <PrimaryButton
                  content={"Book Tour"}
                  className={"w-full mt-5"}
                  events={bookTour}
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
