import { gql, useApolloClient, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { ZsMessageChannel } from '../../ZsMessageChannel';
import BackButton from '../../lib/BackButton';
import { useDialog } from '../../lib/dialog.context';
import Loading from '../../lib/Loading';
import { SteriModel } from '../../models/steri.model';
import { QuerySteriList } from '../../queries';
import { parseLexa } from './parse-lexa';
import SteriUploadItem, { SteriMissingDataModel, SteriUploadItemFragment } from './SteriUploadItem';

function UploadSteriData() {
    const dialog = useDialog();
    const [loading_steri, setLoadingSteri] = useState<{[id: number]: boolean}>({})
    const {
        loading,
        refetch,
        data,
    } = useQuery(QuerySteriList(SteriUploadItemFragment))
    const apollo = useApolloClient()

    const steris = (data?.steri || []) as SteriMissingDataModel[];

    const loadSteriData = async (steri: SteriModel) => {
        setLoadingSteri(d => ({
            ...d,
            [steri.id]: true,
        }))
        const files = await window.electron.ipcRenderer.invoke('zs-message', [
            ZsMessageChannel.ReadAllFiles,
            ['htm']
        ]) as {
            data: string;
            file: string;
        }[]
        try {
            if (!Array.isArray(files) || files.length === 0) {
                dialog.showSimpleDialog('No Data', 'Sorry no steri data found in this folder. Please make sure you select the folder containing all the seri files.')
                return;
            }
            const { data } = await apollo.query({
                query: gql`query cycles($steri_id: bigint!) {
                steri_cycle(where: {_and: [
                    {steri_id: {_eq: $steri_id}},
                    {log_data: {_is_null: true}}
                ]}) {
                    id
                    cycle_number
                }
            }`,
                variables: {
                    steri_id: steri.id
                }
            })
            const cycles_missing_data = (data?.steri_cycle || []) as {
                id: number;
                cycle_number: number;
            }[]
            const objects = parseLexa(
                steri.id,
                cycles_missing_data.map(d => d.cycle_number),
                files
            )
            if (objects.length === 0) {
                dialog.showSimpleDialog('No New Data', 'Hey we have already uploaded all log data we found in this folder.')
                return;
            }
            const { data: result } = await apollo.mutate({
                mutation: gql`
            mutation insert_steri_cycle_log_data($objects: [steri_cycle_insert_input!]!) {
                insert_steri_cycle(objects: $objects, on_conflict: {
                    constraint: steri_cycle_steri_id_cycle_number_key,
                    update_columns: [log_data]
                }) {
                    affected_rows
                }
            }`,
                variables: {
                    objects,
                }
            })
            const affected_rows = result?.insert_steri_cycle?.affected_rows || 0;
            refetch();
            dialog.showToast({
                message: `We have uploaded logs for ${affected_rows} cycles`,
                type: 'success',
            })
        } catch (e) {
            dialog.showError(e)
        } finally {
            setLoadingSteri(d => ({
                ...d,
                [steri.id]: false,
            }))
        }
    }

    return (
        <div className='my-6 mx-auto container'>
            <div className='flex items-center mb-4'>
                <BackButton href='/' />
                <p className='ml-2 font-bold text-gray-500'>Sterilizers</p>
            </div>
            {loading && <Loading />}
            <div className='grid grid-cols-2 gap-6'>
                {steris.map(steri => <SteriUploadItem
                    key={steri.id}
                    item={steri}
                    upload={() => loadSteriData(steri)}
                    loading={loading_steri[steri.id]}
                />)}
            </div>
        </div>
    )
}

export default UploadSteriData