import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, parse } from 'date-fns'; // Import date-fns functions

// Define your navigation links
const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Info Table', to: '/infoTable' },
  { name: 'Hand Over', to: '/handOver' },
  { name: 'Create Patient', to: '/UpdatePatientInfo' },
  { name: 'Patient Dashboard', to: '/PatientDashboard' },
];

const Home: React.FC = () => {


  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-3xl font-semibold mb-6">Welcome to the Home Page</h1>
    <div className="flex flex-col gap-4">
      {navigation.map((navItem, index) => (
        <Link
          key={index}
          to={navItem.to}
          className="p-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-center font-semibold text-lg"
        >
          {navItem.name}
        </Link>
      ))}
    </div>
  </div>
  );


  
};

export default Home;

