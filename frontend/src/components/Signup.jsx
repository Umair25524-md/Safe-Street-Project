import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ClipLoader } from 'react-spinners';


const Signup = () => {

    const[name,setName] = useState('');
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
        if(name==='name'){
            setName(value);
        }
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

        if(email === '' || password === ''||name===''){
            notify("All fields are required","error");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/signup', { name,email, password });
            if (response.status === 200) {
                notify("Successfully registered! A verification email has been sent.", "success");
                setEmail('');
                setPassword('');
                setName('');
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

    useGSAP(() => {
        gsap.from('.sign-box',{
            opacity:0,
            y:100,
            duration:1,
            ease:'power3.out'
        })
    },[])


    return (
        <div className='flex justify-center items-center w-full h-[100vh] font-semibold relative'>
            <img src="./login-bg.jpg" alt="" className='absolute inset-0 object-cover w-full h-full'/>
            <div className='flex flex-col justify-center items-center w-full max-w-md h-[550px] rounded-lg shadow-lg p-8 z-10 backdrop-blur-lg border-0.5 border-gray-400 sign-box'>
                <img src="./logo1.png" alt="" className=''/>
                <form onSubmit={handleSubmit}>
                <input 
                        type="text" 
                        placeholder='Username' 
                        name='name'
                        value={name}
                        onChange={handleChange}
                        className='px-5 py-3 text-left w-full border-2 border-black rounded-full focus:outline-none focus:border-[#495F6A] mb-4'/>
                    <input 
                        type="email" 
                        placeholder='Email' 
                        name='email'
                        value={email}
                        onChange={handleChange}
                        className='px-5 py-3 text-left w-full border-2 border-black rounded-full focus:outline-none focus:border-[#495F6A]'/>
                    <input 
                        type="password" 
                        placeholder='Password' 
                        name='password'
                        value={password}
                        onChange={handleChange}
                        className='px-5 py-3 text-left w-full border-2 border-black mt-4 rounded-full focus:outline-none focus:border-[#495F6A]'/>
                        <button 
                            type="submit"
                            className={`w-full py-3 mt-4 text-lg rounded-full text-white flex justify-center items-center cursor-pointer
                                        ${loading ? 'bg-black cursor-not-allowed' : 'bg-black'}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <ClipLoader color="#ffffff" size={24} />
                            ) : (
                                'Sign Up'
                            )}
                        </button>

                </form>
                 <Link to="/login" className='mt-4 mb-12'>Already have an account? <span className='underline'>Login</span></Link>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
