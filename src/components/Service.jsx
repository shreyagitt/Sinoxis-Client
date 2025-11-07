import React from "react";
import { Users, Music, BarChart2, ShoppingBag, FileText } from "react-feather";

const Services = () => {
  return (
    <div className="main-container w-full px-4 lg:px-8 font-[Montserrat] text-[#051a1a] min-h-screen bg-gray-50">
      {/* PAGE HEADER */}
      <div className="py-3 px-10 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Services</h2>
        <div className="text-base ">
          Home <span className="text-red-600"> / Services</span>
        </div>
      </div>

      {/* SUB HEADER */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <h3 className="text-2xl font-semibold mb-1 sm:mb-0">Our Services</h3>
        <p className="text-gray-500">
          Explore what we offer to help artists grow and monetize their music
        </p>
      </div>

      {/* SERVICE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {/* Artist Management */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl h-full transition hover:shadow-md">
          <div className="p-6 text-center">
            <Users size={50} color="#0d6efd" className="mx-auto mb-4" />
            <h5 className="text-xl font-semibold mt-5 mb-2">Artist Management</h5>
            <p className="text-gray-600 mb-4">
              We help artists manage their careers, bookings, and collaborations efficiently.
            </p>
            <button className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-md text-sm transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Music Distribution */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl h-full transition hover:shadow-md">
          <div className="p-6 text-center">
            <Music size={50} color="#198754" className="mx-auto mb-4" />
            <h5 className="text-xl font-semibold mt-5 mb-2">Music Distribution</h5>
            <p className="text-gray-600 mb-4">
              Distribute your music across all major streaming platforms worldwide.
            </p>
            <button className="text-green-600 border border-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md text-sm transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl h-full transition hover:shadow-md">
          <div className="p-6 text-center">
            <BarChart2 size={50} color="#ffc107" className="mx-auto mb-4" />
            <h5 className="text-xl font-semibold mt-5 mb-2">Revenue Analytics</h5>
            <p className="text-gray-600 mb-4">
              Track revenue, monitor streams, and optimize earnings with our analytics tools.
            </p>
            <button className="text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-white px-4 py-2 rounded-md text-sm transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Marketing & Promotions */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl h-full transition hover:shadow-md">
          <div className="p-6 text-center">
            <ShoppingBag size={50} color="#dc3545" className="mx-auto mb-4" />
            <h5 className="text-xl font-semibold mt-5 mb-2">Marketing & Promotions</h5>
            <p className="text-gray-600 mb-4">
              Promote your music with social media campaigns, PR, and influencer marketing.
            </p>
            <button className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-md text-sm transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Licensing & Copyright */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl h-full transition hover:shadow-md">
          <div className="p-6 text-center">
            <FileText size={50} color="#0dcaf0" className="mx-auto mb-4" />
            <h5 className="text-xl font-semibold mt-5 mb-2">Licensing & Copyright</h5>
            <p className="text-gray-600 mb-4">
              Protect your music and manage licensing deals with our legal support.
            </p>
            <button className="text-sky-500 border border-sky-500 hover:bg-sky-500 hover:text-white px-4 py-2 rounded-md text-sm transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

