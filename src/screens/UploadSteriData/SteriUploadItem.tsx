import React, { useMemo } from 'react';
import Button from '../../lib/Button';
import { SteriFragment, SteriModel } from '../../models/steri.model';


export interface SteriMissingDataModel extends SteriModel {
    steri_missing_data?: {
        id: number;
        total_records: number;
    }
}

export const SteriUploadItemFragment = `
    ${SteriFragment}
    steri_missing_data {
        id
        total_records
    }
`;

export type SteriUploadItemProps = {
    item: SteriMissingDataModel;
    upload: () => void;
    loading?: boolean;
}

function SteriUploadItem({
    item,
    upload,
    loading,
}: SteriUploadItemProps) {
    const is_missing = useMemo(() => {
        return (item.steri_missing_data?.total_records || 0) > 0
    }, [item])

    return (
        <div
            className={`p-2 rounded-xl ${is_missing ? 'bg-red-200' : 'bg-green-200'}`}
        >
            <p className='text-xl font-bold'>{item.name}</p>
            <p className='text-md font-semibold'>{is_missing ? `Missing ${item.steri_missing_data?.total_records || 0} Records` : 'All log data uploaded'}</p>
            <p className='text-sm text-gray-800 mb-2'>{item.serial}</p>
            <Button
                disabled={!is_missing}
                loading={loading}
                onClick={upload}
            >Upload Data</Button>
        </div>
    )
}

export default SteriUploadItem