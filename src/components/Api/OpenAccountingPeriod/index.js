import { toast } from 'react-toastify';
import DomainApi from '~/DomainApi';
import { useSelector, useDispatch } from 'react-redux';

function Access_token() {
    // const access_token = useSelector((state) => state.Thunk.token);
    return useSelector((state) => state.Thunk.token);
}

export async function ApiReopenPeriod(access_token) {
    try {
        var statusCode = false;
        // const access_token = Access_token();
        const header = {
            Authorization: access_token,
        };

        const response = await DomainApi.post(
            `costing/acc-period/unitcode/${localStorage.getItem(
                'Unit',
            )}/open-next-period?username=${localStorage.getItem('UserName')}`,
            null,
            { headers: header },
        );
        statusCode = true;
        toast.success(' Success reopen the accounting period!');
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
