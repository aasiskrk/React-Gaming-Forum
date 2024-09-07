import React, { useState, useEffect } from 'react';
import { getUserPostsApi, deletePostApi, editPostApi } from "../../apis/Api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const UserPostPage = () => {
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editingPost, setEditingPost] = useState({ title: '', description: '', tags: '' });
    const [editingPostImage, setEditingPostImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserPosts();
    }, []);

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

    const handleEditPost = async (postId) => {
        const formData = new FormData();
        formData.append("postTitle", editingPost.title);
        formData.append("postDescription", editingPost.description);
        formData.append("postTags", editingPost.tags.split(',').map(tag => tag.trim()));

        if (editingPostImage) {
            formData.append("postPicture", editingPostImage);
        }

        try {
            const response = await editPostApi(postId, formData);

            if (response.data.success) {
                toast.success("Post updated successfully");
                setEditingPostId(null);
                setEditingPost({ title: '', description: '', tags: '' });
                setEditingPostImage(null);
                fetchUserPosts(); // Refresh the post list to reflect the updated post
            } else {
                throw new Error(response.data.message || "Failed to update post");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to update post");
        }
    };


    const handleDeletePost = async (postId) => {
        try {
            const response = await deletePostApi(postId);

            if (response.data.success) {
                toast.success("Post deleted successfully");
                // Remove the deleted post from the state
                setPosts(posts.filter(post => post._id !== postId));
            } else {
                throw new Error(response.data.message || "Failed to delete post");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to delete post");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen p-6 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">My Posts</h1>
            {posts.length === 0 ? (
                <div className="text-center text-gray-400">Post Somthing First 🫡🕹️</div>
            ) : (
                posts.map(post => (
                    <div key={post._id} className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                        {editingPostId === post._id ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleEditPost(post._id); }}>
                                <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                    className="w-full p-2 rounded-md bg-gray-600 text-white mb-2"
                                    placeholder="Title"
                                    required
                                />
                                <textarea
                                    value={editingPost.description}
                                    onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                                    className="w-full p-2 rounded-md bg-gray-600 text-white mb-2"
                                    placeholder="Description"
                                    required
                                />
                                <input
                                    type="text"
                                    value={editingPost.tags}
                                    onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value })}
                                    className="w-full p-2 rounded-md bg-gray-600 text-white mb-2"
                                    placeholder="Tags (comma separated)"
                                    required
                                />
                                <input
                                    type="file"
                                    onChange={(e) => setEditingPostImage(e.target.files[0])}
                                    className="w-full p-2 rounded-md bg-gray-600 text-white mb-2"
                                />
                                <div className="flex space-x-2">
                                    <button type="submit" className="bg-green-600 text-white py-1 px-2 rounded-md">
                                        Save
                                    </button>
                                    <button onClick={() => setEditingPostId(null)} className="bg-gray-500 text-white py-1 px-2 rounded-md">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex flex-col items-center mb-4">
                                    <h1 className="text-2xl font-bold mb-4 text-center">{post.postTitle}</h1>
                                    {post.postPicture && (
                                        <img
                                            src={`http://localhost:5000/forum/${post.postPicture}`}
                                            alt={post.postTitle}
                                            className="w-200 h-80 rounded-md mb-4"
                                        />
                                    )}
                                </div>
                                <p className="text-lg mb-4">{post.postDescription}</p>
                                <div className="flex flex-wrap space-x-2 mb-4">
                                    {post.postTags.map((tag, index) => (
                                        <span key={index} className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-4 text-gray-400">
                                    <span className="flex items-center"><FontAwesomeIcon icon={faThumbsUp} className="mr-1" /> {post.postLikes}</span>
                                    <span className="flex items-center"><FontAwesomeIcon icon={faThumbsDown} className="mr-1" /> {post.postDislikes}</span>
                                    <span className="flex items-center"><FontAwesomeIcon icon={faComment} className="mr-1" /> {post.postComments.length}</span>
                                    <span>Views: {post.postViews}</span>
                                </div>

                                <div className="flex space-x-2 mt-2">
                                    <button onClick={() => {
                                        setEditingPostId(post._id);
                                        setEditingPost({ title: post.postTitle, description: post.postDescription, tags: post.postTags.join(', ') });
                                    }} className="bg-blue-500 text-white py-1 px-2 rounded-md">
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </button>
                                    <button onClick={() => handleDeletePost(post._id)} className="bg-red-500 text-white py-1 px-2 rounded-md">
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default UserPostPage;