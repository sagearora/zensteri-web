import React, { ReactNode } from 'react'
import { classNames } from './form/classNames'

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children: ReactNode;
    loading?: boolean;
}

function Button({
    children,
    loading,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button {...props}
            disabled={loading || disabled}
            className={classNames(className, `py-2 w-full bg-slate-200 flex items-center 
            justify-center px-4 rounded-xl font-semibold uppercase`, 
            disabled ? 'cursor-not-allowed' : 'hover:bg-orange-200')}>
            {loading ? <svg
                className='w-4 h-4 mr-2 animate-spin'
                fill="currentColor"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" />
            </svg> : null}
            {children}
        </button>
    )
}

export default Button