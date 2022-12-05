import React, { createContext, useContext, useState } from "react";
import ModalDialog, { DialogProps } from "./ModalDialog";
import { parseServerError } from "./parse-server-error";

export type ProvideDialogProps = {
    children?: React.ReactNode;
}

export type Toast = {
    message: string;
    duration?: number;
    type?: 'error' | 'success';
}

const AutoCloseDuration = 5000;

export type DialogContextProps = {
    showDialog: (_: DialogProps) => void;
    showSimpleDialog: (title: string, message: string) => void;
    showError: (error: any) => void;
    showToast: (toast: Toast) => void;
}

const DialogContext = createContext<DialogContextProps>({} as any);

export const ProvideDialog = ({
    children,
}: ProvideDialogProps) => {
    const [open, setOpen] = useState<DialogProps | undefined>()
    const [toast, setToast] = useState<Toast | undefined>();
    const [, setToastTimeout] = useState<NodeJS.Timeout>();

    const showDialog = (dialog: DialogProps) => {
        setOpen(dialog);
    }

    const showSimpleDialog = (title: string, message: string) => {
        setOpen({
            message,
            title,
            buttons: [{
                children: 'Okay',
                onClick: () => setOpen(undefined)
            }]
        });
    }

    const showError = (error: any) => {
        const { message } = parseServerError(error);
        setOpen({
            title: 'Error',
            message: message || 'Unknown error',
            buttons: [{
                children: 'Okay',
            }],
        })
    }
    const showToast = (toast: Toast) => {
        setToastTimeout(t => {
            if (t) {
                clearTimeout(t)
            }
            return setTimeout(() => {
                setToast(undefined);
            }, toast.duration || AutoCloseDuration)
        })
        setToast(toast);
    }

    return <DialogContext.Provider value={{
        showDialog,
        showSimpleDialog,
        showError,
        showToast,
    }}>
        <ModalDialog
            show={!!open}
            dialog={open}
            onClose={() => setOpen(undefined)}
        />
        {toast && <div className="fixed p-2 bottom-0 left-0 w-full z-50">
            <div className="max-w-lg relative mx-auto bg-slate-100 border-2 flex items-center p-4 shadow-lg rounded-lg overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${!toast.type && 'bg-slate-600'} ${toast.type === 'error' && 'bg-red-500'} ${toast.type === 'success' && 'bg-green-500'}`} />
                {toast.type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-green-500">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>}
                {toast.type === 'error' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500 mr-2">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>}
                <div className="text-md flex-1 mr-2">{toast.message}</div>
                <button
                    onClick={() => setToast(undefined)}
                    className='text-slate-800 rounded-full
                                hover:text-slate-900 flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>}
        {children}
    </DialogContext.Provider>
}


export const useDialog = () => {
    return useContext(DialogContext);
}