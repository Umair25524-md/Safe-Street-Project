import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Report = () => {
  const [image, setImage] = useState(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [roadType, setRoadType] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const notify = (message, type) => {
    toast(message, {
      type,
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      theme: 'dark',
    });
  };

  const report = async (e) => {
    e.preventDefault();

    if (!image || !lat || !lng) {
      notify("Image and coordinates are required.", "error");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    formData.append('address', address);
    formData.append('landmark', landmark);
    formData.append('roadType', roadType);
    formData.append('comments', comments);

    try {
      const res = await fetch('http://localhost:5000/report-damage', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      notify("Damage reported successfully!", "success");

      // Reset fields after successful report
      setImage(null);
      setLat('');
      setLng('');
      setAddress('');
      setLandmark('');
      setRoadType('');
      setComments('');
    } catch (err) {
      notify("Something went wrong. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white p-4">
      <ToastContainer />
      <form
        onSubmit={report}
        className="w-full max-w-lg bg-[#1F2937] p-6 rounded-xl shadow-xl mt-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">🚧 Report Road Damage</h2>

        {/* Image Upload */}
        <label className="block mb-2">Upload Image 📷 *</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white border-2 border-white"
        />

        {/* Coordinates */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label>Latitude *</label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border-2 border-white"
              required
            />
          </div>
          <div className="w-1/2">
            <label>Longitude *</label>
            <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border-2 border-white"
              required
            />
          </div>
        </div>

        {/* Address */}
        <label className="mt-4 block">Address (optional)</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-2 border-white"
        />

        {/* Landmark */}
        <label className="block">Landmark / Nearby Area 🗺️ (optional)</label>
        <input
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-2 border-white"
        />

        {/* Road Type Dropdown */}
        <label className="block">Road Type 🛣️ (optional)</label>
        <select
          value={roadType}
          onChange={(e) => setRoadType(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-2 border-white"
        >
          <option value="">--Select Road Type--</option>
          <option value="Highway">Highway</option>
          <option value="Main Road">Main Road</option>
          <option value="Street">Street</option>
          <option value="Internal Road">Internal Road</option>
          <option value="Service Lane">Service Lane</option>
        </select>

        {/* Comments */}
        <label className="block">Comments / Description 📝 (optional)</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows="3"
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white border-2 border-white"
        />

        <button
          type="submit"
          className={`w-full py-3 rounded text-white font-semibold transition duration-300 
            ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default Report;
