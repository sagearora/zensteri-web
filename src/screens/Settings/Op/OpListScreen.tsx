import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LargeInt, PageLimit } from "../../../constants";
import BackButton from "../../../lib/BackButton";
import Button from "../../../lib/Button";
import { OpFragment, OpModel } from "../../../models/op.model";

export const QueryOpList = gql`
query list_ops($cursor: bigint!, $limit: Int!) { 
    op(limit: $limit, where: {
        id: {_lt: $cursor}
    } order_by: {id: desc}) {
        ${OpFragment}
    }
}
`

function OpListScreen() {
    const [has_more, setHasMore] = useState(true);
    const {
        loading,
        data,
        fetchMore,
    } = useQuery(QueryOpList, {
        variables: {
            cursor: LargeInt,
            limit: PageLimit,
        },
        onCompleted: (d) => {
            setHasMore(d.op?.length % PageLimit === 0);
        }
    })

    const ops = (data?.op || []) as OpModel[];

    const loadMore = () => {
        if (ops.length > 0) {
            fetchMore({
                variables: {
                    cursor: ops[ops.length - 1].id,
                    limit: PageLimit,
                }
            })
        }
    }

    return <div className='my-6 mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/settings' />
            <p className='ml-2 font-bold text-gray-500'>Operatories</p>
            <div className='flex-1' />
            <Link
                to='create'
            >+ Add Op</Link>
        </div>
        {ops.map(op => <Link
            className="flex items-center border-b-2 p-2 hover:bg-slate-200"
            to={`${op.id}/edit`}
            key={op.id}
        >
            <div className='flex-1'>
                <p className={`text-md ${op.archived_at ? 'line-through text-gray-700' : ''}`}>{op.name}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}
        {has_more ? <Button
            loading={loading} onClick={loadMore}>Fetch More</Button> : null}

    </div>
}

export default OpListScreen;
