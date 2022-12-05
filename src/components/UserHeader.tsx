import dayjs from 'dayjs';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../lib/Button';
import { useUser } from '../services/user.context';
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function UserHeader() {
    const navigate = useNavigate();
    const {
        user,
        endSession
    } = useUser()

    const endSessionRoute = () => {
        navigate('/')
        endSession();
    }

    return (
        <div className='container py-4'>
            <Button onClick={endSessionRoute}>{user.name}</Button>
        </div>
    )
}

export default UserHeader