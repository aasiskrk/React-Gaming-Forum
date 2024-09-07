// ProfileUpdate.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserProfileApi, updateProfileApi } from '../../apis/Api';
import Profilepage from './Profilepage';

const ProfileUpdate = () => {
    const { id } = useParams();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [profileNewImage, setProfileNewImage] = useState(null);
    const [previewNewImage, setPreviewNewImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getUserProfileApi(id)
                .then((res) => {
                    setFullName(res.data.user.fullName);
                    setEmail(res.data.user.email);
                    setAddress(res.data.user.address);
                    setPhone(res.data.user.phone);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleImage = (event) => {
        const file = event.target.files[0];
        setProfileNewImage(file);
        setPreviewNewImage(URL.createObjectURL(file));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('address', address);
        formData.append('phone', phone);
        if (profileNewImage) {
            formData.append('profilePicture', profileNewImage);
        }
        updateProfileApi(id, formData)
            .then((res) => {
                if (res.status === 200) {

                    toast.success(res.data.message);

                }

            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                if (error.response && error.response.status === 500) {
                    toast.error(error.response.data.message);
                } else if (error.response && error.response.status === 400) {
                    toast.warning(error.response.data.message);
                } else {
                    toast.error('An unexpected error occurred');
                }
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="bg-geda2 min-h-screen p-10">
                <h2 className="text-2xl font-bold mb-4 text-white">
                    Update Profile for <span className="text-blue-600">{fullName}</span>
                </h2>
                <div className="d-flex gap-3">
                    <form onSubmit={handleUpdate} className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="firstName" className="text-gray-700 dark:text-gray-200">
                            Name
                        </label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="form-control mb-4"
                            type="text"
                            placeholder="Enter your full name"
                        />


                        <label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control mb-4"
                            type="email"
                            placeholder="Enter your email"
                        />

                        <label htmlFor="address" className="text-gray-700 dark:text-gray-200">
                            Address
                        </label>
                        <textarea
                            value={address}
                            // ProfileUpdate.jsx (continued)
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-control mb-4"
                            placeholder="Enter your address"
                        ></textarea>

                        <label htmlFor="phone" className="text-gray-700 dark:text-gray-200">
                            Phone
                        </label>
                        <textarea
                            value={phone}
                            // ProfileUpdate.jsx (continued)
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control mb-4"
                            placeholder="Enter your Phone Number"
                        ></textarea>

                        <label htmlFor="profileImage" className="text-gray-700 dark:text-gray-200">
                            Choose Profile Image
                        </label>
                        <input
                            onChange={handleImage}
                            type="file"
                            className="form-control mb-4"
                            accept="image/*"
                        />

                        <button
                            onClick={handleUpdate}
                            type="submit"
                            className="bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                            Update Profile
                        </button>
                    </form>
                    <div className="image-section">
                        {previewNewImage && (
                            <div>
                                <h6 className="text-gray-700 dark:text-gray-200 mb-2">New Image Preview</h6>
                                <img
                                    src={previewNewImage}
                                    alt="New Profile"
                                    height={'300px'}
                                    width={'300px'}
                                    className="img-fluid object-fit-cover rounded-4 shadow-md"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileUpdate;