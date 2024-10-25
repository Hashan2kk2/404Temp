import {DatePicker} from "@nextui-org/react";
import {getLocalTimeZone, today} from "@internationalized/date";
import React, {useState} from "react";

const DatePick = ({dateLabelText, setDatePickerCustom, datePickerCustom}: {
    dateLabelText: string,
    setDatePickerCustom: (value: boolean) => void,
    datePickerCustom: boolean
}) => {

    const [ccoDate, setCcoDate] = useState(
        // @ts-ignore
        `${today(getLocalTimeZone()).toDate().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })}`
    );

    // @ts-ignore
    const handleDateChange = (newValue) => {
        const startDate = newValue.toDate().toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
        setCcoDate(startDate);
    }

    return (
        <>
            <div className="ps-4 relative w-full h-full">
              <span className="absolute top-0 left-4 font-bold cursor-pointer z-10"
                    onClick={() => {
                        setDatePickerCustom(!datePickerCustom)
                    }}>{ccoDate}</span>
                <DatePicker
                    minValue={today(getLocalTimeZone())}
                    visibleMonths={2}
                    defaultOpen={false}
                    isOpen={datePickerCustom}
                    popoverProps={{
                        placement: "bottom",
                    }}
                    selectorButtonProps={{
                        onClick: () => {
                            setDatePickerCustom(!datePickerCustom);
                        }
                    }}
                    calendarProps={{
                        classNames: {
                            base: 'bg-white',
                            gridHeader: 'shadow-none',
                            headerWrapper: 'font-bold py-4 text-black',
                        }
                    }}
                    classNames={{
                        selectorButton: 'opacity-0',
                    }}
                    dateInputClassNames={{
                        input: 'bg-white text-white shadow-none hover:bg-white opacity-0 h-0 w-0',
                        inputWrapper: 'bg-white text-white shadow-none hover:bg-white opacity-0 h-0 w-0',
                    }}
                    onChange={handleDateChange}
                />
                <span className="text-neutral-400 absolute left-4 top-[1.6rem]">{dateLabelText}</span>
            </div>
        </>
    );
}

export default DatePick;