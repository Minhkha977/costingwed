import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function ApiLivePigList(valuePeriodMonth, valuePeriodYear, setDataList) {
    try {
        if (valuePeriodMonth !== 10 && valuePeriodMonth !== 11 && valuePeriodMonth !== 12) {
            var dateMonth = `0${valuePeriodMonth}`;
        }
        let url = `journal/unitcode/${localStorage.getItem(
            'Unit',
        )}/live-pig-value/transfer-to-SH?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_month=${dateMonth}&acc_period_year=${valuePeriodYear}`;

        const response = await DomainApi.get(url);
        setDataList(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data list!');
    }
}

export async function ApiCreateLivePig(
    access_token,
    valueCostCenter,
    value,
    valueDescription,
    valuePeriodMonth,
    valuePeriodYear,
) {
    if (valueCostCenter && value) {
        try {
            if (valuePeriodMonth !== 10 && valuePeriodMonth !== 11 && valuePeriodMonth !== 12) {
                var dateMonth = `0${valuePeriodMonth}`;
            }
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                cost_center: valueCostCenter,
                trans_value: value,
                description: valueDescription,
                username: localStorage.getItem('UserName'),
            };
            const response = await DomainApi.post(
                `journal/unitcode/${localStorage.getItem(
                    'Unit',
                )}/live-pigs-value/transfer-to-SH?acc_period_month=${dateMonth}&acc_period_year=${valuePeriodYear}`,
                model,
                { headers: header },
            );
            statusCode = true;
            toast.success(' Success create new Live Pig!');
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(error.message);
            }
        }
        return statusCode;
    }
}

export async function ApiUpdateLivePig(
    access_token,
    valueCode,
    valueCostCenter,
    value,
    valueDescription,
    valuePeriodMonth,
    valuePeriodYear,
) {
    if (valueCostCenter && value) {
        try {
            if (valuePeriodMonth !== 10 && valuePeriodMonth !== 11 && valuePeriodMonth !== 12) {
                var dateMonth = `0${valuePeriodMonth}`;
            }
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                trans_id: valueCode,
                cost_center: valueCostCenter,
                trans_value: value,
                description: valueDescription,
                username: localStorage.getItem('UserName'),
            };
            const response = await DomainApi.put(
                `journal/unitcode/${localStorage.getItem(
                    'Unit',
                )}/live-pigs-value/transfer-to-SH?acc_period_month=${dateMonth}&acc_period_year=${valuePeriodYear}`,
                model,
                { headers: header },
            );
            toast.success(' Success update live pig!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiDeleteLivePig(access_token, valueCode) {
    if (access_token && valueCode) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            let url = `journal/unitcode/${localStorage.getItem(
                'Unit',
            )}/live-pigs-value/transfer-to-SH?username=${localStorage.getItem('UserName')}&trans_id=${valueCode}`;
            const response = await DomainApi.delete(url, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success!');
            statusCode = true;
        } catch (error) {
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(error.message);
            }
        }
        return statusCode;
    }
}
