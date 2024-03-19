export function Enum_Status_CostAllocation() {
    const status = [
        { code: '', name: 'ALL' },
        // { code: '0', name: 'DELETED' },
        { code: '1', name: 'NEW' },
        { code: '2', name: 'PROCESSING' },
        { code: '3', name: 'PAUSE' },
        { code: '4', name: 'FINISH' },
    ];
    return status;
}
