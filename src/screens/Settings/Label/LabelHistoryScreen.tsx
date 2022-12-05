import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import SteriLabel from '../../../components/SteriLabel';
import { LargeInt, PageLimit } from '../../../constants';
import BackButton from '../../../lib/BackButton';
import Button from '../../../lib/Button';
import { useDialog } from '../../../lib/dialog.context';
import NotFoundItem from '../../../lib/NotFoundItem';
import { SteriLabelModel } from '../../../models/steri-label.model';
import { QueryLabelList } from '../../../queries';
import { useUser } from '../../../services/user.context';

const MutationInsertSteriLabelEvent = gql`
    mutation event($object: steri_label_event_insert_input!) {
        insert_steri_label_event_one(object: $object) {
            id
        }
    }
`;

function LabelHistoryScreen() {
    const { user } = useUser()
    const dialog = useDialog();
    const [insertEvent] = useMutation(MutationInsertSteriLabelEvent)
    const [has_more, setHasMore] = useState(true);
    const {
        loading,
        data,
        refetch,
        fetchMore,
    } = useQuery(QueryLabelList({}), {
        variables: {
            cursor: LargeInt,
            limit: PageLimit,
        },
        onCompleted: (d) => {
            setHasMore(d.steri_label?.length % PageLimit === 0);
        }
    })

    const labels = (data?.steri_label || []) as SteriLabelModel[];

    const loadMore = () => {
        if (labels.length > 0) {
            fetchMore({
                variables: {
                    cursor: labels[labels.length - 1].id,
                    limit: PageLimit,
                }
            })
        }
    }

    const [text, setText] = useState('appointment_checkout:845:108')

    const fireEvent = async () => {
        const [cmd, ...args] = text.split(':')
        try {
            if (!cmd || args.length === 0) {
                return;
            }
            switch (cmd) {
                case 'steri_add':
                    console.log(`Add label ${args[0]} to steri: ${args[1]}`)
                    await insertEvent({
                        variables: {
                            object: {
                                steri_label_id: args[0],
                                type: 'stericycle_add_item',
                                clinic_user_id: user.id,
                                data: {
                                    steri_cycle_id: +args[1],
                                }
                            }
                        }
                    })
                    break;
                case 'steri_remove':
                    console.log(`Remove steri label ${args[0]}`)
                    await insertEvent({
                        variables: {
                            object: {
                                steri_label_id: args[0],
                                type: 'stericycle_remove_item',
                                clinic_user_id: user.id,
                                data: {},
                            }
                        }
                    })
                    break;
                case 'appointment_checkout':
                    console.log(`Checkout steri label ${args[0]} for ${args[1]}`)
                    await insertEvent({
                        variables: {
                            object: {
                                steri_label_id: args[0],
                                type: 'appointment_checkout',
                                clinic_user_id: user.id,
                                data: {
                                    appointment_id: args[1]
                                },
                            }
                        }
                    })
                    break;
                case 'appointment_return':
                    console.log(`Return unused steri label ${args[0]}`)
                    await insertEvent({
                        variables: {
                            object: {
                                steri_label_id: args[0],
                                type: 'appointment_return',
                                clinic_user_id: user.id,
                                data: {},
                            }
                        }
                    })
                    break;
            }
        } catch (e) {
            dialog.showError(e)
        }
    }

    return (
        <div className='my-6 container'>
            <div className='flex items-center mb-4'>
                <BackButton href='/settings' />
                <p className='ml-2 font-bold text-gray-500'>Steri Labels</p>
                <div className='flex-1' />
            </div>

            <Button onClick={() => refetch()}>Refresh</Button>

            <div className='py-4'>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={e => setText(e.target.value)} value={text} />
                <Button onClick={fireEvent}>Fire</Button>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                {labels.map(label => <SteriLabel
                    item={label}
                    key={label.id}
                />)}
            </div>
            {labels.length === 0 && !loading && <NotFoundItem title='No labels found' noBack />}
            {has_more && <Button
                loading={loading} onClick={loadMore}>Fetch More</Button>}
        </div>
    )

}

export default LabelHistoryScreen


// CREATE OR REPLACE FUNCTION fn_stericycle_add_item()
// RETURNS trigger
// LANGUAGE plpgsql AS
// $BODY$
// Begin
// Update steri_label
// Set steri_cycle_user_id = NEW.clinic_user_id,
// loaded_at = NEW.created_at,
// steri_cycle_id = NEW.data->>steri_cycle_id
// WHERE id = NEW.steri_label_id;
// RETURN NEW;
// END;
// $BODY$

// CREATE TRIGGER trigger_stericycle_add_item
// AFTER INSERT 
// ON steri_label_event
// FOR EACH ROW
// WHEN ((NEW.type)::text = 'stericycle_additem'::text)
// EXECUTE PROCEDURE fn_stericycle_add_item(); 