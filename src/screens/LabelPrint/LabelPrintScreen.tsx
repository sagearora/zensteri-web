import { useQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../lib/Loading';
import { SteriItemModel } from '../../models/steri-item.model';
import { QueryAllSteriItems } from '../../queries';
import { useUser } from '../../services/user.context';

function LabelPrintScreen() {
    const { user } = useUser();
    const {
        data,
        loading,
    } = useQuery(QueryAllSteriItems({}))
    const [selected_category, setSelectedCategory] = useState<{
        name: string;
        items: SteriItemModel[]
    }>();

    const categories = useMemo(() => {
        return ((data?.steri_item || []) as SteriItemModel[])
            .reduce((all, item) => ({
                ...all,
                [item.category.toLowerCase()]: {
                    name: item.category,
                    items: all[item.category.toLowerCase()] ? [
                        ...all[item.category.toLowerCase()].items,
                        item,
                    ] : [item],
                }
            }), {} as {
                [id: string]: {
                    name: string;
                    items: SteriItemModel[]
                }
            })
    }, [data])

    return (
        <div className='h-full flex item-stretch overflow-hidden'>
            {loading ? <Loading /> : null}
            <div className='w-1/4 border-r-2 shadow-lg p-4 overflow-y-auto'>
                <p className='text-md font-bold mb-2'>Categories</p>
                {Object.keys(categories).map(category => <button
                    className={`p-4 w-full mb-4 rounded-xl ${selected_category?.name === category ? 'bg-green-100 hover:bg-green-200' : 'bg-slate-200 hover:bg-slate-300'}`}
                    onClick={() => setSelectedCategory(categories[category])}
                    key={category}>{category}</button>)}
                {user.is_admin && <Link to='/settings/steri-items'>
                    <div className='text-blue-800 py-2 text-center'>Edit Items</div>
                </Link>}
            </div>
            <div className='flex-1 relative'>
                <div className='p-4'>
                    <p className='text-md font-bold mb-2'>{selected_category?.name || 'Pick a category'}</p>
                    {selected_category ? <div className='w-full grid grid-cols-3 gap-4 items-start'>
                        {selected_category.items.map(item => <button
                            key={item.id}
                            className='relative p-4 bg-slate-100 h-full rounded-xl overflow-hidden'
                        >{item.name}
                        </button>)}</div> : null}
                </div>
            </div>
            <div className='w-1/5 p-4 border-l-2 flex flex-col justify-center items-center overflow-hidden'>
                <p className='font-bold text-lg text-center'>Printing Is Not Supported<br/>On This Device</p>
            </div>
        </div>
    )
}

export default LabelPrintScreen