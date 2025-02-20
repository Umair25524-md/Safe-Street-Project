import React, { useRef, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "./Footer";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const ContactPage = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    gsap.from(".contact-container", {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: "power3.out",
    });
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isFormValid = () => {
    return (
      formData.from_name.trim() !== "" &&
      isValidEmail(formData.from_email) &&
      formData.message.trim() !== ""
    );
  };

  // Handle form submission
  const sendEmail = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill out all fields correctly.");
      return;
    }

    emailjs
      .sendForm(
        "service_sseyq6r",
        "template_oyaflbl",
        form.current,
        { publicKey: "BsS8XVUmjSUMcr4X2" }
      )
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({ from_name: "", from_email: "", message: "" }); // Reset form
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
        toast.error("Failed to send message. Try again later.");
      });
  };

  return (
    <>

      <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6 font-[Montserrat]">
        <div className="max-w-6xl mx-auto text-center mt-8">
          <h2 className="text-5xl font-bold text-blue-400 mb-8 animate-pulse underline">
            Contact Us
          </h2>
          <p className="text-lg text-gray-300 mb-12 font-bold">
            Have any questions or suggestions? We’d love to hear from you.
          </p>
        </div>

        {/* Contact Section */}
        <div className="contact-container grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="contact-b1 bg-black/40 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700 hover:border-blue-400 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-300 mb-6 font-bold">
              Reach out to us via the following methods.
            </p>
            <div className="space-y-4">
              <p className="flex items-center text-lg text-gray-200 hover:text-blue-400 transition-all">
                <FaEnvelope className="text-blue-400 mr-3" /> Contact us : safestreet456@gmail.com
              </p>
              <p className="flex items-center text-lg text-gray-200 hover:text-blue-400 transition-all">
                <FaMapMarkerAlt className="text-blue-400 mr-3" /> Hyderabad, India
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-b2 bg-black/40 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700 hover:border-blue-400 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">
              Send a Message
            </h3>
            <form className="space-y-6" ref={form} onSubmit={sendEmail}>
              <input
                type="text"
                placeholder="Your Name"
                name="from_name"
                value={formData.from_name}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                name="from_email"
                value={formData.from_email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all"
                required
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white py-3 rounded-md font-semibold text-lg shadow-md hover:scale-105 transform cursor-pointer duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Floating Effect */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-teal-400 blur-3xl opacity-30 animate-pulse"></div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ContactPage;
