import React from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import DomainApi from '~/DomainApi';

export default function ApiToken() {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [valueAccessToken, setValueAccessToken] = React.useState('');

    React.useEffect(() => {
        async function fetchData() {
            try {
                const model = {
                    email: activeAccount.username,
                };
                const response = await DomainApi.post(`auth/email`, model);
                setValueAccessToken(response.data.access_token);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    return valueAccessToken;
}
