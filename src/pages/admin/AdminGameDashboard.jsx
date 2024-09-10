import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createGameApi, deleteGame, getAllGames } from "../../apis/Api";
import { Link } from "react-router-dom";
import { Trash2, Edit, Plus } from "lucide-react";

const AdminGameDashboard = () => {
    const [games, setGames] = useState([]);
    const [gameTitle, setGameTitle] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    const [gameDeveloper, setGameDeveloper] = useState("");
    const [gameImage, setGameImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = () => {
        getAllGames().then((res) => {
            setGames(res.data.games);
        }).catch((err) => {
            console.log(err);
            toast.error("Failed to fetch games");
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setGameImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this game?")) {
            deleteGame(id).then((res) => {
                toast.success(res.data.message);
                fetchGames();
            }).catch((error) => {
                toast.error(error.response?.data?.message || "Failed to delete game");
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('gameTitle', gameTitle);
        formData.append('description', gameDescription);
        formData.append('developerName', gameDeveloper);
        formData.append('gameThumbnail', gameImage);

        createGameApi(formData).then((res) => {
            toast.success(res.data.message);
            setIsModalOpen(false);
            fetchGames();
            resetForm();
        }).catch((error) => {
            toast.error(error.response?.data?.message || "Failed to create game");
        });
    };

    const resetForm = () => {
        setGameTitle("");
        setGameDescription("");
        setGameDeveloper("");
        setGameImage(null);
        setPreviewImage(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Game Management</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Game
                    </button>
                </div>
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left">Game Image</th>
                                <th className="px-4 py-3 text-left">Game Title</th>
                                <th className="px-4 py-3 text-left">Developer</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {games.map((game) => (
                                <tr key={game._id} className="hover:bg-gray-700">
                                    <td className="px-4 py-3">
                                        <img className="h-10 w-10 rounded-full object-cover" src={`https://testhosting-lwe7.onrender.com/games/${game.gameThumbnail}`} alt={game.gameTitle} />
                                    </td>
                                    <td className="px-4 py-3">{game.gameTitle}</td>
                                    <td className="px-4 py-3">{game.developerName}</td>
                                    <td className="px-4 py-3">{game.description}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex space-x-2">
                                            <Link to={`/admin/update/${game._id}`} className="text-blue-500 hover:text-blue-600 transition-colors duration-200">
                                                <Edit size={20} />
                                            </Link>
                                            <button onClick={() => handleDelete(game._id)} className="text-red-500 hover:text-red-600 transition-colors duration-200">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create a new game</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="gameTitle" className="block text-sm font-medium text-gray-300">Game Title</label>
                                <input
                                    id="gameTitle"
                                    type="text"
                                    value={gameTitle}
                                    onChange={(e) => setGameTitle(e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter Game Title"
                                />
                            </div>
                            <div>
                                <label htmlFor="gameDeveloper" className="block text-sm font-medium text-gray-300">Game Developer</label>
                                <input
                                    id="gameDeveloper"
                                    type="text"
                                    value={gameDeveloper}
                                    onChange={(e) => setGameDeveloper(e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter Game Developer"
                                />
                            </div>
                            <div>
                                <label htmlFor="gameDescription" className="block text-sm font-medium text-gray-300">Game Description</label>
                                <textarea
                                    id="gameDescription"
                                    value={gameDescription}
                                    onChange={(e) => setGameDescription(e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Describe the game..."
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label htmlFor="gameImage" className="block text-sm font-medium text-gray-300">Game Image</label>
                                <input
                                    id="gameImage"
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="mt-1 block w-full text-sm text-gray-300
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-600 file:text-white
                                    hover:file:bg-blue-700"
                                />
                                {previewImage && (
                                    <img src={previewImage} alt="Game preview" className="mt-2 rounded-md max-h-40 object-cover" />
                                )}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Add Game
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGameDashboard;