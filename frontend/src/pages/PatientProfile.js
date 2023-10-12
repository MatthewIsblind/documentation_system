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

function PatientProfile(userName) {
  const location = useLocation();
  const { firstName, lastName } = location.state;
  const [patientData, setPatientData] = useState(null);

  const [isTableVisible, setTableVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [careNote, setCareNote] = useState(''); // New state for the care note input
  const [emptyMessageBoolean,setemptyMessageBoolean] = useState(false)
  const [showAddNotes, setShowAddNotes] = useState(true);
  const [pastCareNotes , setpastCareNotes] = useState("");
  const [pastCareNotesDate, setPastCareNotesDate] = useState(new Date());


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
          // console.log('Data received:', response.data);
          setPatientData(response.data.patientProfile);
        }
      })
      .catch((error) => {
        console.error('Error getting data:', error);
        window.alert('An error occurred getting the data. Please try again later.');
      });
  };

  const handleSaveNote = () => {
    // Handle saving the care note to your API
    console.log('Saving care note:', careNote);
    if (careNote === '') {
      setemptyMessageBoolean(true);
    } else {
      setemptyMessageBoolean(false);
      console.log(userName)
      // You can add an axios request here to send the care note to your backend
      // Prepare the data for the POST request
      const requestData = {
        patientName: formatFieldName(patientData.patientFirstName) + ' ' + formatFieldName(patientData.patientLastName),
        date: selectedDate.toLocaleDateString(), // Get the date part
        time: selectedDate.toLocaleTimeString(), // Get the time part
        careNote: careNote,
        username: userName.userName, // Assuming userName is available here
      };
      console.log(requestData)
      // Send a POST request to your API
      axios
        .post('http://localhost:5000/api/add_care_note', requestData)
        .then((response) => {
          // Handle the response from the server, e.g., show a success message
          console.log('Care note saved successfully');
          window.alert("Care note has been saved.")
        })
        .catch((error) => {
          // Handle any errors that occur during the POST request
          console.error('Error saving care note:', error);
          // You can display an error message to the user or take appropriate actions.
        });
    }
    
  };

  const handleDisplayPastCareNotes = () => {
    setShowAddNotes(false)
    handlePastCareNoteDate(pastCareNotesDate || new Date()); // Use pastCareNotesDate if available, otherwise use the current date
  };

  const handlePastCareNoteDate = (date) => {
    setSelectedDate(date); // Update the selectedDate when a date is picked
     // Make an API request to retrieve past care notes


     
    const formattedDate = date.toLocaleDateString() // Format the date as needed
    const patientName = formatFieldName(patientData.patientFirstName) + ' ' + formatFieldName(patientData.patientLastName);
    console.log(formattedDate + " sending the the request and reciving the notes")
    axios
      .get(`http://localhost:5000/api/get_past_care_notes?patientName=${patientName}&date=${formattedDate}`)
      .then((response) => {
        // Handle the response data here
        console.log(response)
        if ('error' in response.data) {
          
          console.log('Error retrieving past care notes:', response.data.error);
          setpastCareNotes("") 
        } else {
          console.log('Past care notes received:', response.data);
          setpastCareNotes(response.data); // Update state with past care notes
        }
      })
      .catch((error) => {
        console.error('Error getting past care notes:', error);
        // Handle errors as needed
      });
  }

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
            <button
              onClick={() => setShowAddNotes(true)}
              className={`px-4 py-2 mr-2 ${
                showAddNotes ? 'bg-blue-700' : 'bg-blue-500'
              } text-white font-semibold rounded-md`}
            >
              Add Care Notes
            </button>
            <button
              onClick={handleDisplayPastCareNotes}
              className={`px-4 py-2 ${
                !showAddNotes ? 'bg-blue-700' : 'bg-blue-500'
              } text-white font-semibold rounded-md`}
            >
              Access Past Care Notes
            </button>
          </div>
   
          <div className="mt-4">
            {showAddNotes ? ( // Display the selected section based on showAddNotes state
              <div>
                <h2 className="text-xl font-medium text-gray-900">Add Care Notes</h2>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                />
                <div className="flex flex-col w-5/6">
                  <textarea
                    className="mt-2 border rounded-md p-3 flex-grow"
                    placeholder="Add a care note..."
                    value={careNote}
                    onChange={(e) => setCareNote(e.target.value)}
                    rows="5"
                  />
                  {emptyMessageBoolean ? (
                    <span className="text-red-500">Please fill in the care plan</span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                  <button
                    onClick={(event) => handleSaveNote()}
                    className="self-end px-4 py-2 bg-blue-500 hover-bg-blue-700 text-white font-semibold rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-5/6">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Access Past Care Notes</h2>
                  <div className="flex items-center mb-4">
                    <DatePicker
                      selected={pastCareNotesDate}
                      onChange={(date) => {
                        setPastCareNotesDate(date);
                        handlePastCareNoteDate(date); // Call handlePastCareNoteDate when the date changes
                      }}
                      dateFormat="dd/MM/yyyy"
                      onClick={() => {
                        setPastCareNotesDate(null); // Reset the date when clicking on the date picker
                      }}
                    />
                  </div>
                  {selectedDate && pastCareNotes.length > 0 ? (
                    <div>
                    {pastCareNotes.map((note, index) => (
                      <div key={index}>
                        <p>
                          <strong>Time:</strong> {note.time}
                        </p>
                        <p>
                          <strong>Username:</strong> {note.username}
                        </p>
                        <div>
                          <textarea className="border border-gray-300 rounded-md p-2 w-full h-40" readOnly value={note.note} />
                        </div>
                      </div>
                    ))}
                  </div>                  
                  
                  ) : (
                    <p>Select a date to view past care notes.</p>
                  )}
                </div>
              </div>

            )}
          </div>          

        </div>
      ) : (
        <div>Loading patient information...</div>
      )}
    </div>
  );
}

export default PatientProfile;
