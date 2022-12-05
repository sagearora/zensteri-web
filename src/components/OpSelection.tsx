import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { LargeInt, PageLimit } from "../constants";
import Button from "../lib/Button";
import { OpFragment, OpModel } from "../models/op.model";

export const QueryOpList = gql`
query list_ops($cursor: bigint!, $limit: Int!) { 
    op(limit: $limit, where: {
        id: {_lt: $cursor}
    } order_by: {id: desc}) {
        ${OpFragment}
    }
}
`

export type OpSelectionProps = {
    onSelect: (op: OpModel) => void;
}

function OpSelection({ onSelect }: OpSelectionProps) {
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
        <p className="text-center">Select an OP</p>
        {ops.map(op => <button
            className="flex w-full items-center border-b-2 p-2 hover:bg-slate-200"
            onClick={() => onSelect(op)}
            key={op.id}
        >
            <div className='flex-1'>
                <p className={`text-md ${op.archived_at ? 'line-through text-gray-700' : ''}`}>{op.name}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>)}
        {has_more ? <Button
            loading={loading} onClick={loadMore}>Fetch More</Button> : null}

    </div>
}

export default OpSelection;
