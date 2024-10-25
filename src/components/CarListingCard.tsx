import StarDisplay from "@/elements/StarDisplay";
import { Chip, Divider } from "@nextui-org/react";
import { FaStar } from "react-icons/fa";

export default function CarListingCard({
  ratingsCount,
  cardImg,
  cardTitle,
  cardPrice,
  cardSubTitle,
  cardRating,
  adsBadge,
  discountBadge,
  discountPercent,
  event,
}: {
  ratingsCount?: number;
  cardImg: string;
  cardTitle: string;
  cardPrice: string;
  cardSubTitle: string;
  cardRating: number;
  adsBadge: boolean;
  discountBadge: boolean;
  discountPercent: string;
  event: any;
}) {
    return (
        <div className='w-full' onClick={event}>
            <div className='relative h-full p-4 bg-transparent rounded-xl border bg-white hover:shadow-xl hover:shadow-neutral-100 hover:bg-neutral-50 hover:border-neutral-300 duration-300 cursor-pointer'>
                {/*    discount badge*/}
                <div
                    className={`absolute z-40 top-4 left-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs ${!discountBadge ? 'hidden' : 'flex'}`}>
                    - {discountPercent} % today
                </div>

        <div className="justify-center w-full">
          <img
            src={cardImg}
            alt="car"
            className="object-cover w-full h-[200PX] rounded-2xl"
          />
        </div>
        <div className="">
          <div className={`py-4 flex items-center`}>
            <Chip
              className={`me-2 bg-green-100 text-green-800 ${
                !adsBadge ? "hidden" : "flex"
              }`}
            >
              ADS
            </Chip>
            <h3 className="text-xl">{cardTitle}</h3>
          </div>
          <div>
            <span className="text-sm">{cardSubTitle}</span>
          </div>
          <Divider className="w-1/3 my-4" />
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-large">
                $ {cardPrice}
              </span>
              <span className="text-[11px] ms-2">
                (1-9 Days)
              </span>
            </div>
            {/*    ratings star*/}
            <div className="flex items-center">
            <StarDisplay value={cardRating} fontClass="text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
