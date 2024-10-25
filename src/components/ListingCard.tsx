import StarDisplay from "@/elements/StarDisplay";
import React, { useRef } from "react";
import { BsDot } from "react-icons/bs";
import { LuMapPin } from "react-icons/lu";
// @ts-ignore
import Slider from "react-slick";

interface ListingCardProps {
  className?: string;
  stockimg: string;
  discount: number;
  cardTitle: string;
  location: string;
  option1: string;
  option2: string;
  price: string;
  rating: number;
  ratingcount: number;
  event: any;
}

const ListingCard: React.FC<ListingCardProps> = ({
  className = "",
  stockimg = "",
  discount,
  cardTitle,
  location,
  option1,
  option2,
  price,
  rating,
  ratingcount,
  event,
}) => {
  const sliderRef = useRef<Slider | null>(null);

  return (
    <div
      className="relative p-4 duration-300 bg-white border cursor-pointer rounded-xl hover:shadow-xl hover:shadow-neutral-100 hover:bg-neutral-50 hover:border-neutral-300"
      onClick={event}
    >
      <div className="h-[200px] relative rounded-xl bg-primary aspect-auto overflow-clip group">
        {/*<div*/}
        {/*    className="absolute z-20 flex items-center justify-center p-2 text-white rounded-full bg-neutral-800/30 right-2 top-2">*/}
        {/*    <FaRegHeart/>*/}
        {/*</div>*/}
        <div
          className={`${className} red-badge absolute z-20 text-[12px] bg-red-700 text-white py-[2px] px-3 top-2 left-2 rounded-full`}
        >
          {discount}% off today
        </div>
        <div className="absolute z-10 w-full h-full">
          <img
            aria-label="image"
            src={stockimg}
            className="w-full object-cover h-[200px]"
            alt={`card-img`}
          />
        </div>
      </div>
      <div className="flex items-center mt-4 text-small text-neutral-500">
        <span>{option1}</span>
        <BsDot />
        <span>{option2}</span>
      </div>
      <div className="mt-2 font-semibold text-medium">
        <span>{cardTitle}</span>
      </div>
      <div className="flex items-center mt-2 text-sm text-neutral-500">
        <LuMapPin />
        <span>{location}</span>
      </div>
      <div className="flex justify-between mt-4 items-center">
        <div className="col-span-1">
          <span className="font-semibold text-large">$ {price}</span>
        </div>
        <div className="col-span-1">
          <StarDisplay value={rating} fontClass="text-sm" />
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
