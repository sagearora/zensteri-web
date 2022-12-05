export const parseLexa = (
    steri_id: number,
    cycles_missing_data: number[],
    files: {
        file: string;
        data: string;
    }[]) => {
    return files.map(file => ({
        steri_id,
        cycle_number: getCycleNumber(file.file),
        log_data: file.data,
    })).filter(o => cycles_missing_data.indexOf(o.cycle_number) > -1)
}

const getCycleNumber = (file: string) => {
    const filename = file.split('/').pop()

    return +(filename || '').split(' ')[0]
}