import DomainApi from '~/DomainApi';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

export const fetchPeriod = createAsyncThunk('master/fetchPeriod', async (unitcode) => {
    if (unitcode) {
        const response = await DomainApi.get(`master/account-period?unitcode=${unitcode}`);
        return response.data;
    }
});

export const fetchApiToken = createAsyncThunk('master/fetchApiToken', async (email) => {
    if (email) {
        const model = {
            email: email,
        };
        const response = await DomainApi.post(`auth/email`, model);
        return response.data.access_token;
    }
});
