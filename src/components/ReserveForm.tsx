import GuestsDropDown from "@/elements/GuestsDropDown";
import PrimaryButton from "@/elements/PrimaryButton";
import { Chip, DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, today } from "@internationalized/date";

const ReserveForm = ({
  formData,
  setFormData,
  handler,
  type,
  formHandler,
  unavailableDates,
}: {
  formData: any;
  setFormData: any;
  handler: any;
  type: "vehicle" | "tours" | "property_listing";
  formHandler?: any;
  unavailableDates?: Array<string>;
}) => {

  const isDateUnavailable = (dateValue: any) => {
    const date = new Date(dateValue);

    const formattedUnavailableDates = unavailableDates?.map(dateStr => new Date(dateStr));

    return (
      formattedUnavailableDates?.some(
        (unavailableDate) =>
          date.getFullYear() === unavailableDate.getFullYear() &&
          date.getMonth() === unavailableDate.getMonth() &&
          date.getDate() === unavailableDate.getDate()
      ) || false
    );
  };

  return (
    <div className="flex flex-col gap-y-3">
      <h2>Reservation</h2>
      <hr
        className={`w-full border border-neutral-200 dark:border-neutral-600 max-w-[100px] -mt-1`}
      />

      <div className="flex flex-col gap-y-3">
        <div
          className={`bg-neutral-100 p-2 rounded-xl hover:bg-neutral-200 ${type === "property_listing" ? "" : "hidden"
            }`}
        >
          <GuestsDropDown
            arrowIcon={false}
            className="text-[12px]"
            dropDownClassName="mt-6"
            handler={formHandler}
            name="guestCount"
          />
          <span className="text-neutral-400">Guests</span>
        </div>

        <DatePicker
          isDateUnavailable={isDateUnavailable}
          label="Booking Dates"
          className="w-full"
          minValue={today(getLocalTimeZone())}
          showMonthAndYearPickers
          onChange={(e: any) => {
            const selectedDate = new Date(e);
            const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1
              }-${selectedDate.getDate()}`;

            const isDateSelected =
              formData.bookingDates.includes(formattedDate);
            const isDateUnavailable = unavailableDates?.includes(formattedDate);
            const isPastDate = new Date() > selectedDate;

            if (!isDateSelected && !isDateUnavailable && !isPastDate) {
              setFormData({
                ...formData,
                bookingDates: [...formData.bookingDates, formattedDate],
              });
            }
          }}
          name="bookingDates"
        />
      </div>

      <div>
        {formData.bookingDates.map((slot: any, index: any) => (
          <Chip
            key={index}
            color="primary"
            className="ms-2 my-1 px-2 text-[12px]"
            onClose={() => {
              const slots = formData.bookingDates.filter(
                // @ts-ignore
                (_, i) => i !== index
              );
              setFormData({
                ...formData,
                bookingDates: slots,
              });
            }}
          >
            {slot}
          </Chip>
        ))}
      </div>

      <PrimaryButton
        content={"Reserve"}
        className={"w-full"}
        events={handler}
      />
    </div>
  );
};

export default ReserveForm;
