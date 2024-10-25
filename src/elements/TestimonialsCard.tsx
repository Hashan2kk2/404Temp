import {BsGeoAlt} from "react-icons/bs";
import QuoteIconLeft from "../assets/img/others/quotation.png";
import QuoteIconRight from "../assets/img/others/quotation2.png";

const TestimonialsCard = ({description, clientName, location}: {
    description: string,
    clientName: string,
    location: string
}) => {
    return (
        <div className="mx-auto relative w-fit md:px-10 lg:px-16">
            <div className="w-full h-fit absolute top-1/3 left-0 hidden md:block">
                <div className="w-full flex justify-between">
                    <img aria-label="image"  src={QuoteIconLeft.src} alt="quote icon" className="w-10 aspect-square"/>
                    <img aria-label="image"  src={QuoteIconRight.src} alt="quote icon" className="w-10 aspect-square"/>
                </div>
            </div>
            <p className="max-w-[700px] mx-auto md:text-xl lg:text-2xl">{description}</p>
            <span className="block mt-8 font-bold text-xl">{clientName}</span>
            <span className="block mt-8 text-xl text-neutral-400 mb-8"><BsGeoAlt
                className="inline -mt-1 me-2"/>{location}</span>
        </div>
    );
}

export default TestimonialsCard;