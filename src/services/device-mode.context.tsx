import React, { createContext, useContext, useEffect, useState } from "react";
import { OpModel } from "../models/op.model";
import OpCheckout from "../screens/Checkout/OpCheckout";
import OpSelection from "../components/OpSelection";
import { goFullscreen, goTrayWindow } from "./window-helper";

export type DeviceMode = 'steri' | 'op'

const DeviceModeContext = createContext<{
    mode: DeviceMode;
    setMode: (m: DeviceMode) => void;
}>({} as any);

export type DeviceModeProps = {
    children?: React.ReactNode
}

export const _ProvideDeviceMode = ({
    children,
}: DeviceModeProps) => {
    const [current_op, setCurrentOp] = useState<OpModel>()
    const [mode, _setMode] = useState<'steri' | 'op'>((localStorage.getItem('mode') || 'steri') as DeviceMode)

    useEffect(() => {
        if (mode === 'op' && current_op) {
            goTrayWindow()
        } else if (mode === 'steri') {
            goFullscreen()
        }
    }, [mode, current_op])

    const setMode = (m: DeviceMode) => {
        _setMode(m)
        localStorage.setItem('mode', m)
    }

    if (!mode) {
        return <div className="max-w-lg px-4 py-16 mx-auto sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">ZenSteri</h1>

            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
                Dental sterilization simplified
            </p>
        </div>
    }

    if (mode === 'steri') {
        return <DeviceModeContext.Provider value={{
            mode,
            setMode,
        }}>
            {children}
        </DeviceModeContext.Provider>
    }


    return <DeviceModeContext.Provider value={{
        mode,
        setMode,
    }}>
        {current_op
            ? <OpCheckout op={current_op} />
            : <OpSelection onSelect={setCurrentOp} />}
    </DeviceModeContext.Provider>
}

export const useDeviceMode = () => {
    return useContext(DeviceModeContext);
}