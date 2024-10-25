import React, { useEffect, useState } from "react";
import { Switch, Tab, Tabs } from "@nextui-org/react";
import Notiflix from "notiflix";
import StarDisplay from "@/elements/StarDisplay";

const CustomerReviews = ({ userDetails }: { userDetails: any }) => {
  const [staysReviews, setStaysReviews] = useState([]);
  const [rentalsReviews, setRentalsReviews] = useState([]);
  const [toursReviews, setToursReviews] = useState([]);
  const [flightsReviews, setFlightsReviews] = useState([]);

  const fetchDataList = [
    {
      table: "property_listing_has_review",
      type: "property_listing",
    },
    {
      table: "vehicle_has_review",
      type: "vehicle",
    },
    {
      table: "tours_has_review",
      type: "tours",
    },
  ];

  useEffect(() => {
    fetchReviews().then((r) => r);
    fetchFlightsReviews().then((r) => r);
  }, []);

  const fetchReviews = async () => {
    fetchDataList.forEach(async (data) => {
      const response = await fetch("/api/fetch-data/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: data.table,
          type: data.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const dataSet = await response.json();
      const formattedReviews = dataSet.map((review: any) => ({
        id: review.review_id,
        itemTitle: review.itemTitle,
        user: review.firstName
          ? review.firstName
          : "" + "" + review.lastName
          ? review.lastName
          : "",
        point: review.point,
        review: review.review,
        createdTime: review.createdTime,
        status_id: review.status_id,
        status: review.status,
      }));

      if (data.type === "property_listing") {
        setStaysReviews(formattedReviews);
      } else if (data.type === "vehicle") {
        setRentalsReviews(formattedReviews);
      } else if (data.type === "tours") {
        setToursReviews(formattedReviews);
      }
    });
  };

  const fetchFlightsReviews = async () => {
    const response = await fetch("/api/fetch-data/reviews");

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const formattedReviews = data.map((review: any) => ({
      id: review.review_id,
      user: review.firstName
        ? review.firstName
        : "" + "" + review.lastName
        ? review.lastName
        : "",
      point: review.point,
      review: review.review,
      createdTime: review.createdTime,
      status_id: review.status_id,
      status: review.status,
    }));

    setFlightsReviews(formattedReviews);
  };

  const handleStatusChange = async (
    reviewId: string,
    status: string,
    type: string
  ) => {
    Notiflix.Loading.circle("Updating..");

    const newStatus = status === "Active" ? "Deactive" : "Active";
    const response = await fetch("/api/reviews/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: reviewId,
        status: newStatus,
        type: type,
      }),
    });

    if (!response.ok) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure("Failed to update");
      throw new Error("Failed to update");
    }

    const resp = await response.json();
    if (resp === "Success") {
      Notiflix.Loading.remove();
      Notiflix.Notify.success("Update Successful");
      //@ts-ignore
      if (type === "tours") {
        setToursReviews(
          // @ts-ignore
          toursReviews.map((review: any) => {
            if (review.id === reviewId) {
              review.status = newStatus;
            }
            return review;
          })
        );
      } else if (type === "stays") {
        setStaysReviews(
          // @ts-ignore
          staysReviews.map((review: any) => {
            if (review.id === reviewId) {
              review.status = newStatus;
            }
            return review;
          })
        );
      } else if (type === "rentals") {
        setRentalsReviews(
          // @ts-ignore
          rentalsReviews.map((review: any) => {
            if (review.id === reviewId) {
              review.status = newStatus;
            }
            return review;
          })
        );
      } else if (type === "flights") {
        setFlightsReviews(
          // @ts-ignore
          flightsReviews.map((review: any) => {
            if (review.id === reviewId) {
              review.status = newStatus;
            }
            return review;
          })
        );
      }
    }
  };

  return (
    <div className="w-full h-full p-8 overflow-x-hidden overflow-y-auto custom-overflow">
      <h1>Customer Reviews</h1>
      <hr className="my-4" />

      <div>
        <Tabs aria-label="Options">
          <Tab key="Stays" title="Stays">
            {staysReviews.length > 0 ? (
              staysReviews.map((review: any) => (
                <div key={review.id}>
                  <div className="grid w-full grid-cols-1 p-4 mt-3 lg:grid-cols-2 gap-y-2 bg-neutral-100 rounded-xl">
                    <div className="text-sm col-span-full">
                      <h2>Stay : {review.itemTitle}</h2>
                      <h2>User : {review.user}</h2>
                      <StarDisplay value={review.point} />
                      <p className="mt-2 text-neutral-500">{review.review}</p>
                    </div>

                    <span className="text-[12px] text-neutral-400 lg:col-span-1 mt-4">
                      Created At : &nbsp;
                      {new Date(review.createdTime).toLocaleDateString()}
                    </span>

                    <div className="flex items-center justify-end gap-3 lg:col-span-1">
                      <span className="text-[12px] text-neutral-400">
                        {review.status}
                      </span>
                      <Switch
                        defaultSelected={review.status === "Active"}
                        onChange={() => {
                          handleStatusChange(
                            review.id,
                            review.status,
                            "stays"
                          ).then((r) => r);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-4 text-center text-neutral-500">
                No reviews found
              </div>
            )}
          </Tab>

          <Tab key="Rentals" title="Rentals">
            {rentalsReviews.length > 0 ? (
              rentalsReviews.map((review: any) => (
                <div key={review.id}>
                  <div className="grid w-full grid-cols-1 p-4 mt-3 lg:grid-cols-2 gap-y-2 bg-neutral-100 rounded-xl">
                    <div className="text-sm col-span-full">
                      <h2>Vehicle Number : {review.itemTitle}</h2>
                      <h2>User : {review.user}</h2>
                      <StarDisplay value={review.point} />
                      <p className="mt-2 text-neutral-500">{review.review}</p>
                    </div>

                    <span className="text-[12px] text-neutral-400 lg:col-span-1 mt-4">
                      Created At : &nbsp;
                      {new Date(review.createdTime).toLocaleDateString()}
                    </span>

                    <div className="flex items-center justify-end gap-3 lg:col-span-1">
                      <span className="text-[12px] text-neutral-400">
                        {review.status}
                      </span>
                      <Switch
                        defaultSelected={review.status === "Active"}
                        onChange={() => {
                          handleStatusChange(
                            review.id,
                            review.status,
                            "rentals"
                          ).then((r) => r);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-4 text-center text-neutral-500">
                No reviews found
              </div>
            )}
          </Tab>

          <Tab key="Tours" title="Tours">
            {toursReviews.length > 0 ? (
              toursReviews.map((review: any) => (
                <div key={review.id}>
                  <div className="grid w-full grid-cols-1 p-4 mt-3 lg:grid-cols-2 gap-y-2 bg-neutral-100 rounded-xl">
                    <div className="text-sm col-span-full">
                      <h2>Tour : {review.itemTitle}</h2>
                      <h2>User : {review.user}</h2>
                      <StarDisplay value={review.point} />
                      <p className="mt-2 text-neutral-500">{review.review}</p>
                    </div>

                    <span className="text-[12px] text-neutral-400 lg:col-span-1 mt-4">
                      Created At : &nbsp;
                      {new Date(review.createdTime).toLocaleDateString()}
                    </span>

                    <div className="flex items-center justify-end gap-3 lg:col-span-1">
                      <span className="text-[12px] text-neutral-400">
                        {review.status}
                      </span>
                      <Switch
                        defaultSelected={review.status === "Active"}
                        onChange={() => {
                          handleStatusChange(
                            review.id,
                            review.status,
                            "tours"
                          ).then((r) => r);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-4 text-center text-neutral-500">
                No reviews found
              </div>
            )}
          </Tab>

          <Tab key="Flights" title="Flights">
            {flightsReviews.length > 0 ? (
              flightsReviews.map((review: any) => (
                <div key={review.id}>
                  <div className="grid w-full grid-cols-1 p-4 mt-3 lg:grid-cols-2 gap-y-2 bg-neutral-100 rounded-xl">
                    <div className="text-sm col-span-full">
                      <h2>{review.user}</h2>
                      <StarDisplay value={review.point} />
                      <p className="mt-2 text-neutral-500">{review.review}</p>
                    </div>

                    <span className="text-[12px] text-neutral-400 lg:col-span-1 mt-4">
                      Created At : &nbsp;
                      {new Date(review.createdTime).toLocaleDateString()}
                    </span>

                    <div className="flex items-center justify-end gap-3 lg:col-span-1">
                      <span className="text-[12px] text-neutral-400">
                        {review.status}
                      </span>
                      <Switch
                        defaultSelected={review.status === "Active"}
                        onChange={() => {
                          handleStatusChange(
                            review.id,
                            review.status,
                            "flights"
                          ).then((r) => r);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-4 text-center text-neutral-500">
                No reviews found
              </div>
            )}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerReviews;
