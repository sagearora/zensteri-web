import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { UserFragment, UserModel } from "../../../models/user.model";

export const QueryUserList = gql`
query { 
    clinic_user(order_by: {id: desc}) {
        ${UserFragment}
    }
}
`

function UserListScreen() {
    const {
        loading,
        data,
    } = useQuery(QueryUserList)

    const users = (data?.clinic_user || []) as UserModel[];

    return <div className='my-6 mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/settings' />
            <p className='ml-2 font-bold text-gray-500'>Users</p>
            <div className='flex-1' />
            <Link
                to='create'>
                + Create User
            </Link>
        </div>
        {users.map(user => <Link
            className="flex items-center border-b-2 p-2 hover:bg-slate-200"
            to={`${user.id}/edit`}
            key={user.id}
        >
            <p className="flex-1">{user.name}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}

    </div>
}

export default UserListScreen;
