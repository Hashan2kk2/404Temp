"use client";
import StarDisplay from "@/elements/StarDisplay";

const TourCard = ({
  coverImg,
  title,
  noOfNights,
  price,
  rating,
  event,
}: {
  coverImg: string;
  title: string;
  noOfNights: string;
  price: number;
  rating: number;
  event: any;
}) => {
  return (
    <div
      className="duration-300 bg-white border cursor-pointer overflow-clip rounded-xl hover:shadow-xl hover:shadow-neutral-100 hover:bg-neutral-50 hover:border-neutral-300"
      onClick={event}
    >
      <div className="p-4 pb-8">
        <img
          src={coverImg}
          className="w-full h-[200px] object-cover rounded-xl"
        />
        <div className="flex items-start justify-between mt-4">
          <div>
            <h2 className="text-lg font-semibold line-clamp-1">{title}</h2>
            <p className="text-sm font-light text-neutral-400">
              {noOfNights} Nights
            </p>
          </div>
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
    </div>
  );
};

export default TourCard;
