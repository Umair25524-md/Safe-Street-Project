import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FiUploadCloud } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';

const Report = () => {
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [awaitUserConfirmation, setAwaitUserConfirmation] = useState(false);
  const [lastRoadProbability, setLastRoadProbability] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const fileInputRef = useRef(null);

  const LOCATION_IQ_API_KEY = "pk.cd966f62e847e0572bb86b986148b7be";

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

  useEffect(() => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        try {
          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${LOCATION_IQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          let displayName = data.display_name || "";

          const excludedKeywords = [
            "mandal", "zone", "district", "state", "india", "municipal",
            "corporation", "country", "telangana"
          ];

          let parts = displayName
            .split(',')
            .map(part => part.trim())
            .filter(part => {
              const lower = part.toLowerCase();
              return !excludedKeywords.some(keyword => lower.includes(keyword));
            });

          parts = parts.filter((item, index) =>
            parts.findIndex(p => p.toLowerCase() === item.toLowerCase()) === index
          );

          parts = parts.filter(part => !/^\d{5,6}$/.test(part));

          const cleanAddress = parts.join(', ');
          setAddress(cleanAddress || "Unknown location");

        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          notify("⚠️ Could not fetch address from location", "warning");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        notify("⚠️ Location permission denied. Coordinates will default to 0.", "warning");
        setLatitude(0);
        setLongitude(0);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  const checkIfRoad = async () => {
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await fetch('http://localhost:8000/check-road/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setLastRoadProbability(data.road_probability);

      if (data.road_probability > 0.7) return true;
      if (data.road_probability < 0.3) return false;
      return null;
    } catch {
      notify("Error checking road. Try again later.", "error");
      return false;
    }
  };

  const report = async (e) => {
    e.preventDefault();

    if (!image || !address.trim()) {
      notify("All fields are required", "error");
      return;
    }

    setLoading(true);
    const isRoad = await checkIfRoad();

    if (isRoad === false) {
      notify("❌ This image doesn't seem to show a road!", "error");
      setLoading(false);
      return;
    } else if (isRoad === null) {
      setLoading(false);
      setAwaitUserConfirmation(true);
      return;
    }

    await submitReport();
  };

  const submitReport = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('address', address);
    formData.append('comments', comments);

    const email = localStorage.getItem('email');
    if (email) formData.append('email', email);

    const submissionDate = new Date().toISOString();
    formData.append('submission_date', submissionDate);

    if (latitude !== null && longitude !== null) {
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
    }

    try {
      const res = await fetch('http://localhost:8000/report-damage/', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      notify("✅ Damage reported successfully!", "success");

      setImage(null);
      setAddress('');
      setComments('');
    } catch {
      notify("❌ Something went wrong. Try again later.", "error");
    } finally {
      setLoading(false);
      setAwaitUserConfirmation(false);
      setLastRoadProbability(null);
    }
  };

  const handleUserConfirmation = (confirmed) => {
    setAwaitUserConfirmation(false);
    if (confirmed) submitReport();
    else notify("Report cancelled due to user confirmation.", "info");
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      notify("Only image files are allowed.", "error");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      notify("Only image files are allowed.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white p-4">
      <ToastContainer />

      <form
        onSubmit={report}
        className="w-full max-w-lg bg-[#1F2937] p-6 rounded-xl shadow-xl mt-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">🚧 Report Road Damage</h2>

        <div
          className={`w-full border-2 border-dashed rounded-xl p-6 mb-4 flex flex-col items-center justify-center cursor-pointer transition 
            ${isDragOver ? 'border-blue-400 bg-blue-900/30' : 'border-white/40 bg-gray-800'}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
        >
          <FiUploadCloud className="text-5xl mb-2 text-blue-400" />
          <p className="text-sm text-center">Click or drag & drop an image to upload</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            hidden
          />
        </div>

        {image && (
          <div className="mb-4">
            <p className="text-sm mb-2 text-center">📷 Preview:</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border border-white/30"
            />
          </div>
        )}

<label className="block mb-1 mt-2">Address</label>

    {loadingLocation && (
      <div className="flex items-center mb-1 text-blue-400 text-sm select-none">
        <span>Fetching location</span>
        <ClipLoader color="#2563EB" loading={loadingLocation} size={16} className="ml-2" />
      </div>
    )}

    <input
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className="w-full p-2 rounded bg-gray-800 text-white border-2 border-white"
      disabled={loadingLocation}
    />


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

      {awaitUserConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2937] p-6 rounded-xl shadow-lg max-w-md text-center">
            <h3 className="text-xl font-semibold mb-4">
              The image confidence for being a road is uncertain ({(lastRoadProbability * 100).toFixed(1)}%).
            </h3>
            <p className="mb-6">Are you sure this image is a road?</p>
            <div className="flex justify-around">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleUserConfirmation(true)}
              >
                Yes, proceed
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-2"
                onClick={() => handleUserConfirmation(false)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
