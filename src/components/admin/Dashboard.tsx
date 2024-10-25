import { useEffect, useState } from "react";
import { BsClock, BsFillPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import Chart from "react-apexcharts";
import { RxHome } from "react-icons/rx";
import { LiaCarSideSolid } from "react-icons/lia";
import { LuUsers2 } from "react-icons/lu";
import { TbLocationCog } from "react-icons/tb";
import Notiflix from "notiflix";
import { Switch } from "@nextui-org/switch";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

const Dashboard = ({ userDetails }: { userDetails: any }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dashboardTopCards, setDashboardTopCards] = useState([
    {
      title: "Stays",
      total: 0,
      icon: <RxHome className="text-primary-900" />,
      description: "Total stays in your application",
      color: "bg-[#582D3113]",
    },
    {
      title: "Rentals",
      total: 0,
      icon: <LiaCarSideSolid className="text-primary" />,
      description: "Total rentals in your application",
      color: "bg-[#582D310A]",
    },
    {
      title: "Tours",
      total: 0,
      icon: <TbLocationCog className="text-primary-900" />,
      description: "Total Tours in your application",
      color: "bg-[#582D3113]",
    },
    {
      title: "Users",
      total: 0,
      icon: <LuUsers2 className="text-primary" />,
      description: "Total users in your application",
      color: "bg-[#582D310A]",
    },
  ]);
  const [tasks, setTasks] = useState({
    taskTitle: "",
    date: "",
    isActive: false,
  });
  const [taskItems, setTaskItems] = useState([]);

  const [stays, setStays] = useState(0);
  const [rentals, setRentals] = useState(0);
  const [tours, setTours] = useState(0);
  const [users, setUsers] = useState(0);

  const [chartData, setChartData] = useState({
    categories: [],
    stays: [],
    tours: [],
    rentals: [],
  });

  const fetchList = [
    {
      tb: "property_listing",
      setter: (data: number) => updateDashboard("Stays", data),
    },
    {
      tb: "vehicle",
      setter: (data: number) => updateDashboard("Rentals", data),
    },
    {
      tb: "tours",
      setter: (data: number) => updateDashboard("Tours", data),
    },
    {
      tb: "user",
      setter: (data: number) => updateDashboard("Users", data),
    },
  ];

  useEffect(() => {
    Notiflix.Loading.circle("Fetching data...");
    initialFetch().then(() => {
      Notiflix.Loading.remove();
    });
  }, []);

  const initialFetch = async () => {
    fetchAnalytics();
    getTasks();
    await fetchData();
  };

  const fetchData = async () => {
    await Promise.all(
      fetchList.map(async (item) => {
        try {
          const response = await fetch("/api/fetch-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tb: item.tb, count: true }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          item.setter(data[0].count);
        } catch (error) {
          // @ts-ignore
          console.error(error.message);
        }
      })
    );
  };

  const updateDashboard = (title: string, count: number) => {
    switch (title) {
      case "Users":
        setUsers(count);
        break;
      case "Stays":
        setStays(count);
        break;
      case "Rentals":
        setRentals(count);
        break;
      default:
        setTours(count);
        break;
    }

    let updatedCards = dashboardTopCards.map((card) => {
      if (card.title === title) {
        card.total = count;
      }
      return card;
    });

    setDashboardTopCards(updatedCards);
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/fetch-data/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      setChartData({
        categories: data.categories,
        stays: data.stays,
        tours: data.tours,
        rentals: data.rentals,

        
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTasks = () => {
    if (localStorage.getItem("tasksList")) {
      setTaskItems(JSON.parse(localStorage.getItem("tasksList") || "[]"));
    } else {
      setTaskItems([]);
    }
  };

  const handleTask = (e: any) => {
    const { name, value } = e.target;
    setTasks((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (localStorage.getItem("tasksList")) {
      let tasksList = JSON.parse(localStorage.getItem("tasksList") || "[]");
      tasksList.push(tasks);
      localStorage.setItem("tasksList", JSON.stringify(tasksList));
    } else {
      localStorage.setItem("tasksList", JSON.stringify([tasks]));
    }
    getTasks();
  };

  return (
    <div className="w-full h-full p-8 overflow-x-hidden overflow-y-auto custom-overflow">
      <div>
        {/*@ts-ignore*/}
        <h2 className="text-3xl">Hello, {userDetails?.name}</h2>
        <p className="mt-2 text-neutral-400">
          Hello and welcome to your central hub for managing all aspects of your
          property listings, rentals, and tours. This powerful admin panel is
          designed to provide you with a seamless and efficient way to oversee
          your business operations, all from a single, intuitive interface.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="xl:col-span-9 col-span-full">
          <div className="grid w-full gap-4 mt-6 xl:grid-cols-4 md:grid-cols-2">
            {dashboardTopCards.map((card, index) => (
              <div
                key={index}
                className={`${card.color} p-4 rounded-lg flex items-center justify-between`}
              >
                <div>
                  <span className="block text-neutral-700">{card.title}</span>
                  <span className="block mt-2 text-4xl">{card.total}</span>
                  <span className="text-neutral-400 block mt-2 text-[12px]">
                    {card.description}
                  </span>
                </div>
                <div className="text-3xl text-neutral-200">{card.icon}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3>Performance Tracking about Last 7 Days</h3>
            <hr className="my-5" />
            <div className="w-full h-full mt-8">
            <Chart
            type="area"
            options={{
                chart: {
                    id: 'area-datetime',
                    type: 'area',
                    height: 350,
                    zoom: {
                        autoScaleYaxis: true
                    }
                },
                xaxis: {
                    type: 'category',
                    categories: chartData.categories
                },
            }}
            series={[
                {
                    name: 'Stays',
                    data: chartData.stays,
                    color: '#bb9457'
                },
                {
                    name: 'Tours',
                    data: chartData.tours,
                    color: '#99582a'
                },
                {
                    name: 'Rentals',
                    data: chartData.rentals,
                    color: '#432818'
                }
            ]}
            width="100%"
            height="420px"
        />
            </div>
          </div>
        </div>

        <div className="xl:col-span-3 col-span-full xl:mt-6">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <h3>Current Task</h3>
              <button onClick={onOpen} className="rounded-full">
                <BsFillPlusCircleFill className="text-neutral-400" />
              </button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {() => (
                    <>
                      <ModalHeader className="flex flex-col gap-1 text-sm">
                        Add new Task
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex flex-col gap-4">
                          <Input
                            className="w-full"
                            label="Task Title"
                            placeholder="Enter task title"
                            value={tasks.taskTitle}
                            name="taskTitle"
                            onChange={handleTask}
                          />
                          <DatePicker
                            label="Date"
                            className="w-full"
                            onChange={(e) => {
                              handleTask({
                                target: {
                                  name: "date",
                                  value: e.year + "-" + e.month + "-" + e.day,
                                },
                              });
                            }}
                            name="date"
                          />
                          <Button
                            className="w-full mb-4"
                            onClick={handleSubmit}
                          >
                            Add Task
                          </Button>
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
            <hr className="my-5" />
            <div className="max-w-[600px]  xl:max-h-[600px] overflow-auto">
              {taskItems.length > 0 ? (
                taskItems.map((task: any, index) => (
                  <div
                    key={index}
                    className="relative flex items-center justify-between p-4 mt-4 rounded-lg bg-neutral-100"
                  >
                    <button
                      className="absolute right-2 top-2"
                      onClick={() => {
                        let tasksList = JSON.parse(
                          localStorage.getItem("tasksList") || "[]"
                        );
                        tasksList.splice(index, 1);
                        localStorage.setItem(
                          "tasksList",
                          JSON.stringify(tasksList)
                        );
                        getTasks();
                      }}
                    >
                      <BsXCircleFill className="text-primary" />
                    </button>
                    <div className="flex items-center">
                      <div className="p-2 text-xl text-white rounded-full bg-primary">
                        <BsClock />
                      </div>
                      <div className="ml-4">
                        <span className="block text-sm">{task.taskTitle}</span>
                        <span className="block text-sm text-neutral-400">
                          {task.date}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Switch
                        size="sm"
                        defaultSelected={task.isActive}
                        onChange={() => {
                          let tasksList = JSON.parse(
                            localStorage.getItem("tasksList") || "[]"
                          );
                          tasksList[index].isActive = !task.isActive;
                          localStorage.setItem(
                            "tasksList",
                            JSON.stringify(tasksList)
                          );
                          getTasks();
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="mt-4 text-center text-neutral-500">
                  No task found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
