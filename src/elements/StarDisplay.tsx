import {BsStar, BsStarFill, BsStarHalf} from 'react-icons/bs';

const StarDisplay = ({value, fontClass}: {
    value: number;
    fontClass?: string;
}) => {
    const getStarIcons = () => {
        const fullStars = Math.floor(value);
        const hasHalfStar = value % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<BsStarFill key={`full-${i}`} className={`text-orange-600 ${fontClass}`}/>);
        }

        if (hasHalfStar) {
            stars.push(<BsStarHalf key="half" className={`text-orange-600 ${fontClass}`}/>);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<BsStar key={`empty-${i}`} className={`text-neutral-300 ${fontClass}`}/>);
        }

        return stars;
    };

    return (
        <div className="flex gap-x-2">
            <div className="flex gap-x-1 items-center">
                {getStarIcons()}
            </div>
            <p className={`${fontClass} text-neutral-500`}>{value}</p>
        </div>
    );
};

export default StarDisplay;
