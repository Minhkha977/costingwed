import dayjs from 'dayjs';
import { headers } from 'next/headers';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function ApiCalCOGM({ access_token, PERIOD_MONTH, PERIOD_YEAR }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        var statusCode = false;
        const header = {
            Authorization: access_token,
        };
        let url = `process/unitcode/${localStorage.getItem('Unit')}/COGM/cal?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_month=${dateMonth}&acc_period_year=${PERIOD_YEAR}`;
        const response = await DomainApi.post(url, null, { headers: header });

        statusCode = true;
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(error.response.data);
        } else {
            toast.error(error.message);
        }
        statusCode = false;
    }
    return statusCode;
}

export async function ApiCalCostTransfer({ access_token, PERIOD_MONTH, PERIOD_YEAR }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        var statusCode = false;
        const header = {
            Authorization: access_token,
        };
        let url = `process/unitcode/${localStorage.getItem('Unit')}/cost-tranfer/cal?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_month=${dateMonth}&acc_period_year=${PERIOD_YEAR}`;
        const response = await DomainApi.post(url, null, { headers: header });

        statusCode = true;
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(error.response.data);
        } else {
            toast.error(error.message);
        }
        statusCode = false;
    }
    return statusCode;
}

export async function ApiLoadDataReport({ valueCostCenter, PERIOD_MONTH, PERIOD_YEAR, setDataReport }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem(
            'Unit',
        )}/expense/spread-period?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${valueCostCenter}&acc_period_month=${dateMonth}&acc_period_year=${PERIOD_YEAR}`;

        const response = await DomainApi.get(url);
        setDataReport(
            response.data.sort(function (a, b) {
                return a.expense_code.localeCompare(b.expense_code);
            }),
        );
        status_code = true;
    } catch (error) {
        console.log(error);
    }
    return status_code;
}
