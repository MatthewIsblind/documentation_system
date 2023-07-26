// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// interface CalendarPickerProps {
//   selectedDate: Date | null;
//   onDateChange: (date: Date | null) => void;
//   fieldName: string;
// }

// function CalenderPicker({ selectedDate, onDateChange, fieldName }: CalendarPickerProps) {
//   const defaultDate = selectedDate || new Date(); // Use current date as the default if selectedDate is null

//   return (
//     <div className="sm:col-span-2">
//       <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
//         {fieldName}
//       </label>
//       <div className="mt-2">
//         <DatePicker
//           id="datePicker"
//           selected={selectedDate}
//           onChange={date => onDateChange(date)}
//           dateFormat="dd/MM/yyyy" // Set the date format here
//           className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
//           defaultValue={defaultDate} // Set the default value for the DatePicker
//         />
//       </div>
//     </div>
//   );
// }

// export default CalenderPicker;

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CalenderPicker({ selectedDate, onDateChange, fieldName }) {
  const defaultDate = selectedDate || new Date(); // Use current date as the default if selectedDate is null

  return (
    <div className="sm:col-span-2">
      <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
        {fieldName}
      </label>
      <div className="mt-2">
        <DatePicker
          id="datePicker"
          selected={selectedDate}
          onChange={onDateChange}
          dateFormat="dd/MM/yyyy" // Set the date format here
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          defaultValue={defaultDate} // Set the default value for the DatePicker
        />
      </div>
    </div>
  );
}

export default CalenderPicker;
