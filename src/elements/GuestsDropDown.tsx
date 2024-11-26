import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/dropdown";
import {BsChevronDown} from "react-icons/bs";
import React, {useState} from "react";
import PlusMinus from "@/elements/PlusMinus";

const GuestsDropDown = ({arrowIcon, className, dropDownClassName, handler, name}: {
    arrowIcon: boolean,
    className: string,
    dropDownClassName: string,
    handler: any,
    name: string
}) => {

    const [tripAdultCount, setTripAdultCount] = useState(0);
    const [tripChildrenCount, setTripChildrenCount] = useState(0);
    const [tripInfantCount, setTripInfantCount] = useState(0);

    const handleChange = () => {
        handler(
            {
                target: {
                    name: name,
                    value: tripAdultCount + tripChildrenCount + tripInfantCount + 1
                }
            }
        );
    }

    return (
        <>
            <Dropdown closeOnSelect={false} className={`bg-white dark:bg-gray-800 ${dropDownClassName}`}
                      onClick={handleChange}>
                <DropdownTrigger>
                        <span
                            className={`cursor-pointer flex items-center gap-4 justify-between ${className}`}>{tripAdultCount + tripChildrenCount + tripInfantCount} Guests <BsChevronDown
                            className={`${arrowIcon === true ? `flex` : `hidden`}`}/>
                        </span>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions"
                              variant={"bordered"}
                              itemClasses={{
                                  base: 'hover:border-0 border-0 bg-white dark:bg-gray-800',
                              }}
                              classNames={{
                                  list: 'bg-white dark:bg-gray-800',
                                  base: 'bg-white dark:bg-gray-800',
                              }}
                >
                    <DropdownItem key="adults">
                        <div
                            className={`w-full flex justify-between items-center gap-x-10`}>
                            <div className={`flex flex-col`}>
                                <p className={`font-medium`}>Adults</p>
                                <small className={`text-neutral-500`}>Ages 13 or above</small>
                            </div>
                            <div className={`flex items-center justify-center gap-x-5`}>
                                <PlusMinus getter={tripAdultCount} setter={setTripAdultCount} handler={handleChange}/>
                            </div>
                        </div>
                    </DropdownItem>
                    <DropdownItem key="children">
                        <div
                            className={`w-full flex justify-between items-center gap-x-10`}>
                            <div className={`flex flex-col`}>
                                <p className={`font-medium`}>Children</p>
                                <small className={`text-neutral-500`}>Ages 2-12</small>
                            </div>
                            <div className={`flex items-center justify-center gap-x-5`}>
                                <PlusMinus getter={tripChildrenCount} setter={setTripChildrenCount}
                                           handler={handleChange}/>
                            </div>
                        </div>
                    </DropdownItem>
                    <DropdownItem key="infants">
                        <div
                            className={`w-full flex justify-between items-center gap-x-10`}>
                            <div className={`flex flex-col`}>
                                <p className={`font-medium`}>Infants</p>
                                <small className={`text-neutral-500`}>Ages 0-2</small>
                            </div>
                            <div className={`flex items-center justify-center gap-x-5`}>
                                <PlusMinus getter={tripInfantCount} setter={setTripInfantCount} handler={handleChange}/>
                            </div>
                        </div>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
}

export default GuestsDropDown;