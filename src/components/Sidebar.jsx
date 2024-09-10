import { getUserProfileApi, getUserPostsApi } from "../apis/Api";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';



const Sidebar = ({ user }) => {

    const userId = JSON.parse(localStorage.getItem('user'))._id;

    const [userDetails, setUserDetails] = useState({});

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await getUserPostsApi(userId);
                setPosts(response.data.posts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
                // toast.error('Failed to fetch posts');
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [userId]);

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





    const profileImageUrl = userDetails.profilePicture
        ? `https://testhosting-lwe7.onrender.com/profile/${userDetails.profilePicture}`
        : '';
    return (
        <div className="flex sticky flex-col justify-between border-e border-geda bg-geda2">
            <div className="px-6 py-6">
                <ul className="mt-6 space-y-1">
                    <li>
                        <a href="#" className="block rounded-lg bg-merogreen px-4 py-2 text-sm font-medium text-gray-700">
                            Home
                        </a>
                    </li>
                    <Link to={`/user/user_posts/${userId}`} className="block rounded-lg text-gray-500 hover:bg-merogreen px-4 py-2 text-sm font-medium">
                        My Posts
                    </Link>





                    {/* <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-merogreen hover:text-gray-700">
                                <span className="text-sm font-medium">Moderation</span>
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </summary>
                            <ul className="mt-2 space-y-1 px-4">
                                <li>
                                    <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-merogreen hover:text-gray-700">
                                        Reported Posts
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-merogreen hover:text-gray-700">
                                        User Management
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-merogreen hover:text-gray-700">
                                        Banned Users
                                    </a>
                                </li>
                            </ul>
                        </details>
                    </li> */}


                    <li>
                        <Link to={"/help"} className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-merogreen hover:text-gray-700">
                            Help Center
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="sticky inset-x-0 bottom-0 border-t border-backgeda">
                <a href="#" className="flex items-center gap-2 text-white bg-geda p-4">
                    <img alt="" src={profileImageUrl} className="size-10 rounded-full object-cover" />
                    <div>
                        <p className="text-xs">
                            <strong className="block font-medium">{user.fullName}</strong>
                            <span>{user.email}</span>
                        </p>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
