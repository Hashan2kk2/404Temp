import { Accordion, AccordionItem, Avatar, Tab, Tabs } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import TourForm from "@/components/admin/TourForm";

const ManageTours = ({ userDetails }: { userDetails: any }) => {

    const [tourData, setTourData] = useState([]);
    const [tourImages, setTourImages] = useState([]);

    useEffect(() => {
        fetchTourData();
    }, []);

    const fetchTourData = async () => {
        try {
            const response = await fetch('/api/fetch-data/tours');

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setTourData(data.toursList);
            setTourImages(data.tourImages);

        } catch (error: any) {
            console.error(error.message)
        }
    };

    return (
        <div className="w-full h-full p-8 overflow-y-auto overflow-x-hidden custom-overflow">
            <h1>Manage Tours</h1>
            <hr className="my-4" />

            <div className="flex w-full flex-col">
                <Tabs aria-label="Options">

                    <Tab key="Insert" title="Insert Tour">
                        <TourForm fetchTourData={fetchTourData} isUpdate={false} />
                    </Tab>

                    <Tab key="Update" title="Update Existing Tours">
                        <Accordion>
                            {tourData.map((tour: any, index) => (
                                <AccordionItem
                                    key={index}
                                    aria-label="Chung Miller"
                                    startContent={
                                        <Avatar
                                            color="primary"
                                            radius="lg"
                                            // @ts-ignore
                                            src={'..' + tourImages.find((image: any) => image.tourId === tour.id)?.image}
                                        />
                                    }
                                    subtitle={tour.description.des}
                                    title={tour.title}
                                >

                                    {/*@ts-ignore*/}
                                    <TourForm fetchTourData={fetchTourData} isUpdate={true} tourData={tourData} tourImages={tourImages} tourId={tour.id} />

                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Tab>

                </Tabs>
            </div>
        </div>
    )
}

export default ManageTours;