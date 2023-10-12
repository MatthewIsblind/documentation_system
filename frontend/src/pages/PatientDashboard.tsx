import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, parse } from 'date-fns'; // Import date-fns functions

interface Patient {
  patientFirstName: string;
  patientLastName: string;
  gender: string;
  roomNumber : string;
  bedNumber : string;
  dateOfBirth :string ;
  dateOfAdmission :string;
  
  
  kinName: string;
  EmergencyContactNumber: string;
  
}

//api 6zf5lGVdZRRHKQKbGK0DYDpqTrh0yXQhOcHFsMLDTWagLPoRlH25gJ7AnydDHcQu
const PatientDashboard: React.FC = () => {

  const [patient, setPatient] = React.useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>(''); // State for the search term

  useEffect(() => {
    console.log("trying to acess mongo online ")
    // Fetch data from the backend endpoint using axios
    // axios.get('mongodb+srv://matet2501:heihei2501@cluster0.mfdvoch.mongodb.net/test')
    axios.get('http://localhost:5000/api/get_patients')
      .then((response) => {
        const data = response.data;
        if (data && data.data) {
          setPatient(data.data);
        }
        console.log(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  // Function to filter patients based on search term
  const filteredPatients = patient.filter((patient) =>
    patient.patientFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientLastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  return (
    <div className="flex-grow py-4  px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Patients</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the patients in your facility, including their details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/updatePatientInfo"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Patient Info
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Search patients..."
          className="border border-gray-300 p-2 rounded-md w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-xl font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xl font-semibold text-gray-900"
                  >
                    Gender
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xl font-semibold text-gray-900"
                  >
                    Room Number
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xl font-semibold text-gray-900"
                  >
                    Emergency Contact
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xl font-semibold text-gray-900"
                  >
                    Bed Number
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-0 px-4"
                  >
                    <span className="sr-only">Actions</span>
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPatients.map((patient) => (
                  <tr key={patient.patientFirstName}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-xl sm:pl-0">
                      <div className="font-medium text-gray-900">
                        {patient.patientFirstName} {patient.patientLastName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-xl text-gray-500">
                      {patient.gender}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-xl text-gray-500">
                      {patient.roomNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-xl text-gray-500">
                      {patient.EmergencyContactNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-xl text-gray-500">
                      {patient.bedNumber}
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-xl font-medium sm:pr-0">
                      
                      <Link
                        to={`/PatientProfile`}
                        state={{
                          firstName: patient.patientFirstName,
                          lastName: patient.patientLastName,
                        }}
                        className="text-green-600 hover:text-red-500 px-3 border border-green-600 hover:border-red-500 py-1 rounded mr-2"
                      >
                        Open Profile
                      </Link>
                      
                      <Link
                        to={`/checklist`}
                        state={{
                          firstName: patient.patientFirstName,
                          lastName: patient.patientLastName,
                        }}
                        className="text-green-600 hover:text-red-500 px-3 border border-green-600 hover:border-red-500 py-1 rounded ml-1"
                      >
                        Check Task List
                      </Link>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );


  
};

export default PatientDashboard;

