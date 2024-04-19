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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import LockIcon from '@mui/icons-material/Lock';
import LoadingButton from '@mui/lab/LoadingButton';
import LoopIcon from '@mui/icons-material/Loop';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPeriod } from '~/Redux/FetchApi/fetchApiMaster';
import { ApiOpenPeriod } from '~/components/Api/OpenAccountingPeriod';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import { Spin } from 'antd';

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
function CloseAccountingPeriod({ title }) {
    var dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(false);
    const access_token = useSelector((state) => state.FetchApi.token);
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const unitcode = useSelector((state) => state.Actions.unitcode);
    const [valueNextPeriod, setValueNextPeriod] = React.useState(dayjs(dataPeriod_From_Redux).add(1, 'month'));
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

    //todo: reload next month
    useEffect(() => {
        setValueNextPeriod(dayjs(dataPeriod_From_Redux).add(1, 'month'));
    }, [dataPeriod_From_Redux]);
    console.log(dataPeriod_From_Redux);
    const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
    const [callApiOpen, setCallApiOpen] = React.useState(false);
    const agreeDialogr = () => {
        setDialogIsOpen(false);
        setCallApiOpen(true);
    };
    const closeDialog = () => {
        setDialogIsOpen(false);
        toast.warning(' Cancel open next period!');
    };

    //todo: call api open period
    useEffect(() => {
        const fetchApiOpen = async () => {
            if (callApiOpen) {
                setIsLoading(true);
                const statusCode = await ApiOpenPeriod(access_token);
                if (statusCode) {
                    dispatch(fetchPeriod(unitcode));
                }
                setIsLoading(false);
            }
            setCallApiOpen(false);
        };
        fetchApiOpen();
    }, [callApiOpen]);
    const handleOpenPeriod = () => {
        setDialogIsOpen(true);
    };
    return (
        <Spin size="large" tip="Loading" spinning={isLoading} style={{ maxHeight: 'fit-content' }}>
            <div className="main">
                <ToastContainer />
                {dialogIsOpen && (
                    <AlertDialog
                        title={'Open next period?'}
                        content={
                            <>
                                Open next period:{' '}
                                {dayjs(dataPeriod_From_Redux).add(1, 'month').utc(true).format('MM - YYYY')}
                            </>
                        }
                        onOpen={dialogIsOpen}
                        onClose={closeDialog}
                        onAgree={agreeDialogr}
                    />
                )}
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/material-ui/getting-started/installation/"
                        ></Link>
                        <Typography color="text.primary">{title}</Typography>
                    </Breadcrumbs>
                </div>
                <Box sx={{ width: '100%', typography: 'body' }}>
                    <Grid container spacing={1}>
                        <Grid xs={12} md={12}>
                            <Item>
                                <Grid container spacing={1}>
                                    <Grid xs={12} md={6}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '50%' }}>Closed until period:</h6>
                                            <div style={{ width: '100%' }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                                                    <DatePicker
                                                        // label={'"month" and "year"'}
                                                        views={['month', 'year']}
                                                        value={dayjs(dataPeriod_From_Redux)}
                                                        // sx={{ width: 300 }}
                                                        slotProps={{
                                                            textField: { size: 'small' },
                                                        }}
                                                        formatDensity="spacious"
                                                        format="MM - YYYY"
                                                        disabled
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '50%' }}>New closing period:</h6>
                                            <div>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        // label={'"month" and "year"'}
                                                        views={['month', 'year']}
                                                        value={valueNextPeriod}
                                                        // sx={{ width: 300 }}
                                                        slotProps={{
                                                            textField: { size: 'small' },
                                                        }}
                                                        formatDensity="spacious"
                                                        format="MM/YYYY"
                                                        disabled
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                            <LoadingButton
                                                // loading
                                                variant="contained"
                                                color="primary"
                                                startIcon={<LockIcon />}
                                                onClick={handleOpenPeriod}
                                            >
                                                Clock
                                            </LoadingButton>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '50%' }}>Cost center:</h6>
                                            <FormControl
                                                sx={{
                                                    m: 1,
                                                    width: '60%',
                                                    // minWidth: 100,
                                                    // maxWidth: 200,
                                                }}
                                                size="small"
                                            >
                                                <Select
                                                    labelId="demo-simple-select-helper-label"
                                                    id="demo-simple-select-helper"
                                                    // value={age}
                                                    // label="Age"
                                                    displayEmpty
                                                    // onChange={handleChange}
                                                >
                                                    <MenuItem value={10}>Group 1</MenuItem>
                                                    <MenuItem value={20}>Group 2</MenuItem>
                                                    <MenuItem value={30}>Group 3</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <LoadingButton startIcon={<LoopIcon />} variant="contained" color="warning">
                                                Load
                                            </LoadingButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <Item>
                                <Stack spacing={0}>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            rows={data}
                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 5 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10, 15]}
                                            autoHeight
                                        />
                                    </div>
                                </Stack>
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
                                                    1. Expenses during the period
                                                </h5>
                                            </>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <Item></Item>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </Spin>
    );
}

export default CloseAccountingPeriod;
