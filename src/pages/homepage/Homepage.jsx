import { toast } from "react-toastify";
import { forumPostApi, getPaginatedApi, likePostApi, dislikePostApi, viewPostApi, getAllUserApi, getUserProfileApi } from "../../apis/Api";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Forumpostcard from "../../components/Forumpostcard";
import Sidebar from "../../components/Sidebar";
import { Loader2, ThumbsUp, ThumbsDown, Eye, MessageSquare, PlusCircle } from "lucide-react"

const Homepage = () => {
    const [posts, setPosts] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [limit, setLimit] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [users, setUsers] = useState([]);
    const [sortOption, setSortOption] = useState('mostRecent');
    const [isLoading, setIsLoading] = useState(false);

    const [userDetails, setUserDetails] = useState({});



    useEffect(() => {
        getAllUserApi().then((res) => {
            setUsers(res.data.users);
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        getPaginatedApi(pageNumber, limit, sortOption).then((res) => {
            setPosts(res.data.posts);
            setTotalPages(Math.ceil(res.data.totalCount / limit));
        }).catch((err) => {
            console.log(err);
        });
    }, [pageNumber, limit, sortOption]);

    const formatPostedTime = (postedTime) => {
        const postedDate = new Date(postedTime);
        return postedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postTags, setPostTags] = useState([]);
    const [postPicture, setPostPicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setPostPicture(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user || !user._id) {
            toast.error("User not authenticated");
            return;
        }

        const formData = new FormData();
        formData.append("postTitle", postTitle);
        formData.append("postDescription", postDescription);
        formData.append("postTags", JSON.stringify(postTags));
        formData.append("postPicture", postPicture);
        formData.append("postedUser", user._id);
        formData.append("postedFullname", user.fullName);

        forumPostApi(formData)
            .then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message);
                    setPostTitle("");
                    setPostDescription("");
                    setPostTags("");
                    setPostPicture(null);
                    setPreviewImage(null);
                    setIsExpanded(false);
                    window.location.reload();
                } else {
                    toast.error("Something went wrong in the frontend!");
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 400) {
                        toast.error(error.response.data.message);
                    } else if (error.response.status === 401) {
                        toast.error(error.response.data.message);
                    }
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("No response");
                }
            });
    };

    const handleCancel = () => {
        setPostTitle("");
        setPostDescription("");
        setPostTags("");
        setPostPicture(null);
        setPreviewImage(null);
        setIsExpanded(false);
    };

    // const handleTagChange = (e) => {
    //     const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    //     setPostTags(tags);
    // };


    const handleLike = (postId) => {
        if (!user || !user._id) {
            toast.error("You need to be logged in first🫡.");
            navigate('/login');
            return;
        }

        // Optimistically update the UI
        const updatedPosts = posts.map(post =>
            post._id === postId ? { ...post, likes: post.likes + 1 } : post
        );
        setPosts(updatedPosts);

        likePostApi(postId)
            .then((res) => {
                toast.success("Post liked successfully");
                // Optionally, you can refresh the posts from the server here
                getPaginatedApi(pageNumber, limit, sortOption)
                    .then((res) => {
                        setPosts(res.data.posts);
                        setTotalPages(Math.ceil(res.data.totalCount / limit));
                    })
                    .catch((err) => {
                        toast.error("Failed to refresh posts");
                    });
            })
            .catch((err) => {
                toast.error("Failed to like post");
                // Revert the optimistic update in case of an error
                setPosts(posts);
            });
    };


    const handleDislike = (postId) => {
        if (!user || !user._id) {
            toast.error("You need to be logged in first🫡.");
            navigate('/login');
            return;
        }

        // Optimistically update the UI
        const updatedPosts = posts.map(post =>
            post._id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
        );
        setPosts(updatedPosts);

        dislikePostApi(postId)
            .then((res) => {
                toast.success("Post disliked successfully");
                // Optionally, you can refresh the posts from the server here
                getPaginatedApi(pageNumber, limit, sortOption)
                    .then((res) => {
                        setPosts(res.data.posts);
                        setTotalPages(Math.ceil(res.data.totalCount / limit));
                    })
                    .catch((err) => {
                        toast.error("Failed to refresh posts");
                    });
            })
            .catch((err) => {
                toast.error("Failed to dislike post");
                // Revert the optimistic update in case of an error
                setPosts(posts);
            });
    };


    const handleView = (postId) => {
        viewPostApi(postId)
            .then((res) => {
                toast.success("Post viewed successfully");
                window.location.reload();
            })
            .catch((err) => {
                toast.error("Failed to view post");
            });
    };


    const handlePostClick = (id) => {
        if (!id) {
            toast.error("Invalid post ID");
            return;
        }
        viewPostApi(id)
            .then(() => {
                navigate(`/forum/${id}`);
            }).catch((error) => {
                toast.error("failed to update view count");
                console.error(error);
            })
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <>
            <div className="flex min-h-screen">
                {user && (
                    <>
                        <Sidebar user={user} className=" w-20" />
                    </>
                )}
                <div className="flex-1 bg-gray-900 p-6">
                    {user && (


                        <div className=" bg-geda p-6 rounded-lg shadow-md mb-3">


                            <div className="p-1">
                                {!isExpanded && (
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            placeholder="What's on your mind?"
                                            className="flex-1 bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                                            onFocus={() => setIsExpanded(true)}
                                        />
                                        <button onClick={() => setIsExpanded(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center transition duration-300">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Create Post
                                        </button>
                                    </div>
                                )}
                            </div>
                            {isExpanded && (
                                <div className="mt-4 p-4 bg-geda2 rounded-lg shadow-md">
                                    <h1 className="text-white mb-3 font-bold">Create a Forum Post</h1>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            type="text"
                                            value={postTitle}
                                            onChange={(e) => setPostTitle(e.target.value)}
                                            placeholder="Title"
                                            className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                                            required
                                        />
                                        <textarea
                                            value={postDescription}
                                            onChange={(e) => setPostDescription(e.target.value)}
                                            placeholder="Description"
                                            className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={postTags}
                                            onChange={(e) => setPostTags(e.target.value)}
                                            placeholder="Tags (comma separated)"
                                            className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                                            required
                                        />
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                onChange={handleImageUpload}
                                                className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                                            />
                                            {previewImage && (
                                                <img src={previewImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                                            )}
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button onClick={handleCancel} className="border border-gray-600 text-gray-300 hover:bg-gray-700 font-bold py-2 px-4 rounded-md transition duration-300">
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center transition duration-300">
                                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sorting Section */}
                    <div className="bg-geda p-4 rounded-lg shadow-md mb-6">
                        <h2 className="text-white text-lg font-bold mb-2">Sort Posts By</h2>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                        >
                            <option value="mostRecent">Most Recent</option>
                            <option value="oldest">Oldest</option>
                            <option value="mostLiked">Most Liked (Hottest)</option>
                            <option value="mostViews">Most Views (Trending)</option>
                        </select>
                    </div>

                    {/* post section */}
                    <div className="grid gap-5">
                        {posts.map((post) => (
                            <div key={post._id} className="" onClick={() => handlePostClick(post._id)}>
                                <Forumpostcard
                                    forumInfo={post}
                                    onLike={() => handleLike(post._id)}
                                    onDislike={() => handleDislike(post._id)}
                                    onComment={() => handlePostClick(post._id)}
                                    onViewFull={() => handlePostClick(post._id)}

                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center space-x-4 p-4">
                        <button
                            onClick={() => {
                                setPageNumber(pageNumber - 1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            disabled={pageNumber === 1}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => {
                                setPageNumber(pageNumber + 1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            disabled={pageNumber === totalPages}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

        </>

    );
};

export default Homepage;
