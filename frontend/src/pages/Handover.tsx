import React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from "@hookform/devtools";

let renderCount = 0;

type FormValues  = {
    firstname :String;
    lastname:String;
    email:String;
}

export default function Handover() {
    const form = useForm<FormValues>();
    const { register, control, handleSubmit } = form;

    const onSubmit = (data:FormValues) => {
        
        console.log('form submitted', data);
    };

    renderCount++;
    return (
        <div>
            <h1>this is for handover</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor='name'>first name</label>
                <input type='text' id='firstname' {...register("firstname")} />

                <label htmlFor='name'>last name</label>
                <input type='text' id='lastname' {...register("lastname")} />

                <label htmlFor='name'>email</label>
                <input type='text' id='email' {...register("email")} />

                <button className='bg-red-300' type='submit'>submit</button>
            </form>
            <DevTool control={control} />
        </div>
    );
}
