import React, { useState, useEffect } from 'react';
import { searchGamesApi, getAllGames } from "../../apis/Api";

const GamePage = () => {
    const [games, setGames] = useState([]);
    const [apigames, setApiGames] = useState([]);
    const [query, setQuery] = useState('games');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // const [sectionPageToken, setSectionPageToken] = useState('');


    const fetchGames = async (searchQuery = '', searchCategory = '', pageToken = '') => {
        setLoading(true);
        setError('');
        try {
            const response = await searchGamesApi(searchQuery, searchCategory, pageToken);

            console.log("API Response:", response);

            if (response.data && response.data.success) {
                const apigamesData = response.data.data.organic_results.flatMap(result => result.items || []);
                setApiGames(apigamesData);
                // setSectionPageToken(response.data.data.serpapi_pagination?.next_page_token || '');
            } else {
                setError('Failed to fetch apigames');
            }
        } catch (err) {
            console.error("Error fetching apigames:", err);
        } finally {
            setLoading(false);
        }
    };





    const handleSearch = () => {
        fetchGames(query, category);
    };

    // const handleLoadMore = () => {
    //     fetchGames(query, category, sectionPageToken);
    // };



    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        getAllGames().then((res) => {
            setGames(res.data.games);

        }).catch((err) => {
            console.log(err);
        })
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Search Games</h1>
                <div className="mb-4 flex justify-between items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="p-2 border border-white w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200 "
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Search
                    </button>
                </div>
                <div className="mb-6">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Select Category:
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    >
                        <option value="">All Categories</option>
                        <option value="action">Action</option>
                        <option value="strategy">Strategy</option>
                        <option value="puzzle">Puzzle</option>
                    </select>
                </div>
                {loading && <p className="text-blue-500 dark:text-blue-300">Loading...</p>}
                {error && <p className="text-red-500 dark:text-red-300">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3  rounded-md overflow-hidden">
                    {apigames.map((game) => (
                        <div key={game.product_id} className="bg-geda2 dark:border-gray-700 rounded-md shadow-md hover:shadow-lg transition-shadow">
                            <img src={game.thumbnail || 'https://via.placeholder.com/150'} alt={game.title} className="w-full h-48 object-cover rounded-t-md" />
                            <div className="p-4">

                                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{game.title || 'No Title'}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{game.author ? game.author.slice(0, 100) + '' : 'No author available'}</p>
                                <div className="flex items-center justify-between">
                                    <a
                                        href={game.link || '#'}
                                        className="text-blue-500 dark:text-blue-400 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View on Google Play
                                    </a>
                                    <span className="text-yellow-500 font-semibold">{game.rating || 'N/A'} ★</span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Developer Published Games</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {games.map((singleGame) => (
                            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105" key={singleGame._id}>
                                <img
                                    src={`https://testhosting-lwe7.onrender.com/games/${singleGame.gameThumbnail}`}
                                    className="w-full h-48 object-cover"
                                    alt={singleGame.gameTitle}
                                />
                                <div className="p-4">

                                    <h1 className="text-xl font-bold text-gray-100">{singleGame.gameTitle}</h1>

                                    <span className="text-sm text-gray-100">{singleGame.developerName}</span>

                                    <p className="text-gray-400 text-sm">{singleGame.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default GamePage;
