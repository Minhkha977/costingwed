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
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import { ApiReopenPeriod } from '~/components/Api/OpenAccountingPeriod';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
function OpenAccountingPeriod({ title }) {
    const access_token = useSelector((state) => state.FetchApi.token);
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const [dateReopenPeriod, setDateReopenPeriod] = React.useState(null);

    const handleChangeReopenPeriod = (e) => {
        setDateReopenPeriod(e);
    };
    const valueUser = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : '';
    const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
    const [callApiReopen, setCallApiReopen] = React.useState(false);
    const agreeDialogr = () => {
        setDialogIsOpen(false);
        setCallApiReopen(!callApiReopen);
    };
    const closeDialog = () => {
        setDialogIsOpen(false);
        toast.warning(' Cancel create new!');
    };
    useEffect(() => {
        const fetchApiReopen = async () => {
            if (dateReopenPeriod) {
                const statusCode = await ApiReopenPeriod(access_token);
                if (statusCode) {
                    dataPeriod_From_Redux = dateReopenPeriod;
                    setDateReopenPeriod(null);
                }
            }
        };
        fetchApiReopen();
    }, [callApiReopen]);
    const handleReopenPeriod = () => {
        if (dateReopenPeriod) {
            setDialogIsOpen(true);
        } else {
            toast.warning(' Please select a reopening month!');
        }
    };
    return (
        <div className="main">
            <ToastContainer />
            <AlertDialog
                title={'Open next period?'}
                content={
                    <>
                        Closed until period: {dayjs(dataPeriod_From_Redux).format('MM - YYYY')}
                        <br /> Reopen the accounting period: {dayjs(dateReopenPeriod).format('MM - YYYY')}
                        <br /> User: {valueUser}
                    </>
                }
                onOpen={dialogIsOpen}
                onClose={closeDialog}
                onAgree={agreeDialogr}
            />
            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
            </div>
            <Box sx={{ width: '100%', typography: 'body' }}>
                <Grid container spacing={1}>
                    <Grid xs={12} md={12}>
                        <Item>
                            <Grid container spacing={2}>
                                <Grid xs={5} md={6}>
                                    <Stack sx={{ height: '100%' }} alignItems={'flex-end'} justifyContent={'center'}>
                                        <h6>Closed until period:</h6>
                                    </Stack>
                                </Grid>
                                <Grid xs={7} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                                        <DemoContainer components={['DatePicker']} sx={{ paddingTop: 0 }}>
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
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid xs={5} md={6}>
                                    <Stack sx={{ height: '100%' }} alignItems={'flex-end'} justifyContent={'center'}>
                                        <h6>Reopen the accounting period:</h6>
                                    </Stack>
                                </Grid>
                                <Grid xs={7} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                                        <DemoContainer components={['DatePicker']} sx={{ paddingTop: 0 }}>
                                            <DatePicker
                                                // label={'"month" and "year"'}
                                                views={['month', 'year']}
                                                value={dateReopenPeriod}
                                                // sx={{ width: 300 }}
                                                slotProps={{
                                                    textField: { size: 'small' },
                                                }}
                                                formatDensity="spacious"
                                                format="MM/YYYY"
                                                onChange={(e) => handleChangeReopenPeriod(e)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid xs={5} md={6}>
                                    <Stack sx={{ height: '100%' }} alignItems={'flex-end'} justifyContent={'center'}>
                                        <h6>User:</h6>
                                    </Stack>
                                </Grid>
                                <Grid xs={7} md={6}>
                                    <Stack alignItems={'flex-start'}>
                                        <TextField variant="outlined" size="small" value={valueUser} disabled />
                                    </Stack>
                                </Grid>

                                <Grid xs={12} md={12}>
                                    <Stack justifyContent={'center'} alignItems={'center'}>
                                        <LoadingButton
                                            // loading={isLoading}
                                            loadingPosition="start"
                                            variant="contained"
                                            color="warning"
                                            startIcon={<LockOpenIcon />}
                                            onClick={handleReopenPeriod}
                                        >
                                            Reopen period
                                        </LoadingButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default OpenAccountingPeriod;
