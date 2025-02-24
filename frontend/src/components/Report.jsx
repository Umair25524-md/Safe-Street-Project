import React, { useState } from 'react';
import axios from 'axios';


const Report = () => {
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        image: null,
        reporter_id: '',
        location: '',
        date: today,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here

        const formDataToSend = new FormData();
        formDataToSend.append('image', formData.image);
        formDataToSend.append('reporter_id', formData.reporter_id);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('date', formData.date);

        try {
            const response = await axios.post('http://127.0.0.1:5000/analyze', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Success');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className='min-h-screen w-full flex justify-center items-center'>
            <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
                <input
                    type="file"
                    className='border-2 border-amber-200'
                    id='image'
                    name='image'
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder='Enter your id'
                    id='reporter_id'
                    name='reporter_id'
                    value={formData.reporter_id}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder='Enter location'
                    id='location'
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    id='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                />
                <button type='submit'>submit</button>
            </form>
        </div>
    );
};

export default Report;