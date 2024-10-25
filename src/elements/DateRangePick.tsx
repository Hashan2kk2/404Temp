import {DateRangePicker} from "@nextui-org/react";
import {getLocalTimeZone, today} from "@internationalized/date";
import React, {useState} from "react";

const DateRangePick = ({dateRangeLabelText, setDateRangePickerCustom, dateRangePickerCustom, handler, name}: {
    dateRangeLabelText: string,
    setDateRangePickerCustom: (value: boolean) => void,
    dateRangePickerCustom: boolean,
    handler: any,
    name: string
}) => {

    const [ccoDate, setCcoDate] = useState(
        // @ts-ignore
        `${today(getLocalTimeZone()).toDate().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
            // @ts-ignore
        })} - ${today(getLocalTimeZone()).add(1, 'day').toDate().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })}`
    );

    // @ts-ignore
    const handleDateRangeChange = (newValue) => {
        const startDate = newValue.start.toDate().toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
        const endDate = newValue.end.toDate().toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
        setCcoDate(`${startDate} - ${endDate}`);

        const formattedStartDate = `${newValue.start.toDate().getMonth() + 1}/${newValue.start.toDate().getDate()}/${newValue.start.toDate().getFullYear()}`;
        const formattedEndDate = `${newValue.end.toDate().getMonth() + 1}/${newValue.end.toDate().getDate()}/${newValue.end.toDate().getFullYear()}`;

        handler(
            {
                target: {
                    name: name,
                    value: `${formattedStartDate} - ${formattedEndDate}`
                }
            }
        );
    };

    return (
        <>
            <div className="ps-4 relative w-full h-full">
              <span className="absolute top-0 left-4 font-bold cursor-pointer"
                    onClick={() => {
                        setDateRangePickerCustom(!dateRangePickerCustom)
                    }}>{ccoDate}</span>
                <DateRangePicker
                    minValue={today(getLocalTimeZone())}
                    visibleMonths={2}
                    defaultOpen={false}
                    isOpen={dateRangePickerCustom}
                    popoverProps={{
                        placement: "bottom",
                    }}
                    calendarProps={{
                        classNames: {
                            base: 'bg-white dark:bg-gray-800',
                            gridHeader: 'shadow-none dark:bg-gray-800',
                            headerWrapper: 'font-bold py-4 text-black dark:bg-gray-800',
                        }
                    }}
                    classNames={{
                        inputWrapper: 'bg-white text-white shadow-none hover:bg-white opacity-0 h-0 w-0',
                        selectorButton: 'opacity-0',
                    }}
                    onChange={handleDateRangeChange}
                    selectorButtonProps={{
                        onClick: () => {
                            setDateRangePickerCustom(!dateRangePickerCustom);
                        }
                    }}
                />
                <span className="text-neutral-400 absolute left-4 top-[1.6rem]">{dateRangeLabelText}</span>
            </div>
        </>
    );
}

export default DateRangePick;