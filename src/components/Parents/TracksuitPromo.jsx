import React, { use } from "react";
import { useState, useEffect } from "react";
import AOS from "aos";

import winterTracksuit1 from "../../assets/track_suit1.png";
import winterTracksuit2 from "../../assets/track_suit2.png";


const TracksuitPromo = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
        });
    }, []);

    const [modalImage, setModalImage] = useState(null);
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Images */}
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                {[winterTracksuit1, winterTracksuit2].map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt={`Tracksuit ${i + 1}`}
                        className="w-64 h-80 object-cover rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:brightness-110"
                        onClick={() => setModalImage(img)}
                    />
                ))}
            </div>

            {/* Modal */}
            {modalImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative">
                        <button
                            onClick={() => setModalImage(null)}
                            className="absolute top-0 right-0 bg-white p-2 rounded-full shadow"
                        >
                            ✕
                        </button>
                        <img src={modalImage} alt="Zoomed In" className="max-h-[90vh] rounded-lg" />
                    </div>
                </div>
            )}

            {/* Text + Button */}
            <div className="bg-slate-200 p-5 rounded-lg flex-1 flex flex-col items-center md:items-start md:ml-10">
  <div className="text-center md:text-left w-full max-w-md space-y-4 mt-6 md:mt-0">
    <p className="mb-6 text-gray-700 text-base md:text-lg">
      Stylish, warm, and school-branded — our new winter tracksuits are perfect for the season!
    </p>
    <div className="flex justify-center md:justify-start">
      <a
        href="https://forms.gle/q6FAbaE4bBkST14o8"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transform hover:scale-105 transition duration-300 ease-in-out"
      >
        Order Now
      </a>
    </div>
  </div>
</div>
        </div>

    );
};

export default TracksuitPromo;
