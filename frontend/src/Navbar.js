
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'infoTable', to: '/infoTable' },
  { name: 'handOver', to: '/handOver' },
  { name: 'Create Patient', to: '/UpdatePatientInfo' },
  { name: 'PatientDashboard', to: '/PatientDashboard' }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}



export default function NavBar({ isLoggedIn,setIsLoggedIn, userName }) {

  const navigate = useNavigate();

  const handleLogout = () =>{
    console.log("adwdadawd" + isLoggedIn + userName)
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(!isLoggedIn)
  }


  const navigationWithLogout = isLoggedIn
  ? [...navigation, { name: 'Logout', to: '/login', onClick: handleLogout }]
  : navigation;


  return (
    <Disclosure as="nav" className="bg-gray-800">
      
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                {isLoggedIn && 
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                }
              </div> {console.log("logged in status " + isLoggedIn)}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                  {isLoggedIn && (
                      <p className={classNames(
                        'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}>
                        Hello, {userName}
                      </p>
                    )}
                    {isLoggedIn && navigationWithLogout.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        onClick={item.onClick} // Attach onClick handler
                        className={classNames(
                          'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
            {isLoggedIn && (
                <p className={classNames(
                  'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium'
                )}>
                  Hello, {userName}
                </p>
              )}
              {isLoggedIn && navigationWithLogout.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={item.onClick} // Attach onClick handler
                  className={classNames(
                    'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
  
  // return (
  //   <Disclosure as="nav" className="bg-gray-800">
  //     {({ open }) => (
  //       <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
  //         <div className="relative flex h-16 items-center justify-between">
  //           <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
  //             <div className="hidden sm:ml-6 sm:block">
  //               <div className="flex space-x-4">
  //                 {isLoggedIn && navigation.map((item) => (
  //                   <Link
  //                     key={item.name}
  //                     to={item.to}
  //                     className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
  //                   >
  //                     {item.name}
  //                   </Link>
  //                 ))}
  //               </div>
  //             </div>
  //           </div>
  //           <div className="hidden sm:block">
  //             {isLoggedIn ? (
  //               <div className="ml-4 flex items-center space-x-4">
  //                 <span className="text-gray-300">Hello, {username}</span>
  //                 <button
  //                   onClick={() => {
  //                     handleLogout();
  //                     navigate('/login');
  //                   }}
  //                   className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
  //                 >
  //                   Logout
  //                 </button>
  //               </div>
  //             ) : (
  //               <div></div>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </Disclosure>
  // );
}
