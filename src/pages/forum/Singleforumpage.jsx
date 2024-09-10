import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPost, addCommentApi, editCommentApi, deleteCommentApi, likePostApi, dislikePostApi, getUserProfileApi } from "../../apis/Api";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Singleforumpage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null); // To track which comment is being edited
    const [editingComment, setEditingComment] = useState(""); // To hold the content of the comment being edited
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await getPost(id);
            setPost(res.data.post);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch post");
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await addCommentApi(id, { userId: user._id, comment });
            toast.success("Comment added successfully");
            setComment("");
            fetchPost(); // Refresh the post to show the new comment
        } catch (err) {
            console.error(err);
            toast.error("Failed to add comment");
        }
    };

    const handleEditComment = async (commentId) => {
        try {
            await editCommentApi(id, commentId, { userId: user._id, comment: editingComment });
            toast.success("Comment updated successfully");
            setEditingCommentId(null);
            setEditingComment("");
            fetchPost(); // Refresh the post to show the updated comment
        } catch (err) {
            console.error(err);
            toast.error("Failed to update comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteCommentApi(id, commentId, { userId: user._id });
            toast.success("Comment deleted successfully");
            fetchPost(); // Refresh the post to remove the deleted comment
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete comment");
        }
    };

    const handleLike = async () => {
        try {
            await likePostApi(id, { userId: user._id });
            fetchPost(); // Refresh the post to show the updated like count
        } catch (err) {
            console.error(err);
            toast.error("Failed to like the post");
        }
    };

    const handleDislike = async () => {
        try {
            await dislikePostApi(id, { userId: user._id });
            fetchPost(); // Refresh the post to show the updated dislike count
        } catch (err) {
            console.error(err);
            toast.error("Failed to dislike the post");
        }
    };

    const [userDetails, setUserDetails] = useState({});
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

    if (!post) return <div>Loading...</div>;

    return (
        <div className="min-h-screen p-6 bg-gray-900 text-white">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center mb-4">
                    <img
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        src={`https://testhosting-lwe7.onrender.com/profile/${post.postedUser.profilePicture}`}
                        alt="User profile"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{post.postedFullname}</h2>
                        <h3 className="text-sm text-gray-400">{new Date(post.postedTime).toLocaleString()}</h3>
                    </div>
                </div>
                <div className="flex flex-col items-center mb-4">
                    <h1 className="text-3xl font-bold mb-4 text-center">{post.postTitle}</h1>
                    {post.postPicture && (
                        <img
                            src={`https://testhosting-lwe7.onrender.com/forum/${post.postPicture}`}
                            alt={post.postTitle}
                            className="w-50 rounded-md mb-4"
                        />
                    )}
                </div>
                <p className="text-lg mb-4  whitespace-pre-wrap">{post.postDescription}</p>
                <div className="flex flex-wrap space-x-2 mb-4">
                    {post.postTags.map((tag, index) => (
                        <span key={index} className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center space-x-4 text-gray-400">
                    <button onClick={handleLike} className="flex items-center focus:outline-none">
                        <FontAwesomeIcon icon={faThumbsUp} className="mr-1" /> {post.postLikes}
                    </button>
                    <button onClick={handleDislike} className="flex items-center focus:outline-none">
                        <FontAwesomeIcon icon={faThumbsDown} className="mr-1" /> {post.postDislikes}
                    </button>
                    <span className="flex items-center"><FontAwesomeIcon icon={faComment} className="mr-1" /> {post.postComments.length}</span>
                    <span>Views: {post.postViews}</span>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                <form onSubmit={handleAddComment} className="mb-6">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        required
                    ></textarea>
                    <button type="submit" className="mt-2 bg-green-600 text-white py-2 px-4 rounded-md">
                        Add Comment
                    </button>
                </form>
                <div>
                    {post.postComments.map((comment) => (
                        <div key={comment._id} className="bg-gray-700 p-4 rounded-md mb-4">
                            {editingCommentId === comment._id ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleEditComment(comment._id); }}>
                                    <textarea
                                        value={editingComment}
                                        onChange={(e) => setEditingComment(e.target.value)}
                                        className="w-full p-2 rounded-md bg-gray-600 text-white"
                                        required
                                    ></textarea>
                                    <div className="flex space-x-2 mt-2">
                                        <button type="submit" className="bg-green-600 text-white py-1 px-2 rounded-md">
                                            Save
                                        </button>
                                        <button onClick={() => setEditingCommentId(null)} className="bg-gray-500 text-white py-1 px-2 rounded-md">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className="text-white mb-2">{comment.comment}</p>
                                    <div className="text-gray-400 text-sm mb-2">Commented by: {comment.userName}</div>
                                    <div className="text-gray-400 text-sm mb-2">Commented at: {new Date(comment.commentedAt).toLocaleString()}</div>

                                    {user.fullName === comment.userName.toString() && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => {
                                                setEditingCommentId(comment._id);
                                                setEditingComment(comment.comment);
                                            }} className="bg-blue-500 text-white py-1 px-2 rounded-md">
                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteComment(comment._id)} className="bg-red-500 text-white py-1 px-2 rounded-md">
                                                <FontAwesomeIcon icon={faTrash} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Singleforumpage;
