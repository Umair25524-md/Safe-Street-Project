// import React, { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Report = () => {
//   const [image, setImage] = useState(null);
//   const [address, setAddress] = useState('');
//   const [landmark, setLandmark] = useState('');
//   const [roadType, setRoadType] = useState('');
//   const [comments, setComments] = useState('');
//   const [loading, setLoading] = useState(false);

//   const notify = (message, type) => {
//     toast(message, {
//       type,
//       position: "top-center",
//       autoClose: 2500,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       theme: 'dark',
//     });
//   };

//   const checkIfRoad = async () => {
//     const formData = new FormData();
//     formData.append('file', image);

//     try {
//       const res = await fetch('http://localhost:8000/check-road/', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       // For debugging you can log probabilities here
//       // console.log('Road Probability:', data.road_probability);
//       // console.log('Not Road Probability:', data.not_road_probability);

//       // Use higher threshold for stricter validation
//       console.log('Road Probability:', data.road_probability);
//       return data.road_probability >= 0.6;
//     } catch (err) {
//       notify("Error checking road. Try again later.", "error");
//       return false;
//     }
//   };

//   const report = async (e) => {
//     e.preventDefault();

//     if (!image) {
//       notify("Image required.", "error");
//       return;
//     }

//     setLoading(true);

//     const isRoad = await checkIfRoad();

//     if (!isRoad) {
//       notify("❌ This image doesn't seem to show a road!", "error");
//       setLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('image', image);
//     formData.append('address', address);
//     formData.append('landmark', landmark);
//     formData.append('roadType', roadType);
//     formData.append('comments', comments);

//     try {
//       const res = await fetch('http://localhost:8000/report-damage/', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error("Failed to submit report");
//       }

//       await res.json();
//       notify("✅ Damage reported successfully!", "success");

//       // Reset fields
//       setImage(null);
//       setAddress('');
//       setLandmark('');
//       setRoadType('');
//       setComments('');
//     } catch (err) {
//       notify("❌ Something went wrong. Try again later.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white p-4">
//       <ToastContainer />
//       <form
//         onSubmit={report}
//         className="w-full max-w-lg bg-[#1F2937] p-6 rounded-xl shadow-xl mt-12"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">🚧 Report Road Damage</h2>

//         <label className="block mb-2">Upload Image 📷 *</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImage(e.target.files[0])}
//           required
//           className="w-full p-2 mb-4 rounded bg-gray-800 text-white border-2 border-white"
//         />

//         <label className="mt-4 block">Address</label>
//         <input
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-2 border-white"
//         />

//         <label className="block">Landmark / Nearby Area 🗺️ (optional)</label>
//         <input
//           type="text"
//           value={landmark}
//           onChange={(e) => setLandmark(e.target.value)}
//           className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-2 border-white"
//         />

//         <label className="block">Road Type 🛣️ (optional)</label>
//         <select
//           value={roadType}
//           onChange={(e) => setRoadType(e.target.value)}
//           className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-2 border-white"
//         >
//           <option value="">--Select Road Type--</option>
//           <option value="Highway">Highway</option>
//           <option value="Main Road">Main Road</option>
//           <option value="Street">Street</option>
//           <option value="Internal Road">Internal Road</option>
//           <option value="Service Lane">Service Lane</option>
//         </select>

//         <label className="block">Comments / Description 📝 (optional)</label>
//         <textarea
//           value={comments}
//           onChange={(e) => setComments(e.target.value)}
//           rows="3"
//           className="w-full p-2 mb-4 rounded bg-gray-800 text-white border-2 border-white"
//         />

//         <button
//           type="submit"
//           className={`w-full py-3 rounded text-white font-semibold transition duration-300 
//             ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'}`}
//           disabled={loading}
//         >
//           {loading ? 'Submitting...' : 'Submit Report'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Report;

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Report = () => {
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [roadType, setRoadType] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  // Add a state to hold uncertain confirmation
  const [awaitUserConfirmation, setAwaitUserConfirmation] = useState(false);
  const [lastRoadProbability, setLastRoadProbability] = useState(null);

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

      // Define thresholds
      if (data.road_probability > 0.7) {
        return true;  // definitely road
      } else if (data.road_probability < 0.3) {
        return false; // definitely not road
      } else {
        // uncertain zone
        return null;  // ask user
      }
    } catch (err) {
      notify("Error checking road. Try again later.", "error");
      return false;
    }
  };

  const report = async (e) => {
    e.preventDefault();

    if (!image) {
      notify("Image required.", "error");
      return;
    }

    setLoading(true);

    const isRoad = await checkIfRoad();

    if (isRoad === false) {
      notify("❌ This image doesn't seem to show a road!", "error");
      setLoading(false);
      return;
    } else if (isRoad === null) {
      // uncertain, ask user for confirmation
      setLoading(false);
      setAwaitUserConfirmation(true);
      return;
    }

    // If confirmed or definitely road, submit
    await submitReport();
  };

  const submitReport = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('address', address);
    formData.append('landmark', landmark);
    formData.append('roadType', roadType);
    formData.append('comments', comments);

    try {
      const res = await fetch('http://localhost:8000/report-damage', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      notify("✅ Damage reported successfully!", "success");

      // Reset fields
      setImage(null);
      setAddress('');
      setLandmark('');
      setRoadType('');
      setComments('');
    } catch (err) {
      notify("❌ Something went wrong. Try again later.", "error");
    } finally {
      setLoading(false);
      setAwaitUserConfirmation(false);
      setLastRoadProbability(null);
    }
  };

  const handleUserConfirmation = (confirmed) => {
    setAwaitUserConfirmation(false);

    if (confirmed) {
      submitReport();
    } else {
      notify("Report cancelled due to user confirmation.", "info");
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

        <label className="block mb-2">Upload Image 📷 *</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white border-2 border-white"
        />

        <label className="mt-4 block">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-2 border-white"
        />

        <label className="block">Landmark / Nearby Area 🗺️ (optional)</label>
        <input
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-800 text-white border-2 border-white"
        />

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

      {/* Confirmation modal if uncertain */}
      {awaitUserConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 z-50">
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
