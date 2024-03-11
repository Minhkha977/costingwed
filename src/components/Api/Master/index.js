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
