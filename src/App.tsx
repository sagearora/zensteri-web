import React, { MutableRefObject, RefObject, useRef } from 'react';
import { ProvideApollo } from './apollo-firebase/with-apollo-firebase';
import LoadingScreen from './components/LoadingScreen';
import environment from './environment';
import { auth } from './firebase';
import { ProvideDialog } from './lib/dialog.context';
import AppRouter from './screens/AppRouter';
import LoginScreen from './screens/Login/LoginScreen';
import { ProvideClinic } from './services/clinic.context';
import { ProvideUser } from './services/user.context';


function App() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ProvideDialog>
      <ProvideApollo
        is_dev={!environment.production}
        backend_url={environment.backend_url}
        backend_ws_url={environment.backend_ws_url}
        LoadingScreen={<LoadingScreen />}
        LoginScreen={<LoginScreen />}
        auth={auth}
      >
        <ProvideClinic
          LoadingScreen={<LoadingScreen title='Loading Clinic' />}>
          <ProvideUser>
            <AppRouter />
          </ProvideUser>
        </ProvideClinic>
      </ProvideApollo>
    </ProvideDialog >
  )
}

export default App
