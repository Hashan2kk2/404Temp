import React, {useEffect, useState} from "react";
import {Chip, Input, Switch} from "@nextui-org/react";
import {FiSearch} from "react-icons/fi";
import Notiflix from "notiflix";

const ManageUsers = ({userDetails}: { userDetails: any }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers().then(r => r);
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/user/fetch-update');

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            const formattedUsers = data.map((user: any) => ({
                id: user.id,
                name: user.firstName ? user.firstName : '' + ' ' + user.lastName? user.lastName : '',
                email: user.email,
                country: user.country,
                createdAt: user.createTime,
                status: user.status
            }));

            setUsers(formattedUsers);

        } catch (error: any) {
            console.error(error.message);
        }
    };

    const handleStatusChange = async (userId: string, status: string) => {
        Notiflix.Loading.circle('Updating..');

        const newStatus = status === 'Active' ? 'Disabled' : 'Active';

        const response = await fetch('/api/user/fetch-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                status: newStatus
            })
        });

        if (!response.ok) {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('Failed to update');
            throw new Error('Failed to update');
        }

        const resp = await response.json();
        if (resp === "Success") {
            Notiflix.Loading.remove();
            Notiflix.Notify.success('Update Successful');

            // @ts-ignore
            setUsers(users.map((user: any) => {
                    if (user.id === userId) {
                        user.status = newStatus;
                    }
                    return user;
                }
            ));
        }

    };

    const handleSearch = (e: any) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredUsers = users.filter((user: any) => {
            return user.name.toLowerCase().includes(searchValue);
        });
        setUsers(filteredUsers);

        if (searchValue === '') {
            fetchUsers().then(r => r);
        }
    };

    return (
        <div className="w-full h-full p-8 overflow-x-hidden overflow-y-auto custom-overflow">
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-x-4">
                    <h1>Manage Users</h1>
                    <Chip>{users.length}</Chip>
                </div>

                <Input
                    type="text"
                    label="Search"
                    startContent={<FiSearch className="text-neutral-400"/>}
                    placeholder="Search users by name.."
                    onKeyUp={handleSearch}
                />
            </div>
            <hr className="my-4"/>

            <div className="grid w-full grid-cols-1 gap-4">
                {users.map((user: {
                    id: any;
                    name: string;
                    email: string;
                    country: string;
                    createdAt: any;
                    status: string;
                }) => (
                    <div key={user.id}>
                        <div
                            className="grid items-center grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4 bg-neutral-100 rounded-xl">
                            <div className="text-sm">
                                <h2>{user.name}</h2>
                                <p className="text-neutral-500">{user.email}</p>
                            </div>

                            <span className="text-[12px] text-neutral-400">Country : {user.country}</span>
                            <span className="text-[12px] text-neutral-400">Created At : &nbsp;
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center justify-end gap-3 lg:col-span-1">
                                <span className="text-[12px] text-neutral-400">{user.status}</span>
                                <Switch
                                    defaultSelected={user.status === 'Active'}
                                    onChange={() => {
                                        handleStatusChange(user.id, user.status).then(r => r);
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageUsers;
