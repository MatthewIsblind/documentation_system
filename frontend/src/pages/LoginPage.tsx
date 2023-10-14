import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


interface Props {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

  userName: String;
  setUserName: React.Dispatch<React.SetStateAction<String>>;

}

const LoginPage: React.FC<Props> = ({ isLoggedIn, setIsLoggedIn,userName,setUserName}) => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [error, setError] = useState<string>(''); // State for the error message


    const handleLogin = () => {
      // Replace these dummy values with actual username and password
      const dummyUsername = 'testinguser';
      const dummyPassword = '123';

      // Get the values entered by the user
      const userNameInput = document.getElementById('userName') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      console.log(userNameInput.value)
      console.log(passwordInput.value)

      if (userNameInput.value === dummyUsername && passwordInput.value === dummyPassword) {
        // Update the isLoggedIn state to true
        console.log("username and password match");
        console.log("before logging in" + userName);

        setIsLoggedIn(true);
        setUserName(userNameInput.value);
        localStorage.setItem('isLoggedIn', 'true');
        console.log("after logging in" + userName);
        navigate('/');
      } else {
        setError('Incorrect username or password. Please try again.');
      }
    };



  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label  className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="userName"
                  name="userName"
                  type="userName"
                  autoComplete="userName"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
              </div>
            </div>

            <div>
              {error && (
                <div className="mt-2 text-red-600 text-center">{error}</div>
              )}
            <button type="button" onClick={handleLogin} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Sign in
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
