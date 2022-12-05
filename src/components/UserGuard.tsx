import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '../services/user.context';

export type UserGuardProps = {
  adminRequired?: boolean;
}

const UserGuard = ({
  adminRequired,
}: UserGuardProps) => {
  const { user, endSession } = useUser()

  useEffect(() => {
    if (!!adminRequired && !user.is_admin) {
      endSession()
    }
  }, [adminRequired, user.is_admin])

  return (<Outlet />);
}

export default UserGuard;
