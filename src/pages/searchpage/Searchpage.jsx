import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const SearchResults = () => {
    const location = useLocation();
    const { query, results } = location.state || { query: '', results: [] };

    return (
        <>
            <div className='min-h-screen     bg-gray-800'>
                <div className="container mx-auto pt-8 px-4">
                    <h1 className="text-2xl text-white font-bold mb-4">Search Results for "{query}"</h1>
                    {results.length === 0 ? (
                        <p className='text-white'>No results found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {results.map((post) => (
                                <li key={post._id} className="border p-4 rounded-lg shadow-md bg-geda ">
                                    <Link to={`/forum/${post._id}`} className="text-xl font-semibold text-white hover:underline">
                                        {post.postTitle}
                                    </Link>
                                    <p className="mt-2 text-gray-300">{post.postDescription.substring(0, 150)}...</p>
                                    <div className="mt-2">
                                        {post.postTags && post.postTags.map((tag, index) => (
                                            <span key={index} className="inline-block bg-green-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchResults;