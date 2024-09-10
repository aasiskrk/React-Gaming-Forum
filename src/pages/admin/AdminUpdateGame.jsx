import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSingleGame, updateGame } from '../../apis/Api';
import { toast } from 'react-toastify';

const AdminUpdateGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gameTitle, setGameTitle] = useState('');
    const [developerName, setDeveloperName] = useState('');
    const [gameDescription, setGameDescription] = useState('');
    const [newThumbnail, setNewThumbnail] = useState(null);
    const [previewNewThumbnail, setPreviewNewThumbnail] = useState(null);
    const [oldThumbnail, setOldThumbnail] = useState('');

    useEffect(() => {
        getSingleGame(id)
            .then((res) => {
                setGameTitle(res.data.game.gameTitle);
                setDeveloperName(res.data.game.developerName);
                setGameDescription(res.data.game.description);
                setOldThumbnail(res.data.game.gameThumbnail);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Failed to fetch game details");
            });
    }, [id]);

    const handleThumbnail = (event) => {
        const file = event.target.files[0];
        setNewThumbnail(file);
        setPreviewNewThumbnail(URL.createObjectURL(file));
    };

    const handleUpdateGame = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('gameTitle', gameTitle);
        formData.append('description', gameDescription);
        formData.append('developerName', developerName);
        if (newThumbnail) {
            formData.append('thumbnail', newThumbnail);
        }

        updateGame(id, formData)
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data.message);
                    navigate("/admin/game");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 500) {
                    toast.error(error.response.data.message);
                } else if (error.response && error.response.status === 400) {
                    toast.warning(error.response.data.message);
                }
            });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">
                    Update Game: <span className="text-blue-500">{gameTitle}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <form onSubmit={handleUpdateGame} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="gameTitle">Game Title</label>
                            <input
                                id="gameTitle"
                                value={gameTitle}
                                onChange={(e) => setGameTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Enter game title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="developerName">Developer Name</label>
                            <input
                                id="developerName"
                                value={developerName}
                                onChange={(e) => setDeveloperName(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Enter developer name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="gameDescription">Game Description</label>
                            <textarea
                                id="gameDescription"
                                value={gameDescription}
                                onChange={(e) => setGameDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter game description"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="gameThumbnail">Choose Game Thumbnail</label>
                            <input
                                id="gameThumbnail"
                                onChange={handleThumbnail}
                                type="file"
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                           file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                                           file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                        </div>

                        <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200">
                            Update Game
                        </button>
                    </form>

                    <div className="space-y-4">
                        <div>
                            <h6 className="text-lg font-semibold mb-2">Current Thumbnail</h6>
                            <img
                                src={`https://testhosting-lwe7.onrender.com/games/${oldThumbnail}`}
                                className="w-full h-64 object-cover rounded-lg"
                                alt="Current game thumbnail"
                            />
                        </div>

                        {previewNewThumbnail && (
                            <div>
                                <h6 className="text-lg font-semibold mb-2">New Thumbnail Preview</h6>
                                <img
                                    src={previewNewThumbnail}
                                    alt="New game thumbnail"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUpdateGame;