import React, { useState } from 'react'

export type SteriLogViewerProps = {
    log_data?: string;
}

function SteriLogViewer({
    log_data,
}: SteriLogViewerProps) {
    const [show_log, setShowLog] = useState(false)

    if (!log_data) {
        return null
    }

    return (
        <div className='mb-2'>
            <button
                onClick={() => setShowLog(v => !v)}
                className='px-2 py-1/2 text-blue-800 border-blue-800 border-2 rounded-lg hover:bg-blue-100'>{show_log ? 'Hide Log' : 'Show Log'}</button>
            {show_log && <iframe 
            className='w-full h-[400px] shadow-lg border-2 mt-2 p-2 rounded-xl'
            srcDoc={log_data} />}
        </div>
    )
}

export default SteriLogViewer