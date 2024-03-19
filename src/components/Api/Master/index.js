import React from 'react';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function ApiCurrency(setDataListCurrency) {
    try {
        var response = await DomainApi.get('master/currency');
        setDataListCurrency(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data currency list!');
    }
}

export async function ApiGroupCost(setDataGroupCost) {
    try {
        const response = await DomainApi.get(
            `master/group-expense/unit/${localStorage.getItem('Unit')}?username=${localStorage.getItem('UserName')}`,
        );
        setDataGroupCost(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data group cost list!');
    }
}

export async function ApiTypeCost(setDataTypeCost) {
    try {
        const response = await DomainApi.get(
            `master/type-expense/unit/${localStorage.getItem('Unit')}?username=${localStorage.getItem('UserName')}`,
        );
        setDataTypeCost(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get type cost list!');
    }
}
export async function ApiCostCenter(setDataCostCenter) {
    try {
        const response = await DomainApi.get(
            `master/cost-center?username=${localStorage.getItem('UserName')}&unitcode=${localStorage.getItem('Unit')}`,
        );
        setDataCostCenter(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get cost center list!');
    }
}
