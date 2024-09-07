import React from 'react';

const HelpPage = () => {
    return (
        <div className="w-full mx-auto px-4 py-8 bg-gray-700">
            <h1 className="text-3xl font-bold mb-6 text-white">Help & Support</h1>

            <section className="mb-8">
                <h2 className="text-xl text-white font-semibold mb-4">Getting Started</h2>
                <p className="text-white leading-relaxed">
                    Welcome to Play Forge! Here’s a quick guide to help you get started...
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl  text-white font-semibold mb-4">Account Management</h2>
                <p className="text-white leading-relaxed">
                    Learn how to manage your account, including setting up your profile, updating your password, and more.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl text-white font-semibold mb-4">Forum Rules</h2>
                <p className="text-white leading-relaxed">
                    Please adhere to our community guidelines to keep the forum a friendly and safe place.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl text-white font-semibold mb-4">Contact Support</h2>
                <form className="bg-gray-600 p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-100 mb-2">Your Email</label>
                        <input type="email" className="w-full p-2 border text-white bg-gray-700 border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-100 mb-2">Your Message</label>
                        <textarea className="w-full p-2 border text-white bg-gray-700 border-gray-300 rounded-md"></textarea>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </form>
            </section>
        </div>
    );
};

export default HelpPage;
