// CustomDatePicker.tsx
import React, { useState } from 'react';
import { useForm, Controller , SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomDatePickerProps {
  control: any; // Replace 'any' with the appropriate type for 'control'
  name: string;
  rules:any;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ control, name ,rules}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div>
    <Controller
      rules = {rules}
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            field.onChange(date?.toLocaleDateString('en-AU')); // Pass the selected date to react-hook-form
          }}
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          isClearable
          showYearDropdown
          fixedHeight = {true}
          dropdownMode="select"
        />
      )}
    />
    </div>
  );
};

export default CustomDatePicker;
