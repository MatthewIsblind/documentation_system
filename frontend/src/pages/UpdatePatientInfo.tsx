import React, { useState ,useEffect} from 'react';
import { useForm, Controller , SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DevTool } from "@hookform/devtools";
import CustomDatePicker from './CustomDatePicker';
import axios from 'axios';

interface FormData {
    patientFirstName: string;
    patientLastName: string;
    gender: string;
    roomNumber : string;
    bedNumber : string;
    dateOfBirth :Date |null ;
    dateOfAdmission : Date | null;
    
    
    kinName: string;
    EmergencyContactNumber: string;
    
}


const defaultFormData: FormData = {
    patientFirstName: '',
    patientLastName: '',
    gender: '',
    roomNumber: '',
    bedNumber: '', // Default value is -1
    dateOfBirth: null,
    dateOfAdmission: null,
    kinName: '',
    EmergencyContactNumber: '',
  };

const UpdatePatientInfo: React.FC = () => {


  const [dateOfAdmission, setDateOfAdmission] = useState<Date | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);


  useEffect(() => {
    setDateOfAdmission(null);
    setDateOfBirth(null);
  }, []);


  const form = useForm<FormData>({defaultValues: defaultFormData, });
  const { register, handleSubmit,control ,  formState: { errors } } = form;

  const onSubmit = async (data: FormData) => {
    if (Object.keys(errors).length === 0) {
        if (data.bedNumber === "") {
            data.bedNumber = 'n/a';
          }
        console.log('Form submitted:', data);


        try {
            // Make a POST request to your Flask backend API
            const response = await axios.post('http://localhost:5000/api/generate_patients', data);

        
            console.log('Form submitted:', data);
            console.log('Response from server:', response.data);
             // Show the response in a pop-up message
            window.alert('Patient created successfully!'); // You can customize the message as needed
        // If you want to redirect or show a success message to the user, you can do it here
        } catch (error) {
            console.error('Error submitting form:', error);
            window.alert('An error occurred while submitting the form. Please try again later.');
        // Handle any errors that occur during the request
        }


    } else {
        console.log('Form contains errors. Please fill in all required fields.');
        window.alert('Please fill in all required fields.');
    }
  };
  
  return(
            <div className='h-screen'>
                <h1>This is for updating the patient info</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="border-b border-gray-900/10 pb-12 px-5">
                        <h1 className="text-3xl font-semibold leading-7 text-gray-900">Personal Information</h1>
                        
                        <div className="mt-10 grid grid-cols-1 gap-x-2 gap-y-5 lg:grid-cols-6 px-5">
                            <div className="sm:col-span-3">
                            <label htmlFor="patientFirstName" className="block text-sm font-medium leading-6 text-gray-900">First name</label>
                            <div className="mt-2">
                                <input type="text" {...register("patientFirstName",{ required: 'First name is required' })} id="patientFirstName" autoComplete="given-name" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.patientFirstName && (
                                    <span className="text-red-500">{errors.patientFirstName.message}</span>
                                )}
                            </div>
                            </div>
    
                            <div className="sm:col-span-3">
                            <label htmlFor="patientLastName" className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                            <div className="mt-2">
                                <input type="text" {...register("patientLastName", { required: 'Last name is required' })} id="patientLastName" autoComplete="family-name" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.patientLastName && (
                                    <span className="text-red-500">{errors.patientLastName.message}</span>
                                )}
                            </div>
                            </div>
    
                            <div className="sm:col-span-3">
                            <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">Gender</label>
                            <div className="mt-2">
                                <select id="gender" {...register("gender",{ required: 'Gender is required' })} autoComplete="gender" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                <option value=''>Select</option> {/* Add an initial empty option */}
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                </select>
                                {errors.gender && (
                                    <span className="text-red-500">{errors.gender.message}</span>
                                )}
                            </div>
                            </div>

                            <div className="sm:col-span-3">
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium leading-6 text-gray-900">
                                Date of Birth
                            </label>
                            <div className="mt-2">
                                <CustomDatePicker  control={control} name="dateOfBirth" rules={{ required: 'Date of birth is required' }} />
                                {errors.dateOfBirth && (
                                    <span className="text-red-500">{errors.dateOfBirth.message}</span>
                                )}
                            </div>
                            </div>



                            <div className="sm:col-span-2">
                            <label htmlFor="dateOfAdmission" className="block text-sm font-medium leading-6 text-gray-900">
                                Date of Admission
                            </label>
                            <div className="mt-2">
                                <CustomDatePicker  control={control} name="dateOfAdmission" rules={{ required: 'Date of Admission is required' }} />
                                {errors.dateOfAdmission && (
                                    <span className="text-red-500">{errors.dateOfAdmission.message}</span>
                                )}
                            </div>
                            </div>

                            <div className="sm:col-span-2">
                            <label htmlFor="roomNumber" className="block text-sm font-medium leading-6 text-gray-900">Room Number</label>
                            <div className="mt-2">
                                <input type="text" {...register("roomNumber",{ required: 'Room number is required' })} id="roomNumber" autoComplete="roomNumber" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.roomNumber && (
                                    <span className="text-red-500">{errors.roomNumber.message}</span>
                                )}
                            </div>
                            </div>


                            <div className="sm:col-span-2">
                            <label htmlFor="bedNumber" className="block text-sm font-medium leading-6 text-gray-900">Bed Number(optional)</label>
                            <div className="mt-2">
                                <input type="text" {...register("bedNumber")} id="bedNumber" autoComplete="bedNumber" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                            </div>

                            

                        
                        </div>
                    </div>
    
    
                    <div className="border-b border-gray-900/10 pb-12 px-5">
                        
                        <h2 className="text-3xl sm:col-span-4 font-semibold leading-7 text-gray-900">Emergecny contact info</h2>  
                        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-6 px-5"> 
                            
                            <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Name for next of kin</label>
                            <div className="mt-2">
                                <input id="kinName" {...register("kinName",{ required: 'Please fill in the emergency contact details' })} type="kinName" autoComplete="kinName" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.kinName && (
                                    <span className="text-red-500">{errors.kinName.message}</span>
                                )}
                            </div>
                            </div>
    
    
                            <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Emergency contact number </label>
                            <div className="mt-2">
                                <input id="EmergencyContactNumber" {...register("EmergencyContactNumber",{ required: 'Please fill in the emergency contact details' })} type="EmergencyContactNumber" autoComplete="EmergencyContactNumber" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.EmergencyContactNumber && (
                                    <span className="text-red-500">{errors.EmergencyContactNumber.message}</span>
                                )}
                            </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <button type="submit">Submit</button>
                    <DevTool control={control} />
                </form>
            </div>
        );


}
export default UpdatePatientInfo;






