import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FaRegComment, FaRegThumbsUp, FaRegThumbsDown, FaRegEye } from 'react-icons/fa';

const Forumpostcard = ({ forumInfo, onLike, onDislike, onComment, onViewFull }) => {
    const formattedDate = format(new Date(forumInfo.postedTime), 'MMM d, yyyy • h:mm a');

    const handleClick = (event, handler) => {
        event.stopPropagation();
        handler();
    };



    return (
        <div className=" bg-geda rounded-xl shadow-md overflow-hidden text-white ">
            <div className="">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-3">

                        <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={`http://localhost:5000/profile/${forumInfo.postedUser.profilePicture}`}
                            alt={forumInfo.postedFullname}
                        />


                        <div>
                            <p className="text-lg font-semibold">{forumInfo.postedFullname}</p>
                            <p className="text-sm text-gray-300">{formattedDate}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {forumInfo.postTags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-semibold text-gray-200 bg-gray-700 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mb-4 pl-6" onClick={onViewFull}>
                    <h2 className="text-xl font-bold mb-2 cursor-pointer hover:underline">{forumInfo.postTitle}</h2>
                </div>

                {forumInfo.postPicture && (
                    <img
                        src={`http://localhost:5000/forum/${forumInfo.postPicture}`}
                        alt={forumInfo.postTitle}
                        className="w-full h-64 object-cover"
                        onClick={onViewFull}
                    />
                )}

                <div className="flex items-center justify-between text-sm text-gray-300 p-6">
                    <div className="flex space-x-4">
                        <button onClick={(event) => handleClick(event, onComment)} className="flex items-center hover:text-white">
                            <FaRegComment className="mr-2" />
                            <span>{forumInfo.postComments.length}</span>
                        </button>
                        <button onClick={(event) => handleClick(event, onLike)} className="flex items-center hover:text-white">
                            <FaRegThumbsUp className="mr-2" />
                            <span>{forumInfo.postLikes}</span>
                        </button>
                        <button onClick={(event) => handleClick(event, onDislike)} className="flex items-center hover:text-white">
                            <FaRegThumbsDown className="mr-2" />
                            <span>{forumInfo.postDislikes}</span>
                        </button>
                    </div>
                    <div className="flex items-center">
                        <FaRegEye className="mr-2" />
                        <span>{forumInfo.postViews} views</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forumpostcard;
