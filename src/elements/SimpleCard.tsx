import React from "react";

const SimpleCard = ({img, title, properties, className,isTeam}: {
    img: string,
    title: string,
    properties: any,
    className: string,
    isTeam?: boolean
}) => {
    return (
        <div className="w-full px-2">
            <img aria-label="image"  src={img} alt={title}
                 className={`rounded-xl object-cover ${className} w-full hover:brightness-75 transition duration-300`}/>
            <h3 className="text-xl mt-6">{title}</h3>
            <span className="text-neutral-400 mt-4">{properties} {isTeam ? "" : "properties"}</span>
        </div>
    );
};

export default SimpleCard;