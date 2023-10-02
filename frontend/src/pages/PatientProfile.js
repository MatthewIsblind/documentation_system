import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS



function formatFieldName(field) {
    return field
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

function PatientProfile() {
  const location = useLocation();
  const { firstName, lastName } = location.state;
  const [patientData, setPatientData] = useState(null);

  const [isTableVisible, setTableVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getPatientProfile = () => {
    console.log(firstName);
    console.log(lastName);
    axios
      .get(`http://localhost:5000/api/get_patient_info?firstName=${firstName}&lastName=${lastName}`)
      .then((response) => {
        // Handle the response data here
        if ('error' in response.data) {
          console.log('Patient not found');
        } else {
          console.log('Data received:', response.data);
          setPatientData(response.data.patientProfile);
        }
      })
      .catch((error) => {
        console.error('Error getting data:', error);
        window.alert('An error occurred getting the data. Please try again later.');
      });
  };

  useEffect(() => {
    // Call the API function when the component is mounted
    getPatientProfile();
  }, []); // The empty dependency array means this will run once when the component is mounted

  return (
    <div className="p-4">
      {patientData ? (
        <div>
          <div className="mb-4">
            <span className="font-2xl text-gray-900">
              Patient Profile for{' '}
              {formatFieldName(patientData.patientFirstName) +
                ' ' +
                formatFieldName(patientData.patientLastName)}
            </span>


            

          </div>

        <div className="py-2">
            <button 
                onClick={() => setTableVisible(!isTableVisible)}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
            >
                {isTableVisible ? 'Hide Table' : 'Show Table'}
            </button>
        </div>
        
          <div className={`overflow-x-auto ${isTableVisible ? 'block' : 'hidden'}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Field
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(patientData)
                  .filter(([field, _]) => field !== 'patientFirstName' && field !== 'patientLastName')
                  .map(([field, value]) => (
                    <tr key={field}>
                      <td className="px-6 py-4 whitespace-no-wrap">
                        <div className="text-sm leading-5 font-medium text-gray-900">
                          {formatFieldName(field)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap">
                        <div className="text-sm leading-5 text-gray-500">{value}</div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-medium text-gray-900">Care Notes</h2>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      ) : (
        <div>Loading patient information...</div>
      )}
    </div>
  );
}

export default PatientProfile;
