import React from "react";

const HomeFilterInput = ({className, placeholder, label, value, handler, name}: {
    className: string,
    placeholder: string,
    label: string,
    value: string,
    handler: any,
    name: string
}) => {
    return (
        <div className={className}>
            <input type="text" value={value} onChange={handler} name={name}
                   className="w-full outline-0 font-bold placeholder:text-black dark:bg-gray-800 dark:placeholder:text-white"
                   placeholder={placeholder}/>
            <span className="text-neutral-400">{label}</span>
        </div>
    )
}

export default HomeFilterInput;