import React from 'react';
import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';

export async function ApiListAccountGroup(valueSearch, setDataList) {
    try {
        let url = `master/group-account/search?username=${localStorage.getItem('UserName')}`;
        if (valueSearch) {
            url += `&searchtxt=${valueSearch}`;
        }
        const response = await DomainApi.get(url);
        setDataList(response.data);
    } catch (error) {
        console.log(error);
        toast.error(' Error api get data account group list!');
    }
}
