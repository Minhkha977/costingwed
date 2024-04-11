import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function Api_Export_CostAllocation(setDataExport) {
    try {
        let url = `report/cost-allocation/unitcode/${localStorage.getItem('Unit')}/get?username=${localStorage.getItem(
            'UserName',
        )}`;
        const response = await DomainApi.get(url);
        setDataExport(response.data);
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api export list! \n' + error.response.data);
        } else {
            toast.error(' Error api export list! \n' + error.message);
        }
    }
}
