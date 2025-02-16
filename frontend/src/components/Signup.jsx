import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Notify Function for Success and Error Toasts
    const notify = (message, type) => {
        toast(message, {
            type: type,
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    // Handle Input Changes
    function handleChange(event) {
        const { name, value } = event.target;
        if (name === 'email') {
            setEmail(value);
        }
        if (name === 'password') {
            setPassword(value);
        }
    }

    // Handle Form Submission
    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true); // Start Loading

        if(email === '' || password === ''){
            notify("All fields are required","error");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/signup', { email, password });
            if (response.status === 201) {
                notify("Successfully registered!", "success");
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            if (error.response) {
                notify(error.response.data.message, "error");
            } else {
                notify("Something went wrong. Please try again later.", "error");
            }
        } finally {
            setLoading(false); // Stop Loading
        }
    }

    return (
        <div className='flex justify-center items-center w-full h-[100vh] font-semibold relative'>
            <img src="./login-bg.jpg" alt="" className='absolute inset-0 object-cover w-full h-full'/>
            <div className='flex flex-col justify-center items-center w-full max-w-md h-[500px] rounded-lg shadow-lg p-8 z-10 backdrop-blur-lg border-0.5 border-gray-400'>
                <img src="./logo1.png" alt="" className=''/>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder='Email or Username' 
                        name='email'
                        value={email}
                        onChange={handleChange}
                        className='px-5 py-3 text-left w-full border-2 border-black rounded-lg focus:outline-none focus:border-[#495F6A]'/>
                    <input 
                        type="password" 
                        placeholder='Password' 
                        name='password'
                        value={password}
                        onChange={handleChange}
                        className='px-5 py-3 text-left w-full border-2 border-black mt-4 rounded-lg focus:outline-none focus:border-[#495F6A]'/>
                    <button 
                        type="submit"
                        className={`w-full py-3 mt-4 text-lg rounded-lg text-white cursor-pointer 
                                    ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#495F6A]'}`}
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                 <Link to="/login" className='mt-4 mb-12'>Already have an account? <span className='underline'>Login</span></Link>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
