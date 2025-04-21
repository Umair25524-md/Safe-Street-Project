import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const UserProfile = ({ setIsAuthenticated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    const [userEmail, setUserEmail] = useState('');
    const[userName,setUserName] = useState('');

    useEffect(() => {
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('username');
        if (email) setUserEmail(email);
        if(name) setUserName(name);
    }, []);

    useGSAP(() => {
        gsap.from('.profile',{
            y:-10,
            ease:'power3.inOut',
            opacity:0,
        })
    },[isOpen]);


    return (
        <div className="relative font-semibold" ref={dropdownRef}>
            <img
                src="./profile.png"
                alt="Profile"
                className="rounded-full w-10 h-10 cursor-pointer"
                onClick={toggleDropdown}
            />
            {isOpen && (
                <ul className="profile absolute right-0 mt-2 w-90 bg-white border rounded-lg shadow-lg text-black p-3">
                    <div className='p-3 flex items-center space-x-2 '>
                    <img
                        src="./profile.png"
                        alt="Profile"
                        className="rounded-full w-12 h-12 cursor-pointer mr-2"
                        onClick={toggleDropdown}
                    />
                    <div className='mr-4 text-ellipsis'>
                    <h2 className='text-ellipsis'>{userName}</h2>
                        {/* <h1>Email:</h1> */}
                        <h2 className='text-ellipsis'>{userEmail}</h2>
                    </div>

                    </div>
                    <hr />
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer mt-2">
                        <Link to="/settings">
                        <i class="ri-settings-2-line mr-2"></i>Settings</Link>
                    </li>
                    <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <i className="ri-logout-box-line mr-2"></i>Logout
                    </li>
                </ul>
            )}
        </div>
    );
};

export default UserProfile;
