import { Accordion, AccordionItem, Avatar, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import RentalForm from "@/components/admin/RentalForm";
import TourForm from "./TourForm";

const ManageRentals = ({ userDetails }: { userDetails: any }) => {

    const [rentalData, setRentalData] = useState<any>([]);
    const [rentalImages, setRentalImages] = useState<any>([]);

    useEffect(() => {
        fetchRentalData('all');
    }, []);

    const fetchRentalData = async (tb: 'all') => {
        try {
            const response = await fetch('/api/fetch-data/rental', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tb: tb
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json(); 
            setRentalData(data.rentalList);
            setRentalImages(data.vehicleImages);

        } catch (error: any) {
            console.error(error.message)
        }
    };

    return (
        <div className="w-full h-full p-8 overflow-y-auto overflow-x-hidden custom-overflow">
            <h1>Manage Rentals</h1>
            <hr className="my-4" />

            <div className="flex w-full flex-col">
                <Tabs aria-label="Options">

                    <Tab key="Insert" title="Insert">
                        <RentalForm />
                    </Tab>

                    <Tab key="Update" title="Update Existing Rentals">

                        <Accordion>
                            {rentalData.map((rental: any, index:any) => (
                                <AccordionItem
                                    key={index}
                                    title={rental.vehicleBrand + ' - ' + rental.model}
                                    subtitle={rental.vehicleNumber}
                                    startContent={
                                        <Avatar
                                            color="primary"
                                            radius="lg"
                                            src={'..' + rentalImages.find((image: any) => image.vehicleId === rental.id)?.image}
                                        />
                                    }
                                >
                                    <RentalForm rentalId={rental.id} fetchRentalData={fetchRentalData} isUpdate={true} rentalData={rentalData} rentalImages={rentalImages} />
                                </AccordionItem>
                            ))}
                        </Accordion>

                    </Tab>

                </Tabs>
            </div>
        </div>
    );
}

export default ManageRentals;