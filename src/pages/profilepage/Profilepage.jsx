import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";

import { getUserProfileApi, deleteUserApi } from '../../apis/Api';
import { Link, useNavigate } from 'react-router-dom';

const Profilepage = () => {
    const [userDetails, setUserDetails] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const userId = JSON.parse(localStorage.getItem('user'))._id;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getUserProfileApi(userId);
                if (response.data.success) {
                    setUserDetails(response.data.user);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleDelete = (id) => {
        const confirmDialogue = window.confirm("Are you sure you want to delete?");
        if (confirmDialogue) {
            deleteUserApi(id).then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message);
                    localStorage.clear();
                    navigate('/login');
                    window.location.reload();
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
    //logout function
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    }
    const profileImageUrl = userDetails.profilePicture
        ? `http://localhost:5000/profile/${userDetails.profilePicture}`
        : '';

    return (
        <>
            <div className='bg-gray-800 min-h-screen p-10'>
                <div className="avatar flex justify-center">
                    <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                        <img className="h-55 w-55 rounded-full object-cover" src={previewImage || profileImageUrl} />
                    </div>
                </div>

                <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm dark:border-gray-700 mt-10">
                    <dl className="-my-3 divide-y divide-gray-100 text-sm dark:divide-gray-700">
                        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                            <dt className="font-medium text-gray-900 dark:text-white">Name</dt>
                            <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">{userDetails.fullName}</dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                            <dt className="font-medium text-gray-900 dark:text-white">Email</dt>
                            <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">{userDetails.email}</dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                            <dt className="font-medium text-gray-900 dark:text-white">Address</dt>
                            <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">{userDetails.address}</dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                            <dt className="font-medium text-gray-900 dark:text-white">Phone Number</dt>
                            <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">{userDetails.phone}</dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-10 flex justify-end space-x-4">
                    <Link
                        to={`update/${userDetails._id}`}
                        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                        Update Profile / Add Profile Image
                    </Link>



                    <button
                        onClick={() => handleDelete(userDetails._id)}

                        className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                        Delete Account
                    </button>


                </div>
            </div>
        </>
    );
};

export default Profilepage;
