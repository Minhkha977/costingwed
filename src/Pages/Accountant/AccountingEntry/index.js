import React from 'react';
import dayjs from 'dayjs';
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
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ApiToken from '~/Pages/Login/ApiToken';
import DomainApi from '~/DomainApi';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import { ApiListAccountGroup } from '~/Pages/Setting/AccountGroup/ApiAccountGroup';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
const singleSelect = ['CH NVT', 'SH BP'];
const columns = [
    { field: 'id', headerName: 'No.', width: 100 },
    {
        field: 'username',
        headerName: 'Document Code',
        width: 300,
        editable: true,
        type: 'singleSelect',
        valueOptions: singleSelect,
    },
    { field: 'name', headerName: 'Date Added', width: 300 },
    {
        field: 'phone',
        headerName: 'Content',
        // type: 'number',
        width: 300,
    },
    { field: 'email', headerName: 'Cost Center', width: 300 },
];
function AccountingEntry({ title }) {
    const access_token = ApiToken();

    const [isLoading, setIsLoading] = React.useState(false);
    const [valueSearchAccountingEntry, setValueSearchAccountingEntry] = React.useState('');
    const [reloadListAccountingEntryHeader, setReloadListAccountingEntryHeader] = React.useState(false);

    const handleOnChangeValueSearch = (event) => {
        setValueSearchAccountingEntry(event.target.value);
    };

    const [dataListAEHeader, setDataAEListHeader] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                let url = `journal/acc-entry/unitcode/${localStorage.getItem('Unit')}?username=${localStorage.getItem(
                    'UserName',
                )}&acc_period_month=${valueDateAccountPeriod.month()}&acc_period_year=${valueDateAccountPeriod.year()}`;
                if (valueSearchAccountingEntry) {
                    url += `?doc_code=${valueSearchAccountingEntry}`;
                }
                setIsLoading(true);
                const response = await DomainApi.get(url);
                setDataAEListHeader(response.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
                toast.error(' Error api get data account entry list!');
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListAccountingEntryHeader]);

    const [valueAccountGroupAE, setValueAccountGroupAE] = useState('');
    const [valueAccountGroupMemo, setValueAccountGroupMemo] = useState('');
    const [dataListAccountGroup, setDataListAccountGroup] = useState([]);
    const handleChangeAccountGroupAE = (event) => {
        setValueAccountGroupAE(event.target.value);
    };
    const handleChangeAccountGroupMemo = (event) => {
        setValueAccountGroupMemo(event.target.value);
    };
    useEffect(() => {
        ApiListAccountGroup('', setDataListAccountGroup);
    }, []);
    const [valueTab, setValueTab] = React.useState('Manage Accounting Entries');

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    const [checked, setChecked] = React.useState(false);

    const handleChangeChecked = (event) => {
        setChecked(event.target.checked);
    };
    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    let newDate = new Date();
    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs(newDate));
    const handleOnChangeDateAccountPeriod = (event) => {
        setValueDateAccountPeriod(event.value.Date);
    };
    let number = 1234.56789;
    return (
        <div className="main">
            <ToastContainer />
            <AlertDialog
                title={'Create a new account?'}
                content={
                    <>
                        {/* Main Acc code: {valueCodeMain}
                        <br /> Sub Acc name: {valueCodeSub}
                        <br /> Account name: {valueName}
                        <br /> Description: {valueDescription} */}
                    </>
                }
                // onOpen={dialogIsOpenNew}
                // onClose={closeDialogNew}
                // onAgree={agreeDialogNew}
            />
            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                    <Typography color="text.primary">{valueTab}</Typography>
                </Breadcrumbs>
            </div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <Item>
                    <TabContext value={valueTab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList
                                onChange={handleChangeTab}
                                aria-label="lab API tabs example"
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: '#ed6c02',
                                    },
                                }}
                                textColor="inherit"
                                sx={{
                                    '.Mui-selected': {
                                        color: '#ed6c02',
                                        backgroundColor: '#f5e1d0',
                                    },
                                }}
                                variant="fullWidth"
                            >
                                <Tab label="Manage Accounting Entries" value="Manage Accounting Entries" />
                                <Tab label="Transfer Memo" value="Transfer Memo" />
                            </TabList>
                        </Box>
                        <TabPanel value="Manage Accounting Entries" sx={{ padding: 0 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container direction={'row'} spacing={1}>
                                    <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                        <Item>
                                            <Grid container xs={12} md={12} spacing={1}>
                                                <Grid xs={12} md={4}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>Accounting period:</h6>
                                                        <div style={{ width: '100%' }}>
                                                            <LocalizationProvider
                                                                dateAdapter={AdapterDayjs}
                                                                sx={{ width: '100%' }}
                                                            >
                                                                <DatePicker
                                                                    // label={'"month" and "year"'}
                                                                    views={['month', 'year']}
                                                                    // value={value}
                                                                    slotProps={{
                                                                        textField: { size: 'small' },
                                                                    }}
                                                                    onChange={(e) => handleOnChangeDateAccountPeriod(e)}
                                                                />
                                                            </LocalizationProvider>
                                                        </div>
                                                    </Stack>
                                                </Grid>

                                                <Grid xs={12} md={4}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>Account:</h6>
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="name..."
                                                        />
                                                    </Stack>
                                                </Grid>

                                                <Grid Item xs={12} md={4}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6 style={{ width: '40%' }}>Memo:</h6>
                                                        <FormControl
                                                            sx={{
                                                                m: 1,
                                                                width: '100%',
                                                                // minWidth: 100,
                                                                // maxWidth: 200,
                                                            }}
                                                            size="small"
                                                        >
                                                            <Select
                                                                labelId="demo-simple-select-helper-label"
                                                                id="demo-simple-select-helper"
                                                                value={age}
                                                                // label="Age"
                                                                displayEmpty
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value={10}>Group 1</MenuItem>
                                                                <MenuItem value={20}>Group 2</MenuItem>
                                                                <MenuItem value={30}>Group 3</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        <Button variant="contained" color="warning">
                                                            Load
                                                        </Button>
                                                    </Stack>
                                                </Grid>

                                                <Grid Item xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            fullWidth
                                                            label="Search"
                                                            size="small"
                                                            value={valueSearchAccountingEntry}
                                                            onChange={(event) => handleOnChangeValueSearch(event)}
                                                        />
                                                        <div>
                                                            <LoadingButton
                                                                startIcon={<SearchIcon />}
                                                                variant="contained"
                                                                color="warning"
                                                                onClick={() =>
                                                                    setReloadListAccountingEntryHeader(
                                                                        !reloadListAccountingEntryHeader,
                                                                    )
                                                                }
                                                            >
                                                                Search
                                                            </LoadingButton>
                                                        </div>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                        <Item>
                                            <Grid container>
                                                <Grid xs={12} md={12}>
                                                    <Stack
                                                        width={'100%'}
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                        height={50}
                                                    >
                                                        <>
                                                            <h5
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                }}
                                                            >
                                                                Accounting Entry List
                                                            </h5>
                                                        </>

                                                        <Button variant="contained" color="warning">
                                                            Import
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12}>
                                                    <Stack spacing={0}>
                                                        <div style={{ width: '100%' }}>
                                                            <DataGrid
                                                                rows={dataListAEHeader}
                                                                columns={columns}
                                                                initialState={{
                                                                    pagination: {
                                                                        paginationModel: { page: 0, pageSize: 3 },
                                                                    },
                                                                }}
                                                                pageSizeOptions={[3, 5, 10, 15]}
                                                                autoHeight
                                                            />
                                                        </div>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <Item>
                                            <Grid>
                                                <Grid xs={12} md={12}>
                                                    <Stack
                                                        width={'100%'}
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-end'}
                                                        height={50}
                                                    >
                                                        <>
                                                            <h5
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    textAlign: 'left',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                1. Accounting entry information
                                                            </h5>
                                                        </>

                                                        <Button variant="contained" color="warning">
                                                            New
                                                        </Button>
                                                        <Button variant="contained" color="warning">
                                                            Save
                                                        </Button>
                                                        <Button variant="contained" color="warning">
                                                            Delete
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                                    <Item>
                                                        <Grid container xs={12} md={12} spacing={1}>
                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Doc code:</h6>
                                                                    <TextField
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                    />
                                                                </Stack>
                                                            </Grid>

                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Docs date:</h6>
                                                                    <div style={{ width: '100%' }}>
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                            sx={{ width: '100%' }}
                                                                        >
                                                                            <DatePicker
                                                                                // label={'"month" and "year"'}
                                                                                // views={['month', 'year']}
                                                                                // value={value}
                                                                                // sx={{ width: 300 }}
                                                                                slotProps={{
                                                                                    textField: { size: 'small' },
                                                                                }}
                                                                                formatDensity="spacious"
                                                                                format="DD/MM/YYYY"
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </div>
                                                                </Stack>
                                                            </Grid>

                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>User:</h6>
                                                                    <TextField
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                    />
                                                                </Stack>
                                                            </Grid>

                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Date:</h6>
                                                                    <div style={{ width: '100%' }}>
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                            sx={{ width: '100%' }}
                                                                        >
                                                                            <DatePicker
                                                                                // label={'"month" and "year"'}
                                                                                // views={['month', 'year']}
                                                                                // value={value}
                                                                                // sx={{ width: 300 }}
                                                                                slotProps={{
                                                                                    textField: { size: 'small' },
                                                                                }}
                                                                                formatDensity="spacious"
                                                                                format="DD/MM/YYYY"
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </div>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Description:</h6>
                                                                    <Form.Control
                                                                        type="text"
                                                                        as="textarea"
                                                                        rows={3}
                                                                        placeholder="..."
                                                                    />
                                                                    {/* <TextField
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                    /> */}
                                                                </Stack>
                                                            </Grid>
                                                            <Grid Item xs={12} md={6}>
                                                                <Stack spacing={1}>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Account group:</h6>
                                                                        <FormControl
                                                                            sx={{
                                                                                m: 1,
                                                                                width: '100%',
                                                                                // minWidth: 100,
                                                                                // maxWidth: 200,
                                                                            }}
                                                                            size="small"
                                                                        >
                                                                            <Select
                                                                                labelId="demo-simple-select-helper-label"
                                                                                id="select-AE"
                                                                                value={valueAccountGroupAE}
                                                                                // label="Age"
                                                                                displayEmpty
                                                                                onChange={handleChangeAccountGroupAE}
                                                                            >
                                                                                {dataListAccountGroup.map((data) => {
                                                                                    return (
                                                                                        <MenuItem
                                                                                            key={data.gr_acc_code}
                                                                                            value={data.gr_acc_code}
                                                                                        >
                                                                                            {data.gr_acc_name}
                                                                                        </MenuItem>
                                                                                    );
                                                                                })}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Stack>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Currency:</h6>
                                                                        <FormControl
                                                                            sx={{
                                                                                m: 1,
                                                                                width: '100%',
                                                                                // minWidth: 100,
                                                                                // maxWidth: 200,
                                                                            }}
                                                                            size="small"
                                                                        >
                                                                            <Select
                                                                                labelId="demo-simple-select-helper-label"
                                                                                id="demo-simple-select-helper"
                                                                                value={age}
                                                                                // label="Age"
                                                                                displayEmpty
                                                                                onChange={handleChange}
                                                                            >
                                                                                <MenuItem value={10}>Group 1</MenuItem>
                                                                                <MenuItem value={20}>Group 2</MenuItem>
                                                                                <MenuItem value={30}>Group 3</MenuItem>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Stack>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid Item xs={12} md={6}>
                                                                <Stack spacing={1}>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Total debt:</h6>
                                                                        <h6
                                                                            style={{
                                                                                width: '100%',
                                                                                textAlign: 'left',
                                                                                color: 'red',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            {number.toLocaleString(undefined, {
                                                                                maximumFractionDigits: 2,
                                                                            })}
                                                                        </h6>
                                                                    </Stack>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>
                                                                            Total available:
                                                                        </h6>
                                                                        <h6
                                                                            style={{
                                                                                width: '100%',
                                                                                textAlign: 'left',
                                                                                color: 'green',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            {number.toLocaleString(undefined, {
                                                                                maximumFractionDigits: 2,
                                                                            })}
                                                                        </h6>
                                                                    </Stack>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Item>
                                                </Grid>
                                            </Grid>
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <Item>
                                            <Grid>
                                                <Grid xs={12} md={12}>
                                                    <Stack
                                                        width={'100%'}
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-end'}
                                                        height={50}
                                                    >
                                                        <>
                                                            <h5
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    textAlign: 'left',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                2. Detail
                                                            </h5>
                                                        </>

                                                        <Button variant="contained" color="warning">
                                                            New
                                                        </Button>
                                                        <Button variant="contained" color="warning">
                                                            Update
                                                        </Button>
                                                        <Button variant="contained" color="warning">
                                                            Delete
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                                    <Item>
                                                        <Stack spacing={0}>
                                                            <div style={{ width: '100%' }}>
                                                                <DataGrid
                                                                    rows={data}
                                                                    columns={columns}
                                                                    initialState={{
                                                                        pagination: {
                                                                            paginationModel: { page: 0, pageSize: 3 },
                                                                        },
                                                                    }}
                                                                    pageSizeOptions={[3, 5, 10, 15]}
                                                                    autoHeight
                                                                />
                                                            </div>
                                                        </Stack>
                                                    </Item>
                                                </Grid>
                                            </Grid>
                                        </Item>
                                    </Grid>
                                </Grid>
                            </Box>
                        </TabPanel>
                        <TabPanel value="Transfer Memo" sx={{ padding: 0 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container direction={'row'} spacing={1}>
                                    <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                        <Item>
                                            <Grid container xs={12} md={12}>
                                                <Grid Item xs={12} md={6}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6>Accounting period:</h6>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker
                                                                // label={'"month" and "year"'}
                                                                views={['month', 'year']}
                                                                // value={value}
                                                                sx={{ width: 100 }}
                                                                slotProps={{
                                                                    textField: { size: 'small' },
                                                                    paddingTop: 0,
                                                                }}
                                                            />
                                                        </LocalizationProvider>
                                                    </Stack>
                                                </Grid>
                                                <Grid Item xs={12} md={5}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-start'}
                                                    >
                                                        <h6>From memo:</h6>
                                                        <FormControl
                                                            sx={{
                                                                m: 1,
                                                                minWidth: 100,
                                                                maxWidth: 200,
                                                                height: 48,
                                                                paddingTop: 1,
                                                            }}
                                                            size="small"
                                                        >
                                                            <Select
                                                                labelId="demo-simple-select-helper-label"
                                                                id="demo-simple-select-helper"
                                                                value={age}
                                                                // label="Age"
                                                                displayEmpty
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value={10}>Group 1</MenuItem>
                                                                <MenuItem value={20}>Group 2</MenuItem>
                                                                <MenuItem value={30}>Group 3</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Stack>
                                                </Grid>
                                                <Grid Item xs={12} md={1}>
                                                    <Stack
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        // justifyContent={'flex-end'}
                                                        sx={{
                                                            height: 48,
                                                            display: { xs: 'flex', sm: 'flex' },
                                                            justifyContent: { xs: 'center', sm: 'flex-end' },
                                                        }}
                                                    >
                                                        <Button variant="contained" color="warning">
                                                            Load
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                        <Item>
                                            {' '}
                                            <Stack spacing={0}>
                                                <h5 style={{ textAlign: 'left', fontWeight: 'bold' }}>Memo List</h5>
                                                <div style={{ width: '100%' }}>
                                                    <DataGrid
                                                        rows={data}
                                                        columns={columns}
                                                        initialState={{
                                                            pagination: {
                                                                paginationModel: { page: 0, pageSize: 3 },
                                                            },
                                                        }}
                                                        pageSizeOptions={[3, 5, 10, 15]}
                                                        autoHeight
                                                    />
                                                </div>
                                            </Stack>
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <Item>
                                            <Grid container spacing={2}>
                                                <Grid xs={12} md={12}>
                                                    <Stack
                                                        width={'100%'}
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-end'}
                                                        height={50}
                                                    >
                                                        <>
                                                            <h5
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    textAlign: 'left',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                1. Memo Information
                                                            </h5>
                                                        </>

                                                        <Button variant="contained" color="warning">
                                                            Delete
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                                    <Item>
                                                        <Grid container xs={12} md={12} spacing={1}>
                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Doc code:</h6>
                                                                    <TextField
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                    />
                                                                </Stack>
                                                            </Grid>

                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Docs date:</h6>
                                                                    <div style={{ width: '100%' }}>
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                            sx={{ width: '100%' }}
                                                                        >
                                                                            <DatePicker
                                                                                // label={'"month" and "year"'}
                                                                                views={['month', 'year']}
                                                                                // value={value}
                                                                                // sx={{ width: 300 }}
                                                                                slotProps={{
                                                                                    textField: { size: 'small' },
                                                                                }}
                                                                                formatDensity="spacious"
                                                                                format="DD/MM/YYYY"
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </div>
                                                                </Stack>
                                                            </Grid>

                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>User:</h6>
                                                                    <TextField
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                    />
                                                                </Stack>
                                                            </Grid>

                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Date:</h6>
                                                                    <div style={{ width: '100%' }}>
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                            sx={{ width: '100%' }}
                                                                        >
                                                                            <DatePicker
                                                                                // label={'"month" and "year"'}
                                                                                views={['month', 'year']}
                                                                                // value={value}
                                                                                // sx={{ width: 300 }}
                                                                                slotProps={{
                                                                                    textField: { size: 'small' },
                                                                                }}
                                                                                formatDensity="spacious"
                                                                                format="DD/MM/YYYY"
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </div>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid Item xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Description:</h6>
                                                                    <Form.Control
                                                                        type="text"
                                                                        as="textarea"
                                                                        rows={3}
                                                                        placeholder="..."
                                                                    />
                                                                    {/* <TextField
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                    /> */}
                                                                </Stack>
                                                            </Grid>
                                                            <Grid Item xs={12} md={6}>
                                                                <Stack spacing={1}>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Account group:</h6>
                                                                        <FormControl
                                                                            sx={{
                                                                                m: 1,
                                                                                width: '100%',
                                                                                // minWidth: 100,
                                                                                // maxWidth: 200,
                                                                            }}
                                                                            size="small"
                                                                        >
                                                                            <Select
                                                                                labelId="demo-simple-select-helper-label"
                                                                                id="select-memo"
                                                                                value={valueAccountGroupMemo}
                                                                                displayEmpty
                                                                                onChange={handleChangeAccountGroupMemo}
                                                                            >
                                                                                {dataListAccountGroup.map((data) => {
                                                                                    return (
                                                                                        <MenuItem
                                                                                            key={data.gr_acc_code}
                                                                                            value={data.gr_acc_code}
                                                                                        >
                                                                                            {data.gr_acc_name}
                                                                                        </MenuItem>
                                                                                    );
                                                                                })}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Stack>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Currency:</h6>
                                                                        <FormControl
                                                                            sx={{
                                                                                m: 1,
                                                                                width: '100%',
                                                                                // minWidth: 100,
                                                                                // maxWidth: 200,
                                                                            }}
                                                                            size="small"
                                                                        >
                                                                            <Select
                                                                                labelId="demo-simple-select-helper-label"
                                                                                id="demo-simple-select-helper"
                                                                                value={age}
                                                                                // label="Age"
                                                                                displayEmpty
                                                                                onChange={handleChange}
                                                                            >
                                                                                <MenuItem value={10}>Group 1</MenuItem>
                                                                                <MenuItem value={20}>Group 2</MenuItem>
                                                                                <MenuItem value={30}>Group 3</MenuItem>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Stack>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid Item xs={12} md={6}>
                                                                <Stack spacing={1}>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Total debt:</h6>
                                                                        <h6
                                                                            style={{
                                                                                width: '100%',
                                                                                textAlign: 'left',
                                                                                color: 'red',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            {number.toLocaleString(undefined, {
                                                                                maximumFractionDigits: 2,
                                                                            })}
                                                                        </h6>
                                                                    </Stack>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>
                                                                            Total available:
                                                                        </h6>
                                                                        <h6
                                                                            style={{
                                                                                width: '100%',
                                                                                textAlign: 'left',
                                                                                color: 'green',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            {number.toLocaleString(undefined, {
                                                                                maximumFractionDigits: 2,
                                                                            })}
                                                                        </h6>
                                                                    </Stack>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Item>
                                                </Grid>
                                            </Grid>
                                        </Item>
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <Item>
                                            <Grid>
                                                <Grid xs={12} md={12}>
                                                    <Stack
                                                        width={'100%'}
                                                        direction={'row'}
                                                        spacing={2}
                                                        alignItems={'center'}
                                                        justifyContent={'flex-end'}
                                                        height={50}
                                                    >
                                                        <>
                                                            <h5
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    textAlign: 'left',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                2. Detail
                                                            </h5>
                                                        </>

                                                        {/* <Button variant="contained" color="warning">
                                                            New
                                                        </Button>
                                                        <Button variant="contained" color="warning">
                                                            Update
                                                        </Button>
                                                        <Button variant="contained" color="warning">
                                                            Delete
                                                        </Button> */}
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                                    <Item>
                                                        <Stack spacing={0}>
                                                            <div style={{ width: '100%' }}>
                                                                <DataGrid
                                                                    rows={data}
                                                                    columns={columns}
                                                                    initialState={{
                                                                        pagination: {
                                                                            paginationModel: { page: 0, pageSize: 3 },
                                                                        },
                                                                    }}
                                                                    pageSizeOptions={[3, 5, 10, 15]}
                                                                    autoHeight
                                                                />
                                                            </div>
                                                        </Stack>
                                                    </Item>
                                                </Grid>
                                            </Grid>
                                        </Item>
                                    </Grid>
                                </Grid>
                            </Box>
                        </TabPanel>
                    </TabContext>
                </Item>
            </Box>
        </div>
    );
}

export default AccountingEntry;
