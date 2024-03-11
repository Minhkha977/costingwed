import React from 'react';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';
import ApiToken from '../ApiToken';

export async function ApiAccountEntryListHeader(valueDateMonth, valueDateYear, valueSearch, setDataAEListHeader) {
    try {
        if (valueDateMonth != 10 && valueDateMonth != 11 && valueDateMonth != 12) {
            var dateMonth = `0${valueDateMonth}`;
        }
        let url = `journal/acc-entry/unitcode/${localStorage.getItem('Unit')}?username=${localStorage.getItem(
            'UserName',
        )}&acc_period_month=${dateMonth}&acc_period_year=${valueDateYear}`;
        if (valueSearch) {
            url += `?doc_code=${valueSearch}`;
        }
        const response = await DomainApi.get(url);
        setDataAEListHeader(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data account entry list!');
    }
}

export async function ApiCreateAccountEntryHeader(access_token, valueDescription, valueCurrency, valueAccountGroup) {
    if (access_token && valueDescription && valueCurrency && valueAccountGroup) {
        try {
            const header = {
                Authorization: access_token,
            };
            const model = {
                desciption: valueDescription,
                currency: valueCurrency,
                grp_acc: valueAccountGroup,
            };
            let url = `journal/acc-entry/unitcode//${localStorage.getItem('Unit')}?username=${localStorage.getItem(
                'UserName',
            )}`;
            const response = await DomainApi.post(url, model, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success create new account entry header!');
        } catch (error) {
            console.log(error);
            toast.error(' Error api create account entry header!');
        }
    }
}

export async function ApiUpdateAccountEntryHeader(
    access_token,
    valueDocCode,
    valueDescription,
    valueCurrency,
    valueAccountGroup,
) {
    if (access_token && valueDocCode && valueDescription && valueCurrency && valueAccountGroup) {
        try {
            const header = {
                Authorization: access_token,
            };
            const model = {
                desciption: valueDescription,
                currency: valueCurrency,
                grp_acc: valueAccountGroup,
            };
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocCode}?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.put(url, model, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success update account entry header!');
        } catch (error) {
            console.log(error);
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(' Error api update account entry header! \n' + error.response.data);
            } else {
                toast.error(' Error api update account entry header! \n' + error.message);
            }
        }
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
            const dataFilter = response.data.filter((data) => data.isactive === true);
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

export async function ApiCreateAccountEntryDetail(
    access_token,
    valueDocNo,
    valueAccountCode,
    valueDescription,
    valueCostCenter,
    valueTotalCreditAe,
    valueTotalDebitAe,
) {
    if (access_token && valueDocNo && valueCostCenter && valueAccountCode) {
        try {
            const header = {
                Authorization: access_token,
            };
            const model = {
                acc_code: valueAccountCode,
                description: valueDescription,
                cost_center: valueCostCenter,
                credit_amount: valueTotalCreditAe,
                debit_amout: valueTotalDebitAe,
            };
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocNo}/detail?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.post(url, model, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success create new account entry Detail!');
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api new account entry detail! \n' + error.response.data);
            } else {
                toast.error(' Error api new account entry detail! \n' + error.message);
            }
        }
    } else {
        toast.error(' Empty doc no, cost center,account group!');
    }
}

export async function ApiUpdateAccountEntryDetail(
    access_token,
    valueDocNo,
    valueDetailId,
    valueAccountCode,
    valueDescription,
    valueCostCenter,
    valueTotalCreditAe,
    valueTotalDebitAe,
) {
    if (access_token && valueDocNo && valueAccountCode) {
        try {
            const header = {
                Authorization: access_token,
            };
            const model = {
                acc_code: valueAccountCode,
                description: valueDescription,
                cost_center: valueCostCenter,
                credit_amount: valueTotalCreditAe,
                debit_amout: valueTotalDebitAe,
            };

            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocNo}/detail/${valueDetailId}?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.put(url, model, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success update account entry Detail!');
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(' Error api update account entry detail! \n' + error.response.data);
            } else {
                toast.error(' Error api update account entry detail! \n' + error.message);
            }
        }
    } else {
        toast.error(' Empty doc no, account code!');
    }
}

export async function ApiDeleteAccountEntryDetail(access_token, valueDocNo, valueDetailId) {
    if (access_token && valueDocNo && valueDetailId) {
        try {
            const header = {
                Authorization: access_token,
            };
            let url = `journal/acc-entry/unitcode/${localStorage.getItem(
                'Unit',
            )}/docno/${valueDocNo}/detail/${valueDetailId}?username=${localStorage.getItem('UserName')}`;
            const response = await DomainApi.delete(url, { headers: header });
            // setDataAEListHeader(response.data);
            toast.success(' Success delete account entry detail!');
        } catch (error) {
            console.log(error);
            console.log('>>Error: ', error);
            if (error.response) {
                toast.error(' Error api delete account entry detail! \n' + error.response.data);
            } else {
                toast.error(' Error api delete account entry detail! \n' + error.message);
            }
        }
    }
}
