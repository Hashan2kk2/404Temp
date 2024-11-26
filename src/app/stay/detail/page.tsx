/* eslint-disable @next/next/no-img-element */
"use client";
import Navigation from "@/components/Navigation";
import {
  Button,
  Snippet,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import {
  BsCheckCircleFill,
  BsHeart,
  BsHeartFill,
  BsPerson
} from "react-icons/bs";
import Label from "@/elements/Label";
import { Suspense, useEffect, useState } from "react";
import { IoBedOutline } from "react-icons/io5";
import { LiaBathSolid, LiaDoorOpenSolid } from "react-icons/lia";
import Footer from "@/components/Footer";
import NewsLetter from "@/components/NewsLetter";
import { useSearchParams } from "next/navigation";
import Notiflix from "notiflix";
import CustomerReview from "@/components/CustomerReview";
import StarDisplay from "@/elements/StarDisplay";
import ReserveForm from "@/components/ReserveForm";
import PrimaryButton from "@/elements/PrimaryButton";
import { calcLength } from "framer-motion";

const DetailPage = () => {
  // const [totalPrice, setTotalPrice] = useState(0);
  const [isFlight, setIsFlight] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  interface SavedItems {
    stay: string[];
    tour: string[];
    rental: string[];
  }

  const [savedItems, setSavedItems] = useState<SavedItems>({
    stay: [],
    tour: [],
    rental: [],
  });

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
      res[0].availabilitySchedule = res[0].availabilitySchedule
        ? res[0].availabilitySchedule.split(",")
        : [];
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
    setCurrentUrl(window.location.href);
  }, [id]);

  const [formData, setFormData] = useState({
    bookingDates: [],
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

    if (formData.guestCount === "") {
      Notiflix.Loading.remove();
      Notiflix.Notify.warning("Please fill the required fields");
    } else {
      const response = await fetch(
        "https://formsubmit.co/ajax/vidhuraneethika000@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            "Mail Type": "Stay Booking",
            "Stay Name": dataset[0] && dataset[0].placeName,
            Price: "$" + calculateTotalPrice(),
            "Requested Guest Count": formData.guestCount,
            "Booking Dates": formData.bookingDates,
            "Booking Customer": userDetails.name,
            "Customer Email": userDetails.email,
            "Requested Date": new Date().toISOString().split("T")[0],
            _template: "table",
            _subject: "Stay Booking",
          }),
        }
      );
      if (!response.ok) {
        Notiflix.Notify.failure("Failed to submit");
      } else {
        console.log("Booking submitted");
        // updateDataSet();
      }
      Notiflix.Loading.remove();
    }
  };

  const updateDataSet = async () => {

    const response = await fetch("/api/payments/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: id,
        userId: userDetails.id,
        type: "property_listing",
        updatedDataSet: formData,
        existingAvailabilitySchedule: dataset[0].availabilitySchedule,
        price: calculateTotalPrice(), 
      }),
    });

    if (!response.ok) {
      Notiflix.Notify.failure("Booking Failed");
      Notiflix.Loading.remove();
    }

    const data = await response.json();
    if (data.message === "Success") {
      Notiflix.Notify.success("Booking Successful. We will contact you soon.");
      Notiflix.Loading.remove();
    }
  };

  const calculateTotalPrice = () => {
    const bookedDates = formData.bookingDates.map((dateString: string) => new Date(dateString));

    const weekdays = bookedDates.filter((date: Date) => {
      const day = date.getDay();
      return day >= 1 && day <= 5;
    });
  
    const weekends = bookedDates.filter((date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    });
  
    const weekdayPrice = dataset[0].description.pricing.basePriceForWeekdays;
    const weekendPrice = dataset[0].description.pricing.basePriceForWeekends;
  
    const totalWeekdayPrice = weekdays.length * weekdayPrice;
    const totalWeekendPrice = weekends.length * weekendPrice;
    const totalPrice = totalWeekdayPrice + totalWeekendPrice;

    return totalPrice;
  };

  const handleSaveChanges = async () => {
    if (isSaved) {
      savedItems.stay = savedItems.stay.filter((item) => item !== id);
      setIsSaved(false);
    } else {
      if (id) {
        savedItems.stay.push(id);
      }
      setIsSaved(true);
    }

    const response = await fetch("/api/user/manage-saved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: userDetails.email,
        savedItem: savedItems,
      }),
    });
    if (!response.ok) {
      Notiflix.Notify.failure("Failed to save item");
    }
    const data = await response.json();
    if (data === "Success") {
      Notiflix.Notify.success("Saved Successfully");
    }
  };

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
    if (data !== null) {
      setSavedItems(data);
      if (data.stay.includes(id)) {
        setIsSaved(true);
      }
    }
  };

  useEffect(() => {
    if (userDetails.email !== "") {
      fetchSavedItems();
    }
  }, [userDetails.email]);

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
      // {
      //   name: "Monthly Discount",
      //   value: `${dataset[0].description.pricing.monthlyDiscount}%`,
      // },
    ]
    : [];

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
                    <div
                      className={`flex justify-center items-center p-2 bg-transparent`}
                    >
                      <Snippet
                        tooltipProps={{
                          color: "foreground",
                          content: "Copy Link to Clipboard",
                          placement: "left",
                          closeDelay: 500,
                          showArrow: true,
                          offset: -3,
                        }}
                        hideSymbol={true}
                        classNames={{ pre: "hidden", base: "bg-transparent" }}
                        size="sm"
                      >
                        {currentUrl}
                      </Snippet>
                      Copy Link
                    </div>
                    <div className={`flex justify-center items-center p-2 bg-transparent gap-1`}>
                      <Tooltip content="Click to save" placement="left" color="foreground" closeDelay={500} showArrow={true} offset={-3}>
                        <Button isIconOnly className={'bg-transparent text-medium'} size="sm" onClick={() => {
                          handleSaveChanges();
                        }}>
                          {isSaved ? <BsHeartFill className="text-red-500" /> : <BsHeart />}
                        </Button>
                      </Tooltip>
                      Save
                    </div>
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
            </div>

            <div className={`col-span-full md:col-span-3 lg:col-span-2`}>
              <div className="max-w-sm mx-auto bg-white dark:bg-[#1f2937] shadow-lg rounded-xl p-6 mt-10 border border-neutral-200 dark:border-neutral-600 sticky top-28">
                <h3>Pricing</h3>
                <hr
                  className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px] my-2`}
                />
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
                    <p className={`text-neutral-500 dark:text-neutral-100 text-[10px]`}>
                      / Per Night for Weekdays
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="text-2xl font-semibold">
                      {dataset[0]?.description?.pricing?.basePriceForWeekends ? (
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
                    <p className={`text-neutral-500 dark:text-neutral-100 text-[10px]`}>
                      / Per Night for Weekends
                    </p>
                  </div>
                </div>

                <hr className="my-4" />

                {userDetails.role === "user" ? (
                  <ReserveForm
                    formData={formData}
                    setFormData={setFormData}
                    handler={handleListingBooking}
                    formHandler={handleChange}
                    type="property_listing"
                    unavailableDates={dataset[0]?.availabilitySchedule}
                  />
                ) : userDetails.role === "" ? (
                  <PrimaryButton
                    content={"Login to Book"}
                    events={() => {
                      window.location.href = "/sign-in";
                    }}
                    className="w-full"
                  />
                ) : (
                  <div className="w-full flex flex-col">
                    <small className="text-neutral-500">
                      You&apos;re an {userDetails.role}. Only users can book
                      properties.
                    </small>
                    <small className="text-neutral-500">
                      if you want to book a propertie, please logout &{" "}
                      <a className="text-primary font-bold" href="/sign-in">
                        sign-in
                      </a>{" "}
                      as a user.
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>

          <NewsLetter />
        </div>
        <Footer setIsFlight={setIsFlight} />
      </div>
    </Suspense>
  );
};

export default DetailPage;
