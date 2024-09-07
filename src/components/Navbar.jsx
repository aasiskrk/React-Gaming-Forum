import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/Playforgelogo.svg';
import home from '../assets/icons/homeicon.svg';
import game from '../assets/icons/gameicon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../index.css';
import { faSearch, faUser, faGear, faArrowRightFromBracket, faBell, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Profilepage from '../pages/profilepage/Profilepage';
import { searchProductsApi } from '../apis/Api';


const Navbar = () => {
    const userdetails = JSON.parse(localStorage.getItem('user'));

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Get user from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    //Search function
    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchError(null);
        try {
            const response = await searchProductsApi(searchQuery, ''); // Leave tags empty for now
            if (response.data && response.data.success) {
                setSearchResults(response.data.posts);
                navigate('/search-results', { state: { query: searchQuery, results: response.data.posts } });
            } else {
                setSearchError('Search failed. Please try again.');
                console.error('Search failed:', response.data ? response.data.message : 'Unknown error');
            }
        } catch (error) {
            setSearchError('An error occurred. Please try again later.');
            console.error('Error during search:', error);
        }
    };

    //logout function
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    }

    // State to handle dropdown visibility
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Function to toggle dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Function to toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Redirect to home if user is logged in
    // useEffect(() => {
    //     if (user) {
    //         navigate('/');
    //     }
    // }, [user, navigate]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <nav className="p-4 bg-geda">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className=''>
                        <img src={logo} alt="Forge Play" className="h-10 w-auto" />
                    </Link>
                    <div className="md:flex mx-5 mt-2 items-center justify-between">
                        <ul className="flex space-x-10">
                            <li>
                                <div className="flex items-center justify-center hover:filter hover:brightness-75">
                                    <Link to="/" className="text-black">
                                        <img src={home} alt="Home" className="h-6 w-auto" />
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center justify-center hover:filter hover:brightness-75">
                                    <Link to="/user/games" className="text-black">
                                        <img src={game} alt="Game" className="h-7 w-auto" />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {location.pathname === '/' && (
                        <div className="flex-auto mx-3 relative hidden md:block">
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder="   Type here to search..."
                                    className="w-full p-2 pl-6 rounded-lg focus:outline-green-500 bg-secondary2 text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 mr-1 text-white h-6 w-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                                </button>
                            </form>
                            {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
                        </div>
                    )}

                    <div className="flex items-center">


                        <button className="text-white block md:hidden ml-5" onClick={toggleMobileMenu}>
                            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex md:items-center ml-4">
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        className="text-white px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 focus:outline-none"
                                        onClick={toggleDropdown}
                                    >
                                        Welcome, {user.fullName}
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-40 bg-geda2 rounded-md shadow-lg z-10">
                                            <ul>
                                                <li>
                                                    <a className="block px-4 py-2 text-white hover:bg-gray-700" >
                                                        <FontAwesomeIcon icon={faUser} className="mr-6" /><Link to={`/profile/profile_page`}>Profile</Link>
                                                    </a>
                                                </li>

                                                <li>
                                                    <a className="block px-4 py-2 text-white hover:bg-gray-700">
                                                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-6" /> <button onClick={handleLogout}>Logout </button>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <a
                                        className="bg-geda2 group relative border-none inline-block rounded-lg text-sm font-medium focus:outline-none"
                                        href="/register"
                                    >
                                        <span className="focus:outline-none rounded-md absolute inset-0 border-none translate-x-0.5 translate-y-0.5 bg-white transition-transform group-hover:translate-x-0 group-hover:translate-y-0">
                                            <Link to="/register" className="text-black focus:outline-none"></Link>
                                        </span>
                                        <span className="focus:outline-none rounded-md relative block bg-blue-500 px-8 py-2">
                                            <Link to="/register" className="text-black">Register</Link>
                                        </span>
                                    </a>
                                    <a
                                        className="ml-3 bg-geda2 group relative border-none inline-block rounded-lg text-sm font-medium focus:outline-none"
                                        href="/login"
                                    >
                                        <span className="focus:outline-none rounded-md absolute inset-0 border-none translate-x-0.5 translate-y-0.5 bg-white transition-transform group-hover:translate-x-0 group-hover:translate-y-0">
                                            <Link to="/login" className="text-black focus:outline-none"></Link>
                                        </span>
                                        <span className="focus:outline-none rounded-md relative block bg-merogreen px-8 py-2">
                                            <Link to="/login" className="text-black">Login</Link>
                                        </span>
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Home</Link>
                            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Games</Link>
                            {user && (
                                <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Notifications</a>
                            )}
                            {user ? (
                                <>
                                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Profile</a>
                                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Settings</a>
                                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Logout</a>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Register</Link>
                                    <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Login</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav >
        </>
    );
};

export default Navbar;
