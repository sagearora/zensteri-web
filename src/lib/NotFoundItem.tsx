import React, { ReactNode } from 'react'
import Button from './Button'

export type NotFoundItemProps = {
    icon?: ReactNode
    title: string;
    description?: string;
    back?: () => void;
    noBack?: boolean;
}

function NotFoundItem({
    icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>,
    title,
    description,
    back,
    noBack,
}: NotFoundItemProps) {
    return (
        <div className='my-4 mx-auto container flex flex-col items-center'>
            {icon}
            <h1 className='text-center my-2 font-bold text-lg'>{title}</h1>
            <h1 className='text-center mb-2 text-md'>{description}</h1>
            {!noBack && <Button onClick={() => back ? back() : window.history.back()}>Go Back</Button>}
        </div>
    )
}

export default NotFoundItem