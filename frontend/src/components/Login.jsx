import React, { useState,useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ClipLoader } from 'react-spinners';
import { useGoogleLogin } from '@react-oauth/google';


const Login = ({setIsAuthenticated}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    // Notify Function for Success and Error Toasts
    const notify = (message, type) => {
        toast(message, {
            type: type,
            position: "top-right",
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
            const response = await axios.post('http://localhost:5000/login', { email, password },{
              withCredentials:true  
            });
            if (response.status === 200) {
                notify("Login Successful!", "success");
                setIsAuthenticated(true);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('username', response.data.name);
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else if (response.status === 400) {
                notify("Invalid Credentials", "error");
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
        gsap.from('.login-box',{
            opacity:0,
            y:100,
            duration:1,
            ease:'power3.out'
        })
    },[])

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/auth/google";
    };
    


    return (
        <div className='flex justify-center items-center w-full h-[100vh] font-semibold relative'>
            <img src="./login-bg.jpg" alt="" className='absolute inset-0 object-cover w-full h-full' />
            <ToastContainer />
            <div className='flex flex-col justify-center items-center w-full max-w-md h-[500px] rounded-lg shadow-lg p-8 z-10 backdrop-blur-lg border-0.5 border-gray-400 login-box'>
                <img src="./logo1.png" alt="" className='' />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='Email or Username'
                        value={email}
                        name='email'
                        onChange={handleChange}
                        className='relative px-5 py-3 text-left w-full border-2 border-black rounded-full focus:outline-none focus:border-[#495F6A]' />
                       {/* <i class="ri-user-fill"></i> */}
                    <input
                        type="password"
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={handleChange}
                        className='px-5 py-3 text-left w-full border-2 border-black mt-4 rounded-full focus:outline-none focus:border-[#495F6A]' />
                        <button
                            type="submit"
                            className={`w-full py-3 mt-4 text-lg rounded-full text-white flex justify-center items-center cursor-pointer
                                        ${loading ? 'bg-black cursor-not-allowed' : 'bg-black'}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <ClipLoader color="#ffffff" size={24} />
                            ) : (
                                'Login'
                            )}
                        </button>
                </form>
                <button className='w-full py-3 mt-4 text-lg rounded-full text-white flex justify-center items-center bg-black gap-3 cursor-pointer'
                onClick={handleGoogleLogin}>
                            <img src="./googlelogo.svg" alt="" className='w-6 h-6' /> Continue with Google
                </button>
                <Link to="/signup" className='mt-4 mb-12'>Don't have an account? <span className='underline'>Sign Up</span></Link>
            </div>
        </div>
    )
}

export default Login;

