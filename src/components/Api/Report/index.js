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

export async function Api_Report_COGS({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/SH/cogs?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}`;
        const response = await DomainApi.get(url);
        const dataSum = response.data.cogs_summary;
        const data = [...response.data.cogs_detail, dataSum];

        setDataExport(data);
        // setDataExport(response.data.cogs_detail);
        status_code = true;
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api export list! \n' + error.response.data);
        } else {
            toast.error(' Error api export list! \n' + error.message);
        }
    }
    return status_code;
}

export async function Api_Report_InOut({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/SH/inout-ward?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}`;
        const response = await DomainApi.get(url);

        setDataExport(response.data.detail);
        status_code = true;
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api export list! \n' + error.response.data);
        } else {
            toast.error(' Error api export list! \n' + error.message);
        }
    }
    return status_code;
}

export async function Api_PDF_Report_COGS({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogs?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}`;
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api get url base64! \n' + error.response.data);
        } else {
            toast.error(' Error api get url base64! \n' + error.message);
        }
    }
}

export async function Api_PDF_Report_InOutWard({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/inout?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}`;
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api get url base64! \n' + error.response.data);
        } else {
            toast.error(' Error api get url base64! \n' + error.message);
        }
    }
}

export async function Api_Report_COGM({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataExport }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        var status_code = false;
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogm?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=3`;
        const response = await DomainApi.get(url);

        setDataExport(response.data);
        status_code = true;
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api export list! \n' + error.response.data);
        } else {
            toast.error(' Error api export list! \n' + error.message);
        }
    }
    return status_code;
}

export async function Api_PDF_Report_COGM({ COSTCENTER, PERIOD_YEAR, PERIOD_MONTH, setDataUrlBase64 }) {
    try {
        if (PERIOD_MONTH !== 10 && PERIOD_MONTH !== 11 && PERIOD_MONTH !== 12) {
            var dateMonth = `0${PERIOD_MONTH}`;
        }
        let url = `report/unitcode/${localStorage.getItem('Unit')}/pdf/cogm?username=${localStorage.getItem(
            'UserName',
        )}&cost_center=${COSTCENTER}&acc_period_year=${PERIOD_YEAR}&acc_period_month=${dateMonth}&export_type=2`;
        const response = await DomainApi.get(url);

        setDataUrlBase64(response.data);
        // setDataExport(response.data.cogs_detail);
    } catch (error) {
        console.log(error);
        if (error.response) {
            toast.error(' Error api get url base64! \n' + error.response.data);
        } else {
            toast.error(' Error api get url base64! \n' + error.message);
        }
    }
}
