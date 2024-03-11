import * as React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Form from 'react-bootstrap/Form';
import { DataGrid } from '@mui/x-data-grid';
import './AccountGroupStyles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DomainApi from '~/DomainApi';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import AlertDialog from '~/components/AlertDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ApiToken from '~/components/Api/ApiToken';
import { ApiListAccountGroup } from './ApiAccountGroup';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const columns = [
    { field: 'gr_acc_code', headerName: 'Group Code', minWidth: 120 },
    { field: 'gr_acc_name', headerName: 'Group Name', flex: 0.5, minWidth: 200 },
    {
        field: 'description',
        headerName: 'Description',
        // type: 'number',
        flex: 1,
        minWidth: 200,
        // width: 300,
    },
];

function Account({ title }) {
    const access_token = ApiToken();

    const [isLoading, setIsLoading] = React.useState(false);
    const [valueSearch, setValueSearch] = React.useState('');
    const [reloadListAccGroup, setReloadListAccGroup] = React.useState(false);
    const [dataList, setDataList] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        ApiListAccountGroup(valueSearch, setDataList);
        setIsLoading(false);
    }, [reloadListAccGroup]);
    const [valueCode, setValueCode] = React.useState('');
    const [valueName, setValueName] = React.useState('');
    const [valueDescription, setValueDescription] = React.useState('');
    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => dataList.find((row) => row.gr_acc_code === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueCode(key.gr_acc_code);
                    setValueName(key.gr_acc_name);
                    setValueDescription(key.description);
                });
            }
        }
    };
    const [dialogIsOpenNew, setDialogIsOpenNew] = React.useState(false);
    const [dialogIsOpenUpdate, setDialogIsOpenUpdate] = React.useState(false);
    const [callApiNew, setCallApiNew] = React.useState(false);
    const agreeDialogNew = () => {
        setDialogIsOpenNew(false);
        setCallApiNew(!callApiNew);
    };
    useEffect(() => {
        async function fetchData() {
            if (valueCode && valueName && valueDescription) {
                try {
                    setIsLoading(true);
                    const header = {
                        Authorization: access_token,
                    };
                    const model = {
                        gr_acc_code: valueCode,
                        gr_acc_name: valueName,
                        description: valueDescription,
                    };
                    const response = await DomainApi.post(
                        `master/group-account/new?username=${localStorage.getItem(
                            'UserName',
                        )}&unitcode=${localStorage.getItem('Unit')}`,
                        model,
                        { headers: header },
                    );
                    console.log(response);
                    setIsLoading(false);
                    setReloadListAccGroup(!reloadListAccGroup);
                    toast.success(' Success create new account group!');
                } catch (error) {
                    setIsLoading(false);
                    console.log('>>Error: ', error);
                    if (error.response) {
                        toast.error(error.response.data);
                    } else {
                        toast.error(error.message);
                    }
                }
            }
        }
        fetchData();
    }, [callApiNew]);
    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(' Cancel create new!');
    };
    const handleOnChangeValueCode = (event) => {
        setValueCode(event.target.value);
    };
    const handleOnChangeValueName = (event) => {
        setValueName(event.target.value);
    };
    const handleOnChangeValueDescription = (event) => {
        setValueDescription(event.target.value);
    };
    const handleOnClickNew = () => {
        if (!valueCode || !valueName || !valueDescription) {
            toast.error(' Code, name, description is empty!');
            return;
        }
        setDialogIsOpenNew(true);
    };
    const [callApiUpdate, setCallApiUpdate] = React.useState(false);
    const handleOnClickUpdate = () => {
        if (!valueCode || !valueName || !valueDescription) {
            toast.error(' Code, name, description is empty!');
            return;
        }
        setDialogIsOpenUpdate(true);
    };
    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        setCallApiUpdate(!callApiUpdate);
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(' Cancel update!');
    };

    useEffect(() => {
        async function fetchData() {
            if (valueCode && valueName && valueDescription) {
                try {
                    setIsLoading(true);
                    const header = {
                        Authorization: access_token,
                    };
                    const model = {
                        gr_acc_code: valueCode,
                        gr_acc_name: valueName,
                        description: valueDescription,
                    };
                    const response = await DomainApi.put(
                        `master/group-account/update?username=${localStorage.getItem(
                            'UserName',
                        )}&unitcode=${localStorage.getItem('Unit')}`,
                        model,
                        { headers: header },
                    );
                    setReloadListAccGroup(!reloadListAccGroup);
                    toast.success(' Success update account group!');
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.log('>>Error: ', error);
                    if (error.response) {
                        toast.error(error.response.data);
                    } else {
                        toast.error(error.message);
                    }
                }
            }
        }
        fetchData();
    }, [callApiUpdate]);
    const handleOnChangeValueSearch = (event) => {
        setValueSearch(event.target.value);
    };
    return (
        <div className="main">
            <ToastContainer />
            <AlertDialog
                title={'Create a new account group?'}
                content={
                    <>
                        Group code: {valueCode} <br /> Group name: {valueName} <br /> Description: {valueDescription}
                    </>
                }
                onOpen={dialogIsOpenNew}
                onClose={closeDialogNew}
                onAgree={agreeDialogNew}
            />
            <AlertDialog
                title={'Update account group?'}
                content={
                    <>
                        Group code: {valueCode} <br /> Group name: {valueName} <br /> Description: {valueDescription}
                    </>
                }
                onOpen={dialogIsOpenUpdate}
                onClose={closeDialogUpdate}
                onAgree={agreeDialogUpdate}
            />
            <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
            </div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container direction={'row'} spacing={1}>
                    <Grid xs={12} md={6}>
                        <Item>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    fullWidth
                                    label="Search"
                                    size="small"
                                    type="number"
                                    value={valueSearch}
                                    onChange={(event) => handleOnChangeValueSearch(event)}
                                />
                                <div>
                                    <LoadingButton
                                        startIcon={<SearchIcon />}
                                        variant="contained"
                                        color="warning"
                                        onClick={() => setReloadListAccGroup(!reloadListAccGroup)}
                                    >
                                        Search
                                    </LoadingButton>
                                </div>
                            </Stack>
                        </Item>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Item>
                            <Stack spacing={0}>
                                <h5 style={{ textAlign: 'left', fontWeight: 'bold' }}>Account Group List</h5>
                                <div style={{ width: '100%' }}>
                                    <DataGrid
                                        rows={dataList}
                                        columns={columns}
                                        getRowId={(row) => row.gr_acc_code}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 3 },
                                            },
                                        }}
                                        pageSizeOptions={[3, 5, 10, 15]}
                                        autoHeight
                                        loading={isLoading}
                                        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                                        // checkboxSelection
                                    />
                                </div>
                            </Stack>
                        </Item>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Item>
                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                <Stack
                                    width={'100%'}
                                    direction={'row'}
                                    spacing={2}
                                    alignItems={'center'}
                                    justifyContent={'flex-end'}
                                    height={50}
                                >
                                    <h5
                                        style={{
                                            fontWeight: 'bold',
                                            textAlign: 'left',
                                            width: '100%',
                                        }}
                                    >
                                        Account Group Information
                                    </h5>
                                </Stack>
                                <Stack direction={'row'} spacing={1}>
                                    <LoadingButton
                                        startIcon={<AddBoxIcon />}
                                        variant="contained"
                                        color="success"
                                        onClick={handleOnClickNew}
                                    >
                                        New
                                    </LoadingButton>
                                    <LoadingButton
                                        startIcon={<SystemUpdateAltIcon />}
                                        variant="contained"
                                        color="warning"
                                        onClick={handleOnClickUpdate}
                                    >
                                        Update
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                            <Grid xs={12} md={12}>
                                <Item>
                                    <Stack spacing={3}>
                                        <Stack direction={'row'} spacing={0}>
                                            <div className="div-h5">
                                                <h6>Group Code:</h6>
                                            </div>
                                            <TextField
                                                id="field-code"
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                type="number"
                                                value={valueCode}
                                                onChange={(event) => handleOnChangeValueCode(event)}
                                                placeholder="xxxx"
                                            />
                                        </Stack>
                                        <Stack direction={'row'} spacing={0}>
                                            <div className="div-h5">
                                                <h6>Group Name:</h6>
                                            </div>
                                            <TextField
                                                id="field-name"
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                type="text"
                                                value={valueName}
                                                onChange={(event) => handleOnChangeValueName(event)}
                                                placeholder="name..."
                                            />
                                        </Stack>
                                        <Stack direction={'row'} spacing={0}>
                                            <div className="div-h5">
                                                <h6>Description:</h6>
                                            </div>
                                            <Form.Control
                                                id="field-description"
                                                type="text"
                                                as="textarea"
                                                value={valueDescription}
                                                onChange={(event) => handleOnChangeValueDescription(event)}
                                                rows={2}
                                                placeholder="..."
                                            />
                                        </Stack>
                                    </Stack>
                                </Item>
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default Account;
