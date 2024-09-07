import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllUserApi, deleteUserApi } from "../../apis/Api";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUserApi().then((res) => {
            setUsers(res.data.users);
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    const handleDelete = (id) => {
        const confirmDialogue = window.confirm("Are you sure you want to delete?");
        if (confirmDialogue) {
            deleteUserApi(id).then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message);
                    setUsers(users.filter(user => user._id !== id));
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    toast.error(error.response.data.message);
                } else if (error.response.status === 400) {
                    toast.error(error.response.data.message);
                }
            })
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard - Users</h1>
                </div>
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left">Full Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Address</th>
                                <th className="px-4 py-3 text-left">Profile Picture</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-700">
                                    <td className="px-4 py-3">{user.fullName}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{user.phone}</td>
                                    <td className="px-4 py-3">{user.address}</td>
                                    <td className="px-4 py-3">
                                        {user.profilePicture && (
                                            <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={`http://localhost:5000/profile/${user.profilePicture}`}
                                                alt={`${user.fullName}'s profile`}
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;