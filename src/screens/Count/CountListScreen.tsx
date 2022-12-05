import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LargeInt, PageLimit } from '../../constants';
import Button from '../../lib/Button';
import { useDialog } from '../../lib/dialog.context';
import { CountFragment, CountModel } from '../../models/count.model';
import { useUser } from '../../services/user.context';
import { CountListItem } from './CountListItem';

export const QueryCountList = gql`
query list_count($cursor: bigint!, $limit: Int!) { 
    count(limit: $limit, where: {
        id: {_lt: $cursor}
    } order_by: {id: desc}) {
        ${CountFragment}
    }
}
`


const MutationInsertCount = gql`
    mutation insert_count($object: count_insert_input!) {
        insert_count_one(object: $object) {
            id
        }
    }
`

function CountListScreen() {
    const dialog = useDialog();
    const navigate = useNavigate();
    const {
        user,
    } = useUser()
    const [insertCount, insert_status] = useMutation(MutationInsertCount)
    const [has_more, setHasMore] = useState(true);
    const {
        loading,
        data,
        fetchMore,
    } = useQuery(QueryCountList, {
        variables: {
            cursor: LargeInt,
            limit: PageLimit,
        },
        onCompleted: (d) => {
            setHasMore(d.count?.length % PageLimit === 0);
        }
    })

    const counts = (data?.count || []) as CountModel[];

    const loadMore = () => {
        if (counts.length > 0) {
            fetchMore({
                variables: {
                    cursor: counts[counts.length - 1].id,
                    limit: PageLimit,
                }
            })
        }
    }

    const startCount = async () => {
        try {
            const { data } = await insertCount({
                variables: {
                    object: {
                        clinic_user_id: user.id,
                    }
                },
                refetchQueries: [{
                    query: QueryCountList,
                    variables: {
                        cursor: LargeInt,
                        limit: PageLimit,
                    },
                }]
            })
            const id = data?.insert_count_one?.id;
            if (id) {
                navigate(`/counts/${id}`, { replace: true })
            }
        } catch (e) {
            dialog.showError(e)
        }
    }

    return (
        <div className='my-6 mx-auto container'>
            <div className='flex items-center mb-4'>
                <p className='ml-2 font-bold text-gray-500'>Counts</p>
                <div className='flex-1' />
                <Button onClick={startCount}
                    className='w-fit'
                    loading={insert_status.loading}>+ Start a Count</Button>
            </div>
            {counts.map(cycle => <CountListItem
                count={cycle}
                key={cycle.id}
            />)}
            {has_more ? <Button
                loading={loading} onClick={loadMore}>Fetch More</Button> : null}

        </div>
    )
}

export default CountListScreen