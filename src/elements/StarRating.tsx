import {SetStateAction, useState} from 'react';
import {BsStarFill} from 'react-icons/bs';

const StarRating = ({handler}:{handler:any}) => {
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [rating, setRating] = useState(0);

    const handleMouseEnter = (index: SetStateAction<number>) => {
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(-1);
    };

    const handleClick = (index: number) => {
        setRating(index + 1);
        handler(
            {
                target: {
                    name: 'rating',
                    value: index + 1
                }
            }
        )
    };

    return (
        <div className="flex items-center gap-x-1">
            {[0, 1, 2, 3, 4].map((index) => (
                <BsStarFill
                    key={index}
                    className={`text-lg transition-colors duration-300 ease-in-out ${
                        index <= (hoverIndex === -1 ? rating - 1 : hoverIndex) ? 'text-orange-600' : 'text-neutral-300'
                    }`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(index)}
                />
            ))}
            <p className="ml-4">Rating: {rating}</p> {/* Display the current rating */}
        </div>
    );
};

export default StarRating;
