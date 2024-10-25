import { getItemCount } from "@react-stately/collections";
import StarRating from "@/elements/StarRating";
import PrimaryButton from "@/elements/PrimaryButton";
import StarDisplay from "@/elements/StarDisplay";
import SecondaryButton from "@/elements/SecondaryButton";
import React, { useEffect, useState } from "react";
import TextAreaWLabel from "@/elements/TextAreaWLabel";
import Notiflix from "notiflix";
import { BsPersonCircle } from "react-icons/bs";

const CustomerReview = ({
  itemId,
  userId,
  userRole,
  type,
}: {
  itemId: string;
  userId: string;
  userRole: string;
  type: "property_listing" | "vehicle" | "tours";
}) => {
  const [customerReviews, setCustomerReviews] = useState([]);

  const [reviewFormData, setReviewFormData] = useState({
    userId: "",
    itemId: "",
    rating: 0,
    review: "",
    type: "",
  });

  useEffect(() => {
    setReviewFormData({
      userId: userId,
      itemId: itemId,
      rating: 0,
      review: "",
      type: type,
    });

    fetchReviews().then((r) => r);
  }, [itemId, userId]);

  const handleRatingChange = (e: any) => {
    setReviewFormData({
      ...reviewFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReviewSubmit = async () => {
    Notiflix.Loading.circle("Your request is processing");

    if (reviewFormData.rating === 0 || reviewFormData.review === "") {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(
        "Please provide a rating and review before submitting."
      );
    } else {
      try {
        const response = await fetch("/api/reviews/insert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewFormData),
        });

        if (!response.ok) {
          Notiflix.Loading.remove();
          Notiflix.Notify.failure("Failed to submit review.");
          throw new Error("Failed to submit review.");
        }

        const data = await response.json();
        if (data.message === "Success") {
          fetchReviews().then((r) => r);
          Notiflix.Loading.remove();
          Notiflix.Notify.success("Review submitted successfully.");
          setReviewFormData({
            userId: userId,
            itemId: itemId,
            rating: 0,
            review: "",
            type: type,
          });
        } else {
          Notiflix.Loading.remove();
          Notiflix.Notify.failure("Failed to submit review.");
        }
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/fetch-data/reviews/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId, type: type }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews.");
      }
      const data = await response.json();
      setCustomerReviews(data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div
        className={`w-full flex flex-col p-8 rounded-xl border dark:bg-[#1f2937] border-neutral-200 dark:border-neutral-600 gap-y-5 mt-10`}
      >
        <div className="flex items-center justify-between gap-x-2">
          <h2 className={`text-3xl font-semibold`}>Reviews</h2>
          <span className="text-neutral-400">
            {/* @ts-ignore */}
            {getItemCount(customerReviews)} Reviews
          </span>
        </div>
        <hr
          className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px]`}
        />

        {/*Add Review*/}
        {userRole === "user" && (
          <div className={`flex flex-col gap-y-2`}>
            <StarRating handler={handleRatingChange} />
            <TextAreaWLabel
              className="mt-4"
              label={""}
              placeHolder="Enter your review"
              rows={5}
              handler={handleRatingChange}
              name="review"
              value={reviewFormData.review}
            />
            <div className="flex justify-end w-full">
              <PrimaryButton
                content={"Add Review"}
                className={"w-fit mt-3"}
                events={handleReviewSubmit}
              />
            </div>
          </div>
        )}

        {/*Customer Reviews*/}
        {customerReviews.slice(0, 5).map((review: any, index) => (
          <div key={index} className={`flex gap-4 mt-5`}>
            <div className={`w-fit h-auto flex justify-start items-start`}>
              <BsPersonCircle className="mt-2 text-neutral-400" />
            </div>
            <div className={`flex flex-col gap-x-2 gap-y-3 w-full`}>
              <div className={`flex gap-x-2 items-center justify-between`}>
                <div className={`flex flex-col gap-x-2`}>
                  <p className={`font-semibold`}>
                    {review.firstName} {review.lastName ? review.lastName : ""}
                  </p>
                  <small className={`text-neutral-500 dark:text-neutral-100`}>
                    {/* format date as 2024-09-08 format */}
                    {new Date(review.createdTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </small>
                </div>
                <StarDisplay
                  value={review.point}
                  fontClass={`text-orange-600`}
                />
              </div>
              <p className={`text-neutral-700 dark:text-neutral-300`}>
                {review.review}
              </p>
            </div>
          </div>
        ))}
        <hr className={`w-full border border-neutral-100`} />
        <SecondaryButton
          content={"Show more reviews"}
          className={"w-fit mt-5"}
          events={""}
        />
      </div>
    </>
  );
};

export default CustomerReview;
