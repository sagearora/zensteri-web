import React, { createContext, MutableRefObject, useContext, useEffect, useState } from "react";
import { useIdleTimer } from 'react-idle-timer';
import { useDialog } from "../lib/dialog.context";
import { UserModel } from "../models/user.model";
import NoUserScreen from "../screens/NoUserScreen";

const UserContext = createContext<{
    user: UserModel;
    resetInactiveTimer: () => void;
    endSession: () => void;
}>({} as any);

export type ProvideUserProps = {
    children?: React.ReactNode;
    adminRequired?: boolean;
}

const ExpiryMilliSeconds = 60 * 10 * 1000 // 10 minutes

export const ProvideUser = ({
    children,
    adminRequired,
}: ProvideUserProps) => {
    const dialog = useDialog();
    const [user, _setUser] = useState<UserModel | undefined>();
    const onIdle = () => {
        setUser(undefined)
    }

    const timer = useIdleTimer({
        onIdle,
        timeout: ExpiryMilliSeconds,
    })

    useEffect(() => {
        const saved_user = localStorage.getItem('user')
        const saved = saved_user ? JSON.parse(saved_user) as {
            user: UserModel
        } : undefined
        if (!saved || !saved.user) {
            return
        }
        if (adminRequired && !saved.user.is_admin) {
            return
        }
        _setUser(saved.user)
    }, [adminRequired])

    const setUser = (user?: UserModel) => {
        if (!!user && adminRequired && !user.is_admin) {
            dialog.showSimpleDialog('Admin Required', 'Only an admin user can access this section of the app.')
            return;
        }
        _setUser(user);
        localStorage.setItem('user', JSON.stringify(user ? {
            user
        } : {}))
    }


    return user ? <UserContext.Provider value={{
        user,
        resetInactiveTimer: () => timer.reset(),
        endSession: () => setUser(undefined)
    }}>{children}</UserContext.Provider> : <NoUserScreen setUser={setUser} />
}

export const useUser = () => {
    return useContext(UserContext);
}