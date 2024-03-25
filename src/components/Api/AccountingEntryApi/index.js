import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';
import dayjs from 'dayjs';

export async function ApiAccountEntryListHeader(valueDateMonth, valueDateYear, valueSearch, setDataAEListHeader) {
    try {
        if (valueDateMonth !== 10 && valueDateMonth !== 11 && valueDateMonth !== 12) {
            var dateMonth = `0${valueDateMonth}`;
        }
        let url = `journal/acc-entry/unitcode/${localStorage.getItem('Unit')}?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_month=${dateMonth}&acc_period_year=${valueDateYear}`;
        if (valueSearch) {
            url += `&search_text=${valueSearch}`;
        }
        const response = await DomainApi.get(url);
        setDataAEListHeader(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data account entry list!');
    }
}

export async function ApiCreateAccountEntryHeader(
    access_token,
    valueDocsDateAe,
    valueDescription,
    valueCurrency,
    valueAccountGroup,
    modelDetail,
) {
    if (access_token && valueDescription && valueCurrency && valueAccountGroup) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };

            const model = {
                doc_date: dayjs(valueDocsDateAe).utc(true),
                desciption: valueDescription,
                currency: valueCurrency,
                grp_acc: valueAccountGroup,
                detail: modelDetail,
            };
            let url = `journal/acc-entry/unitcode//${localStorage.getItem('Unit')}?username=${localStorage.getItem(
                'UserName',
            )}`;
            const response = await DomainApi.post(url, model, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success create new account entry header!');
            statusCode = true;
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api create account entry header! \n' + error.response.data);
            } else {
                toast.error(' Error api create account entry header! \n' + error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiUpdateAccountEntryHeader(
    access_token,
    valueDocsDateAe,
    valueDocCode,
    valueDescription,
    valueCurrency,
    valueAccountGroup,
    modelDetail,
    setValueTotalDebitAe,
    setValueTotalCreditAe,
) {
    if (access_token && valueDocCode && valueDescription && valueCurrency && valueAccountGroup && modelDetail) {
        try {
            var statusCode = false;
            const header = {
                Authorization: access_token,
            };
            const model = {
                doc_date: dayjs(valueDocsDateAe).utc(true),
                desciption: valueDescription,
                currency: valueCurrency,
                grp_acc: valueAccountGroup,
                detail: modelDetail,
            };
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocCode}?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.put(url, model, { headers: header });
            console.log(response.data);
            setValueTotalDebitAe(response.data.total_debit);
            setValueTotalCreditAe(response.data.total_credit);
            toast.success(' Success update account entry header!');
            statusCode = true;
        } catch (error) {
            console.log(error);
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(' Error api update account entry header! \n' + error.response.data);
            } else {
                toast.error(' Error api update account entry header! \n' + error.message);
            }
            statusCode = false;
        }
        return statusCode;
    }
}

export async function ApiDeleteAccountEntryHeader(access_token, valueDocCode) {
    if (access_token && valueDocCode) {
        try {
            const header = {
                Authorization: access_token,
            };
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocCode}?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.delete(url, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success delete account entry header!');
        } catch (error) {
            console.log(error);
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(' Error api delete account entry header! \n' + error.response.data);
            } else {
                toast.error(' Error api delete account entry header! \n' + error.message);
            }
        }
    }
}

export async function ApiAccountEntryListDetail(valueDocNo, valueSearch, setDataAEListDetail) {
    if (valueDocNo) {
        try {
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocNo}/detail?username=${localStorage.getItem('UserName')}`;
            if (valueSearch) {
                url += `?detail_ids=${valueSearch}`;
            }
            const response = await DomainApi.get(url);
            const dataFilter = response.data;
            setDataAEListDetail(dataFilter);
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api get list account entry detail! \n' + error.response.data);
            } else {
                toast.error(' Error api get list account entry detail! \n' + error.message);
            }
        }
    } else {
        toast.error('Empty document No!');
    }
}

export async function ApiImportAccountEntry(access_token, valueFile) {
    if (access_token && valueFile) {
        try {
            const header = {
                Authorization: access_token,
                'Content-Type': 'multipart/form-data',
            };
            const fd = new FormData();
            fd.append('file', valueFile[0]);
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/import?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.post(url, fd, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success import file!');
        } catch (error) {
            console.log(error);
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(' Error import file! \n' + error.response.data);
            } else {
                toast.error('  Error import file! \n' + error.message);
            }
        }
    }
}
