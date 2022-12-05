import React from 'react';
import Div100vh from 'react-div-100vh';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import packageJson from '../../package.json';
import { ZsMessageChannel } from '../ZsMessageChannel';
import Button from '../lib/Button';
import { useClinic } from '../services/clinic.context';
import { useUser } from '../services/user.context';

const Layout = () => {
  const {
    clinic,
  } = useClinic()
  const navigate = useNavigate()

  const {
    user,
    endSession
  } = useUser()

  const endSessionRoute = () => {
    navigate('/')
    endSession();
  }

  return (
    <Div100vh>
      <div className='h-full flex flex-col overflow-hidden'>
        <header className='flex items-center p-4 shadow-lg border-b-2'>
          <Link to='/' className='hover:bg-slate-100 rounded-full px-2 py-1'>
            <div className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <p className='ml-2 font-bold'>
                ZenSteri
              </p>
            </div>
          </Link>
          <div className='flex-1 text-center font-semibold'>{clinic.name}</div>
          <div className='flex items-center'>
            {user.is_admin && <Link to='/settings' className='hover:bg-slate-100 rounded-full px-2 py-1'>
              <div className='flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                </svg>
                <p className='ml-2 font-bold'>
                  Settings
                </p>
              </div>
            </Link>}
            <Button onClick={endSessionRoute}>{user.name} (Log Out)</Button>
          </div>
        </header>
        <div className='flex-1 overflow-y-auto'>
          <Outlet />
        </div>
        <footer className='py-2 border-t-2'>
          <div className='container  flex justify-between'>
            <p>Built with ❤️ <strong>ARORA</strong>DENTAL &copy; {new Date().getFullYear()}</p>
            <p>v{packageJson.version}</p>
          </div>
        </footer>
      </div>
    </Div100vh>
  );
}

export default Layout;
