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
  BsDot,
  BsGeo,
  BsHeart,
  BsHeartFill,
  BsPersonCircle,
} from "react-icons/bs";
import Label from "@/elements/Label";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import NewsLetter from "@/components/NewsLetter";
import PrimaryButton from "@/elements/PrimaryButton";
import { useSearchParams } from "next/navigation";
import Notiflix from "notiflix";
import CustomerReview from "@/components/CustomerReview";
import StarDisplay from "@/elements/StarDisplay";
import ReserveForm from "@/components/ReserveForm";

const DetailPage = () => {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get("id");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isFlight, setIsFlight] = useState(false);
  const [listingData, setListingData] = useState<any>([]);
  const [imageData, setImageData] = useState([]);
  const [dateRangePickerCustom, setDateRangePickerCustom] = useState(false);
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

  const [formData, setFormData] = useState({
    bookingDates: [],
  });
  const [userDetails, setUserDetails] = useState({
    id: "",
    role: "",
    email: "",
    name: "",
  });

  useEffect(() => {
    Notiflix.Loading.pulse();
    initialFetch();
  }, []);

  const initialFetch = async () => {
    await fetchUser().then((r) => r);
    await fetchRentalData(rentalId).then((r) => r);
    Notiflix.Loading.remove();
    setCurrentUrl(window.location.href);
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

  const fetchRentalData = async (rentalId: string | null) => {
    try {
      const response = await fetch("/api/fetch-data/rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tb: "all", id: rentalId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch-data");
      }
      const data = await response.json();
      data.rentalList[0].availabilitySchedule = data.rentalList[0]
        .availabilitySchedule
        ? data.rentalList[0].availabilitySchedule.split(",")
        : [];
      setListingData(data.rentalList);
      setImageData(data.vehicleImages);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleRentalBooking = async () => {
    Notiflix.Loading.circle("Submitting...");

    if (formData.bookingDates.length === 0) {
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
            "Mail Type": "Rental Booking",
            "Vehicle Name":
              listingData[0]?.vehicleBrand + " " + listingData[0]?.model,
            "Vehicle Number": listingData[0]?.vehicleNumber,
            "Base Price": "$" + listingData[0]?.pricing.basePrice1,
            "Booking Dates": formData.bookingDates,
            "Booking Customer": userDetails.name,
            "Customer Email": userDetails.email,
            "Requested Date": new Date().toISOString().split("T")[0],
            _template: "table",
            _subject: "Rental Booking",
          }),
        }
      );
      if (!response.ok) {
        Notiflix.Notify.failure("Failed to submit");
      } else {
        console.log("Booking Success");
        // updateDataSet();
      }
      Notiflix.Loading.remove();
    }
  };

  const updateDataSet = async () => {
    const bookedDateCount = formData.bookingDates.length;
    const price =
      bookedDateCount <= 9
        ? listingData[0]?.pricing.basePrice1
        : bookedDateCount <= 29
          ? listingData[0]?.pricing.basePrice2
          : listingData[0]?.pricing.basePrice3;

    const response = await fetch("/api/payments/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: rentalId,
        userId: userDetails.id,
        type: "vehicle",
        updatedDataSet: formData,
        existingAvailabilitySchedule: listingData[0].availabilitySchedule,
        price: price * bookedDateCount,
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

  const handleSaveChanges = async () => {
    if (isSaved) {
      savedItems.rental = savedItems.rental.filter((item) => item !== rentalId);
      setIsSaved(false);
    } else {
      if (rentalId) {
        savedItems.rental.push(rentalId);
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
      if (data.rental.includes(rentalId)) {
        setIsSaved(true);
      }
    }
  };

  useEffect(() => {
    if (userDetails.email !== "") {
      fetchSavedItems();
    }
  }, [userDetails.email]);


  return (
    <div className="w-full mx-auto dark:bg-gray-900">
      <Navigation />
      <div className={`w-full max-w-[1300px] mx-auto mt-5`}>
        <div
          className={`w-full h-auto grid grid-cols-4 grid-rows-4 md:grid-rows-2 gap-2 relative`}
        >
          {imageData.slice(0, 6).map((image: any, index) => (
            <div
              key={index}
              className={`${index === 0
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
          {/* <Button
            className={`absolute bottom-3 left-3 bg-white text-black flex items-center justify-center px-4 rounded-xl hover:opacity-80`}
          >
            <BsGrid /> Show all photos
          </Button> */}
        </div>

        <div className={`w-full grid grid-cols-6 gap-3`}>
          <div className={`col-span-full md:col-span-3 lg:col-span-4`}>
            <div
              className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] dark:border-neutral-600 border-neutral-200 gap-y-5 mt-10`}
            >
              <div className={`w-full flex justify-between items-center`}>
                <Label
                  text={listingData[0]?.vehicleTypeName}
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
                        placement: "right",
                        closeDelay: 500,
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
                {listingData[0]?.vehicleBrand !== "undefined"
                  ? listingData[0]?.vehicleBrand
                  : ""}{" "}
                {listingData[0]?.model !== "undefined"
                  ? listingData[0]?.model
                  : ""}
              </h1>

              <div className={`w-full flex gap-x-5 text-sm`}>
                <div className={`flex gap-x-2 items-center`}>
                  <StarDisplay
                    value={listingData[0]?.review}
                    fontClass={`text-orange-600`}
                  />
                  <span>Reviews</span>
                </div>
                <BsDot />
                <div className={`flex gap-x-2`}>
                  <BsGeo />
                  <p>{listingData[0]?.location}</p>
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
                  Owner :
                </p>
                <strong className={`flex items-center`}>
                  {listingData[0]?.ownerName}
                </strong>
              </div>

              <hr
                className={`w-full border border-neutral-200 dark:border-neutral-600`}
              />

              <div
                className={`w-full flex gap-x-8 text-neutral-700 dark:text-neutral-300`}
              >
                {listingData[0]?.vehicleDescription}
              </div>
            </div>

            <div
              className={`w-full flex flex-col p-8 rounded-xl gap-y-5 mt-10`}
            >
              <h2 className={`text-3xl font-semibold `}>Vehicle Information</h2>
              <hr
                className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
              />
              <div
                className={`text-neutral-700 dark:text-neutral-300 flex flex-col gap-y-2 shadow-none`}
              >
                <Table aria-label="Vehicle informations" shadow="none">
                  <TableHeader>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Description</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell>Vehicle Number</TableCell>
                      <TableCell>{listingData[0]?.vehicleNumber}</TableCell>
                    </TableRow>
                    <TableRow key="2">
                      <TableCell>Vehicle Type</TableCell>
                      <TableCell>{listingData[0]?.vehicleTypeName}</TableCell>
                    </TableRow>
                    <TableRow key="3">
                      <TableCell>Model</TableCell>
                      <TableCell>{listingData[0]?.model}</TableCell>
                    </TableRow>
                    <TableRow key="4">
                      <TableCell>Brand</TableCell>
                      <TableCell>{listingData[0]?.vehicleBrand}</TableCell>
                    </TableRow>
                    <TableRow key="5">
                      <TableCell>manufactureYear</TableCell>
                      <TableCell>{listingData[0]?.manufactureYear}</TableCell>
                    </TableRow>
                    <TableRow key="6">
                      <TableCell>Seating Capacity</TableCell>
                      <TableCell>{listingData[0]?.seatingCapacity}</TableCell>
                    </TableRow>
                    <TableRow key="7">
                      <TableCell>engineCapacity</TableCell>
                      <TableCell>{listingData[0]?.engineCapacity}CC</TableCell>
                    </TableRow>
                    <TableRow key="8">
                      <TableCell>Transmission</TableCell>
                      <TableCell>{listingData[0]?.transmissionName}</TableCell>
                    </TableRow>
                    <TableRow key="9">
                      <TableCell>Fuel Type</TableCell>
                      <TableCell>{listingData[0]?.fuelTypeName}</TableCell>
                    </TableRow>
                    <TableRow key="10">
                      <TableCell>Luggage Capacity</TableCell>
                      <TableCell>{listingData[0]?.luggageCapacity}</TableCell>
                    </TableRow>
                    <TableRow key="11">
                      <TableCell>District</TableCell>
                      <TableCell>{listingData[0]?.districtName}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div
              className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
            >
              <h2 className={`text-3xl font-semibold `}>Inclusions</h2>
              <hr
                className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
              />
              <div className={`w-full grid grid-cols-2 md:grid-cols-3 gap-5`}>
                {listingData[0]?.inclusions}
              </div>
            </div>

            <div
              className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
            >
              <h2 className={`text-3xl font-semibold `}>Special Note</h2>
              <hr
                className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
              />
              <div className={`w-full grid grid-cols-2 md:grid-cols-3 gap-5`}>
                {listingData[0]?.specialNote}
              </div>
            </div>

            <CustomerReview
              itemId={listingData[0]?.id}
              userId={userDetails.id}
              userRole={userDetails.role}
              type="vehicle"
            />
          </div>

          <div className={`col-span-full md:col-span-3 lg:col-span-2`}>
            <div className="max-w-sm mx-auto bg-white dark:bg-[#1f2937] shadow-lg rounded-xl p-6 mt-10 border border-neutral-200 dark:border-neutral-600 sticky top-28">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start w-full">
                  <h3>Pricing</h3>
                  <hr
                    className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px] my-2`}
                  />

                  <Table aria-label="Vehicle informations" shadow="none">
                    <TableHeader>
                      <TableColumn>Category</TableColumn>
                      <TableColumn>Price</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>1-9 Days</TableCell>
                        <TableCell>
                          $ {listingData[0]?.pricing.basePrice1}{" "}
                          <span className="text-[10px] capitalize">
                            {" "}
                            /per day
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>10-29 Days</TableCell>
                        <TableCell>
                          $ {listingData[0]?.pricing.basePrice2}{" "}
                          <span className="text-[10px] capitalize">
                            {" "}
                            /per day
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>More than Month</TableCell>
                        <TableCell>
                          $ {listingData[0]?.pricing.basePrice3}{" "}
                          <span className="text-[10px] capitalize">
                            {" "}
                            /per day
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <hr className="my-4" />

              {userDetails.role === "user" ? (
                <ReserveForm
                  formData={formData}
                  setFormData={setFormData}
                  handler={handleRentalBooking}
                  type="vehicle"
                  unavailableDates={listingData[0]?.availabilitySchedule}
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
                    You&apos;re an {userDetails.role}. Only users can book vehicles.
                  </small>
                  <small className="text-neutral-500">
                    if you want to book a vehicle, please logout &{" "}
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
  );
};

export default DetailPage;
