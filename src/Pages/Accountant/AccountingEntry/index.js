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
import ApiToken from '~/components/Api/ApiToken';
import DomainApi from '~/DomainApi';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import { ApiListAccountGroup } from '~/Pages/Setting/AccountGroup/ApiAccountGroup';
import { ApiCurrency } from '~/components/Api/Master';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    ApiAccountEntryListDetail,
    ApiAccountEntryListHeader,
    ApiCreateAccountEntryDetail,
    ApiCreateAccountEntryHeader,
    ApiDeleteAccountEntryDetail,
    ApiDeleteAccountEntryHeader,
    ApiUpdateAccountEntryDetail,
    ApiUpdateAccountEntryHeader,
} from '~/components/Api/AccountingEntryApi';
import { type } from '@testing-library/user-event/dist/type';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
const singleSelect = [
    { code: 'BS067', name: 'CH NVT' },
    { code: 'BS009', name: 'SH BP' },
];
const columnsDataAeHeader = [
    {
        field: 'doc_code',
        headerName: 'Document Code',
        width: 150,
        // editable: true,
        // type: 'singleSelect',
        // valueOptions: singleSelect,
    },
    // {
    //     field: 'username',
    //     headerName: 'Document Code',
    //     width: 300,
    //     editable: true,
    //     type: 'singleSelect',
    //     valueOptions: singleSelect,
    // },
    {
        field: 'doc_date',
        headerName: 'Doc Date',
        width: 200,
        valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
    },
    {
        field: 'description',
        headerName: 'Description',
        // type: 'number',
        minWidth: 400,
        flex: 1,
    },
    { field: 'cost_center', headerName: 'Cost Center', width: 200 },
];
const columnsDataAeDetail = [
    {
        field: 'detail_ids',
        headerName: 'No.',
        width: 100,
        // editable: true,
        // type: 'singleSelect',
        // valueOptions: singleSelect,
    },
    {
        field: 'cost_center',
        headerName: 'Cost center',
        width: 150,
        editable: true,
        type: 'singleSelect',
        valueOptions: singleSelect,
    },
    {
        field: 'acc_code',
        headerName: 'Account code',
        width: 200,
        // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
    },
    {
        field: 'debit_amount',
        headerName: 'Debit',
        width: 150,
        // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
    },
    {
        field: 'credit_amount',
        headerName: 'Credit',
        width: 150,
        // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
    },
    {
        field: 'description',
        headerName: 'Description',
        // type: 'number',
        minWidth: 400,
        flex: 1,
    },
];

function AccountingEntry({ title }) {
    const access_token = ApiToken();

    const [isLoading, setIsLoading] = React.useState(false);
    const [valueSearchAccountingEntry, setValueSearchAccountingEntry] = React.useState('');
    const [reloadListAccountingEntryHeader, setReloadListAccountingEntryHeader] = React.useState(false);
    const handleOnChangeValueSearch = (event) => {
        setValueSearchAccountingEntry(event.target.value);
    };

    const [valueCodeAe, setValueCodeAe] = useState('');
    const [valueAccountCodeAe, setValueAccountCodeAe] = useState('');
    const [valueUserAe, setValueUserAe] = useState('');
    const [valueDescriptionAe, setValueDescriptionAe] = useState('');
    const [valueDocsDateAe, setValueDocsDateAe] = useState(dayjs());
    const [valueDateAe, setValueDateAe] = useState(dayjs());
    const [valueCostCenterAe, setValueCostCenterAe] = useState(dayjs());
    const [valueTotalDebitAe, setValueTotalDebitAe] = useState(0);
    const [valueTotalCreditAe, setValueTotalCreditAe] = useState(0);
    const [valueTotalDebitMemo, setValueTotalDebitMemo] = useState(0);
    const [valueTotalCreditMemo, setValueTotalCreditMemo] = useState(0);
    const handleChangeValueCodeAe = (event) => {
        setValueCodeAe(event.target.value);
    };
    const handleChangeValueUserAe = (event) => {
        setValueUserAe(event.target.value);
    };
    const handleChangeValueDescriptionAe = (event) => {
        setValueDescriptionAe(event.target.value);
    };
    const handleChangeValueDocsDateAe = (event) => {
        setValueDocsDateAe(event);
    };
    const handleChangeValueDateAe = (event) => {
        setValueDateAe(event);
    };

    const [dataListAEHeader, setDataAEListHeader] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        ApiAccountEntryListHeader(
            valueDateAccountPeriod.month() + 1,
            valueDateAccountPeriod.year(),
            valueSearchAccountingEntry,
            setDataAEListHeader,
        );
        setIsLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListAccountingEntryHeader]);
    const onHandleRowsSelectionAeHeader = (ids) => {
        const selectedRowsData = ids.map((id) => dataListAEHeader.find((row) => row.doc_code === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueCodeAe(key.doc_code);
                    setValueDocsDateAe(dayjs(key.doc_date));
                    setValueDescriptionAe(key.description);
                    setValueDateAccountPeriod(dayjs(key.updated_date));
                    setValueUserAe(key.updated_by);
                    setValueAccountGroupAE(key.grp_acc);
                    setValueCurrency(key.currency);
                    setValueTotalDebitAe(key.total_debit);
                    setValueTotalCreditAe(key.total_credit);
                });
                setReloadListAeDetail(!reloadListAeDetail);
            }
        }
    };

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

    const [dataListCurrency, setDataListCurrency] = React.useState([]);
    const [valueCurrency, setValueCurrency] = useState('VND');
    const handleChangeCurren = (event) => {
        setValueCurrency(event.target.value);
    };
    useEffect(() => {
        ApiCurrency(setDataListCurrency);
    }, []);

    const [dialogIsOpenNewAeHeader, setDialogIsOpenNewAeHeader] = React.useState(false);
    const [callApiNewAeHeader, setCallApiNewAeHeader] = React.useState(false);
    const agreeDialogNewAeHeader = () => {
        setDialogIsOpenNewAeHeader(false);
        setCallApiNewAeHeader(!callApiNewAeHeader);
    };
    const closeDialogNewAeHeader = () => {
        setDialogIsOpenNewAeHeader(false);
        toast.warning(' Cancel create new!');
    };
    const handleOnClickNewAeHeader = () => {
        if (!access_token || !valueDescriptionAe || !valueCurrency || !valueAccountGroupAE) {
            toast.error(' Desc, currency, account group is empty!');
            return;
        }
        setDialogIsOpenNewAeHeader(true);
    };
    const apiNewAeHeader = async () => {
        await ApiCreateAccountEntryHeader(access_token, valueDescriptionAe, valueCurrency, valueAccountGroupAE);
        setValueCodeAe('');
        setValueDocsDateAe(dayjs());
        setValueUserAe('');
        setValueDateAccountPeriod(dayjs());
        setValueDescriptionAe('');
        setValueAccountGroupAE('');
        setValueTotalDebitAe(0);
        setValueTotalCreditAe(0);
        setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
    };
    useEffect(() => {
        apiNewAeHeader();
    }, [callApiNewAeHeader]);

    const [dialogIsOpenUpdateAeHeader, setDialogIsOpenUpdateAeHeader] = React.useState(false);
    const [callApiUpdateAeHeader, setCallApiUpdateAeHeader] = React.useState(false);
    const agreeDialogUpdateAeHeader = async () => {
        setDialogIsOpenUpdateAeHeader(false);
        setCallApiUpdateAeHeader(!callApiUpdateAeHeader);
    };
    const closeDialogUpdateAeHeader = () => {
        setDialogIsOpenUpdateAeHeader(false);
        toast.warning(' Cancel create new!');
    };
    const handleOnClickUpdateAeHeader = () => {
        if (!access_token || !valueCodeAe || !valueDescriptionAe || !valueCurrency || !valueAccountGroupAE) {
            toast.error('Document no, desc, currency, account group is empty!');
            return;
        }
        setDialogIsOpenUpdateAeHeader(true);
    };
    const callApiUpdate = async () => {
        await ApiUpdateAccountEntryHeader(
            access_token,
            valueCodeAe,
            valueDescriptionAe,
            valueCurrency,
            valueAccountGroupAE,
        );
        setValueCodeAe('');
        setValueDocsDateAe(dayjs());
        setValueUserAe('');
        setValueDateAccountPeriod(dayjs());
        setValueDescriptionAe('');
        setValueAccountGroupAE('');
        setValueTotalDebitAe(0);
        setValueTotalCreditAe(0);
        setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
    };
    useEffect(() => {
        callApiUpdate();
    }, [callApiUpdateAeHeader]);

    const [dialogIsOpenDeleteAeHeader, setDialogIsOpenDeleteAeHeader] = React.useState(false);
    const [callApiDeleteAeHeader, setCallApiDeleteAeHeader] = React.useState(false);
    const agreeDialogDeleteAeHeader = async () => {
        setDialogIsOpenDeleteAeHeader(false);
        setCallApiDeleteAeHeader(!callApiDeleteAeHeader);
    };
    const closeDialogDeleteAeHeader = () => {
        setDialogIsOpenDeleteAeHeader(false);
        toast.warning(' Cancel deleted!');
    };
    const handleOnClickDeleteAeHeader = () => {
        if (!access_token || !valueCodeAe) {
            toast.error('Document no is empty!');
            return;
        }
        setDialogIsOpenDeleteAeHeader(true);
    };
    const apiDeleteAeHeader = async () => {
        await ApiDeleteAccountEntryHeader(access_token, valueCodeAe);
        setValueCodeAe('');
        setValueDocsDateAe(dayjs());
        setValueUserAe('');
        setValueDateAccountPeriod(dayjs());
        setValueDescriptionAe('');
        setValueAccountGroupAE('');
        setValueTotalDebitAe(0);
        setValueTotalCreditAe(0);
        setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
    };
    useEffect(() => {
        apiDeleteAeHeader();
    }, [callApiDeleteAeHeader]);

    const [valueDetailId, setValueDetailId] = useState('');
    const [valueAccountCodeAeDetail, setValueAccountCodeAeDetail] = useState('');
    const [valueDescriptionAeDetail, setValueDescriptionAeDetail] = useState('');
    const [valueDebitAeDetail, setValueDebitAeDetail] = useState(0);
    const [valueCreditAeDetail, setValueCreditAeDetail] = useState(0);

    const handleChangeValueAccountCodeAeDetail = (event) => {
        setValueAccountCodeAeDetail(event.target.value);
    };
    const handleChangeValueDescriptionAeDetail = (event) => {
        setValueDescriptionAeDetail(event.target.value);
    };
    const handleChangeValueCostcenter = (event) => {
        setValueCostCenterAe(event.target.value);
    };
    const handleChangeValueCreditDetailAe = (event) => {
        setValueCreditAeDetail(event.target.value);
    };
    const handleChangeValueDebitDetailAe = (event) => {
        setValueDebitAeDetail(event.target.value);
    };

    const [dataListAccountEntryDetail, setDataListAccountEntryDetail] = useState([]);
    const [reloadListAeDetail, setReloadListAeDetail] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        if (valueCodeAe) {
            ApiAccountEntryListDetail(valueCodeAe, valueSearchAccountingEntry, setDataListAccountEntryDetail);
        }
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListAeDetail]);

    const [dialogIsOpenNewAeDetail, setDialogIsOpenNewAeDetail] = React.useState(false);
    const [callApiNewAeDetail, setCallApiNewAeDetail] = React.useState(false);
    const agreeDialogNewAeDetail = () => {
        setDialogIsOpenNewAeDetail(false);
        setCallApiNewAeDetail(!callApiNewAeDetail);
    };
    const closeDialogNewAeDetail = () => {
        setDialogIsOpenNewAeDetail(false);
        toast.warning(' Cancel create new!');
    };
    const handleOnClickNewAeDetail = () => {
        if (valueCodeAe) {
            setDialogIsOpenNewAeDetail(true);
        } else {
            toast.error(' Empty document no, cost center,account group!');
        }
    };

    const onHandleRowsSelectionAeDetail = (ids) => {
        const selectedRowsData = ids.map((id) => dataListAccountEntryDetail.find((row) => row.detail_ids === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueCodeAe(key.doc_code);
                    setValueAccountCodeAeDetail(key.acc_code);
                    setValueDescriptionAeDetail(key.description);
                    setValueCostCenterAe(key.cost_center);
                    setValueDebitAeDetail(key.debit_amount);
                    setValueCreditAeDetail(key.credit_amount);
                    setValueDetailId(key.detail_ids);
                });
                setReloadListAeDetail(!reloadListAeDetail);
            }
        }
    };

    const apiNewAeDetail = async () => {
        await ApiCreateAccountEntryDetail(
            access_token,
            valueCodeAe,
            valueAccountCodeAeDetail,
            valueDescriptionAeDetail,
            valueCostCenterAe,
            valueCreditAeDetail,
            valueDebitAeDetail,
        );
        setValueAccountCodeAeDetail('');
        setValueDescriptionAeDetail('');
        setValueCostCenterAe('');
        setValueCreditAeDetail(0);
        setValueDebitAeDetail(0);
        setReloadListAeDetail(!reloadListAeDetail);
    };
    useEffect(() => {
        if (valueCodeAe) {
            apiNewAeDetail();
        }
    }, [callApiNewAeDetail]);

    const [dialogIsOpenUpdateAeDetail, setDialogIsOpenUpdateAeDetail] = React.useState(false);
    const [callApiUpdateAeDetail, setCallApiUpdateAeDetail] = React.useState(false);
    const agreeDialogUpdateAeDetail = async () => {
        setDialogIsOpenUpdateAeDetail(false);
        setCallApiUpdateAeDetail(!callApiUpdateAeDetail);
    };
    const closeDialogUpdateAeDetail = () => {
        setDialogIsOpenUpdateAeDetail(false);
        toast.warning(' Cancel update!');
    };
    const handleOnClickUpdateAeDetail = () => {
        if (!access_token || !valueAccountCodeAeDetail || !valueCodeAe) {
            toast.error('Empty document no, account code!');
            return;
        }
        setDialogIsOpenUpdateAeDetail(true);
    };
    const apiUpdateAeDetail = async () => {
        await ApiUpdateAccountEntryDetail(
            access_token,
            valueCodeAe,
            valueDetailId,
            valueAccountCodeAeDetail,
            valueDescriptionAeDetail,
            valueCostCenterAe,
            valueCreditAeDetail,
            valueDebitAeDetail,
        );
        // setValueCodeAe('');
        setValueAccountCodeAeDetail('');
        setValueDescriptionAeDetail('');
        setValueCostCenterAe('');
        setValueCreditAeDetail(0);
        setValueDebitAeDetail(0);
        setReloadListAeDetail(!reloadListAeDetail);
    };
    useEffect(() => {
        if (valueCodeAe && valueAccountCodeAeDetail) {
            apiUpdateAeDetail();
        }
    }, [callApiUpdateAeDetail]);

    const [dialogIsOpenDeleteAeDetail, setDialogIsOpenDeleteAeDetail] = React.useState(false);
    const [callApiDeleteAeDetail, setCallApiDeleteAeDetail] = React.useState(false);
    const agreeDialogDeleteAeDetail = async () => {
        setDialogIsOpenDeleteAeDetail(false);
        setCallApiDeleteAeDetail(!callApiDeleteAeDetail);
    };
    const closeDialogDeleteAeDetail = () => {
        setDialogIsOpenDeleteAeDetail(false);
        toast.warning(' Cancel deleted!');
    };
    const handleOnClickDeleteAeDetail = () => {
        if (!access_token || !valueCodeAe) {
            toast.error('Document no is empty!');
            return;
        }
        setDialogIsOpenDeleteAeDetail(true);
    };
    const apiDeleteAeDetail = async () => {
        await ApiDeleteAccountEntryDetail(access_token, valueCodeAe, valueDetailId);
        setValueAccountCodeAeDetail('');
        setValueDescriptionAeDetail('');
        setValueCostCenterAe('');
        setValueCreditAeDetail(0);
        setValueDebitAeDetail(0);
        setReloadListAeDetail(!reloadListAeDetail);
    };
    useEffect(() => {
        if (valueCodeAe && valueDetailId) {
            apiDeleteAeDetail();
        }
    }, [callApiDeleteAeDetail]);

    const [valueTab, setValueTab] = React.useState('Manage Accounting Entries');

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs());
    const handleOnChangeDateAccountPeriod = (event) => {
        setValueDateAccountPeriod(event);
    };
    return (
        <div className="main">
            <ToastContainer />
            <AlertDialog
                title={'Create a new accounting entry header?'}
                content={
                    <>
                        Description: {valueDescriptionAe}
                        <br /> Currency: {valueCurrency}
                        <br /> Account group: {valueAccountGroupAE}
                    </>
                }
                onOpen={dialogIsOpenNewAeHeader}
                onClose={closeDialogNewAeHeader}
                onAgree={agreeDialogNewAeHeader}
            />
            <AlertDialog
                title={'Update accounting entry header?'}
                content={
                    <>
                        Document no: {valueCodeAe}
                        <br /> Description: {valueDescriptionAe}
                        <br /> Currency: {valueCurrency}
                        <br /> Account group: {valueAccountGroupAE}
                    </>
                }
                onOpen={dialogIsOpenUpdateAeHeader}
                onClose={closeDialogUpdateAeHeader}
                onAgree={agreeDialogUpdateAeHeader}
            />
            <AlertDialog
                title={'Delete accounting entry header?'}
                content={
                    <>
                        Document no: {valueCodeAe}
                        <br /> Description: {valueDescriptionAe}
                        <br /> Currency: {valueCurrency}
                        <br /> Account group: {valueAccountGroupAE}
                    </>
                }
                onOpen={dialogIsOpenDeleteAeHeader}
                onClose={closeDialogDeleteAeHeader}
                onAgree={agreeDialogDeleteAeHeader}
            />
            <AlertDialog
                title={'New accounting entry detail?'}
                content={
                    <>
                        Document No: {valueCodeAe}
                        <br /> Account code: {valueAccountCodeAeDetail}
                        <br /> Description: {valueDescriptionAeDetail}
                        <br /> Cost center: {valueCostCenterAe}
                        <br /> Debit: {valueDebitAeDetail}
                        <br /> Credit: {valueCreditAeDetail}
                    </>
                }
                onOpen={dialogIsOpenNewAeDetail}
                onClose={closeDialogNewAeDetail}
                onAgree={agreeDialogNewAeDetail}
            />
            <AlertDialog
                title={'Update accounting entry detail?'}
                content={
                    <>
                        Document No: {valueCodeAe}
                        <br /> Detail id: {valueDetailId}
                        <br /> Account code: {valueAccountCodeAeDetail}
                        <br /> Description: {valueDescriptionAeDetail}
                    </>
                }
                onOpen={dialogIsOpenUpdateAeDetail}
                onClose={closeDialogUpdateAeDetail}
                onAgree={agreeDialogUpdateAeDetail}
            />
            <AlertDialog
                title={'Delete accounting entry detail?'}
                content={
                    <>
                        Document No: {valueCodeAe}
                        <br /> Detail id: {valueDetailId}
                        <br /> Account code: {valueAccountCodeAeDetail}
                        <br /> Description: {valueDescriptionAeDetail}
                    </>
                }
                onOpen={dialogIsOpenDeleteAeDetail}
                onClose={closeDialogDeleteAeDetail}
                onAgree={agreeDialogDeleteAeDetail}
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
                                                                    value={valueDateAccountPeriod}
                                                                    slotProps={{
                                                                        textField: { size: 'small' },
                                                                    }}
                                                                    formatDensity="spacious"
                                                                    format="MM/YYYY"
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

                                                <Grid xs={12} md={4}>
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
                                                        <div>
                                                            <LoadingButton
                                                                startIcon={<YoutubeSearchedForIcon />}
                                                                variant="contained"
                                                                color="warning"
                                                            >
                                                                Load
                                                            </LoadingButton>
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

                                                        <LoadingButton
                                                            startIcon={<PostAddIcon />}
                                                            variant="contained"
                                                            color="primary"
                                                        >
                                                            Import
                                                        </LoadingButton>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12}>
                                                    <Stack spacing={0}>
                                                        <div style={{ width: '100%' }}>
                                                            <DataGrid
                                                                rows={dataListAEHeader}
                                                                columns={columnsDataAeHeader}
                                                                initialState={{
                                                                    pagination: {
                                                                        paginationModel: { page: 0, pageSize: 3 },
                                                                    },
                                                                }}
                                                                pageSizeOptions={[3, 5, 10, 15]}
                                                                autoHeight
                                                                getRowId={(id) => id.doc_code}
                                                                loading={isLoading}
                                                                onRowSelectionModelChange={(ids) =>
                                                                    onHandleRowsSelectionAeHeader(ids)
                                                                }
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
                                                        <h5
                                                            style={{
                                                                fontWeight: 'bold',
                                                                textAlign: 'left',
                                                                width: '100%',
                                                            }}
                                                        >
                                                            1. Accounting entry information
                                                        </h5>

                                                        <Stack direction={'row'} spacing={1}>
                                                            <LoadingButton
                                                                startIcon={<AddBoxIcon />}
                                                                variant="contained"
                                                                color="success"
                                                                onClick={handleOnClickNewAeHeader}
                                                            >
                                                                New
                                                            </LoadingButton>
                                                            <LoadingButton
                                                                startIcon={<SystemUpdateAltIcon />}
                                                                variant="contained"
                                                                color="warning"
                                                                onClick={handleOnClickUpdateAeHeader}
                                                            >
                                                                Update
                                                            </LoadingButton>
                                                            <LoadingButton
                                                                startIcon={<DeleteOutlineIcon />}
                                                                variant="contained"
                                                                color="error"
                                                                onClick={handleOnClickDeleteAeHeader}
                                                            >
                                                                Delete
                                                            </LoadingButton>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                                    <Item>
                                                        <Grid container xs={12} md={12} spacing={1}>
                                                            <Grid xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Document no:</h6>
                                                                    <TextField
                                                                        id="text-doccode"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                        value={valueCodeAe}
                                                                        onChange={handleChangeValueCodeAe}
                                                                    />
                                                                </Stack>
                                                            </Grid>

                                                            <Grid xs={12} md={6}>
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
                                                                                value={valueDocsDateAe}
                                                                                // sx={{ width: 300 }}
                                                                                slotProps={{
                                                                                    textField: { size: 'small' },
                                                                                }}
                                                                                formatDensity="spacious"
                                                                                format="DD/MM/YYYY"
                                                                                onChange={(e) =>
                                                                                    handleChangeValueDocsDateAe(e)
                                                                                }
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
                                                                    <h6 style={{ width: '40%' }}>User:</h6>
                                                                    <TextField
                                                                        id="text-user"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                        value={valueUserAe}
                                                                        onChange={handleChangeValueUserAe}
                                                                    />
                                                                </Stack>
                                                            </Grid>

                                                            <Grid xs={12} md={6}>
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
                                                                                value={valueDateAe}
                                                                                // sx={{ width: 300 }}
                                                                                slotProps={{
                                                                                    textField: { size: 'small' },
                                                                                }}
                                                                                formatDensity="spacious"
                                                                                format="DD/MM/YYYY"
                                                                                onChange={(e) =>
                                                                                    handleChangeValueDateAe(e)
                                                                                }
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
                                                                    <h6 style={{ width: '40%' }}>Description:</h6>
                                                                    <Form.Control
                                                                        id="text-desc"
                                                                        type="text"
                                                                        as="textarea"
                                                                        rows={3}
                                                                        placeholder="..."
                                                                        value={valueDescriptionAe}
                                                                        onChange={handleChangeValueDescriptionAe}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid xs={12} md={6}>
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
                                                                                displayEmpty
                                                                                onChange={handleChangeAccountGroupAE}
                                                                            >
                                                                                {dataListAccountGroup.map((data) => {
                                                                                    return (
                                                                                        <MenuItem
                                                                                            key={data.gr_acc_code}
                                                                                            value={data.gr_acc_code}
                                                                                        >
                                                                                            {data.gr_acc_code} -{' '}
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
                                                                                id="currency-ae"
                                                                                value={valueCurrency}
                                                                                // label="Age"
                                                                                displayEmpty
                                                                                onChange={handleChangeCurren}
                                                                            >
                                                                                {dataListCurrency.map((data) => {
                                                                                    return (
                                                                                        <MenuItem
                                                                                            key={data.code}
                                                                                            value={data.code}
                                                                                        >
                                                                                            {data.name}
                                                                                        </MenuItem>
                                                                                    );
                                                                                })}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Stack>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid xs={12} md={6}>
                                                                <Stack spacing={1}>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Total debit:</h6>
                                                                        <h6
                                                                            style={{
                                                                                width: '100%',
                                                                                textAlign: 'left',
                                                                                color: 'red',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            {valueTotalDebitAe.toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2,
                                                                                },
                                                                            )}
                                                                        </h6>
                                                                    </Stack>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Total credit:</h6>
                                                                        <h6
                                                                            style={{
                                                                                width: '100%',
                                                                                textAlign: 'left',
                                                                                color: 'green',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            {valueTotalCreditAe.toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2,
                                                                                },
                                                                            )}
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

                                                        <Stack direction={'row'} spacing={1}>
                                                            <LoadingButton
                                                                startIcon={<AddBoxIcon />}
                                                                variant="contained"
                                                                color="success"
                                                                onClick={handleOnClickNewAeDetail}
                                                            >
                                                                New
                                                            </LoadingButton>
                                                            <LoadingButton
                                                                startIcon={<SystemUpdateAltIcon />}
                                                                variant="contained"
                                                                color="warning"
                                                                onClick={handleOnClickUpdateAeDetail}
                                                            >
                                                                Update
                                                            </LoadingButton>
                                                            <LoadingButton
                                                                startIcon={<DeleteOutlineIcon />}
                                                                variant="contained"
                                                                color="error"
                                                                onClick={handleOnClickDeleteAeDetail}
                                                            >
                                                                Delete
                                                            </LoadingButton>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                                    <Item>
                                                        <Stack spacing={0}>
                                                            <div style={{ width: '100%' }}>
                                                                <DataGrid
                                                                    rows={dataListAccountEntryDetail}
                                                                    columns={columnsDataAeDetail}
                                                                    initialState={{
                                                                        pagination: {
                                                                            paginationModel: { page: 0, pageSize: 3 },
                                                                        },
                                                                    }}
                                                                    pageSizeOptions={[3, 5, 10, 15]}
                                                                    autoHeight
                                                                    getRowId={(id) => id.detail_ids}
                                                                    loading={isLoading}
                                                                    onRowSelectionModelChange={(ids) =>
                                                                        onHandleRowsSelectionAeDetail(ids)
                                                                    }
                                                                />
                                                            </div>
                                                        </Stack>
                                                    </Item>
                                                </Grid>
                                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                                    <Item>
                                                        <Grid container xs={12} md={12} spacing={1}>
                                                            <Grid xs={12} md={6}>
                                                                <Stack spacing={1}>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Document no:</h6>
                                                                        <h6
                                                                            style={{ width: '100%', textAlign: 'left' }}
                                                                        >
                                                                            {valueCodeAe}
                                                                        </h6>
                                                                    </Stack>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Account code:</h6>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            size="small"
                                                                            placeholder="name..."
                                                                            value={valueAccountCodeAeDetail}
                                                                            onChange={
                                                                                handleChangeValueAccountCodeAeDetail
                                                                            }
                                                                        />
                                                                    </Stack>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Cost center:</h6>
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
                                                                                value={valueCostCenterAe}
                                                                                displayEmpty
                                                                                onChange={handleChangeValueCostcenter}
                                                                            >
                                                                                {singleSelect.map((data) => {
                                                                                    return (
                                                                                        <MenuItem
                                                                                            key={data.name}
                                                                                            value={data.code}
                                                                                        >
                                                                                            {data.name}
                                                                                        </MenuItem>
                                                                                    );
                                                                                })}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Stack>
                                                                </Stack>
                                                            </Grid>

                                                            <Grid xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Description:</h6>
                                                                    <Form.Control
                                                                        id="text-desc"
                                                                        type="text"
                                                                        as="textarea"
                                                                        rows={3}
                                                                        placeholder="..."
                                                                        value={valueDescriptionAeDetail}
                                                                        onChange={handleChangeValueDescriptionAeDetail}
                                                                    />
                                                                </Stack>
                                                            </Grid>

                                                            <Grid xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Debit:</h6>

                                                                    <TextField
                                                                        variant="outlined"
                                                                        type="number"
                                                                        fullWidth
                                                                        size="small"
                                                                        sx={{ input: { color: 'red' } }}
                                                                        value={valueDebitAeDetail}
                                                                        onChange={handleChangeValueDebitDetailAe}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Credit:</h6>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        type="number"
                                                                        fullWidth
                                                                        size="small"
                                                                        sx={{ input: { color: 'green' } }}
                                                                        value={valueCreditAeDetail}
                                                                        onChange={handleChangeValueCreditDetailAe}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
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
                                                <Grid xs={12} md={6}>
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
                                                <Grid xs={12} md={5}>
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
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={1}>
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
                                                    {/* <DataGrid
                                                        // rows={data}
                                                        columns={columns}
                                                        initialState={{
                                                            pagination: {
                                                                paginationModel: { page: 0, pageSize: 3 },
                                                            },
                                                        }}
                                                        pageSizeOptions={[3, 5, 10, 15]}
                                                        autoHeight
                                                    /> */}
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
                                                            <Grid xs={12} md={6}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'flex-start'}
                                                                >
                                                                    <h6 style={{ width: '40%' }}>Document no:</h6>
                                                                    <TextField
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                    />
                                                                </Stack>
                                                            </Grid>

                                                            <Grid xs={12} md={6}>
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

                                                            <Grid xs={12} md={6}>
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

                                                            <Grid xs={12} md={6}>
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
                                                            <Grid xs={12} md={6}>
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
                                                            <Grid xs={12} md={6}>
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
                                                                                id="currency-memo"
                                                                                value={valueCurrency}
                                                                                // label="Age"
                                                                                displayEmpty
                                                                                onChange={handleChangeCurren}
                                                                            >
                                                                                {dataListCurrency.map((data) => {
                                                                                    return (
                                                                                        <MenuItem
                                                                                            key={data.code}
                                                                                            value={data.code}
                                                                                        >
                                                                                            {data.name}
                                                                                        </MenuItem>
                                                                                    );
                                                                                })}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Stack>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid xs={12} md={6}>
                                                                <Stack spacing={1}>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Total debit:</h6>
                                                                        <h6
                                                                            style={{
                                                                                width: '100%',
                                                                                textAlign: 'left',
                                                                                color: 'red',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            {valueTotalDebitMemo.toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2,
                                                                                },
                                                                            )}
                                                                        </h6>
                                                                    </Stack>
                                                                    <Stack
                                                                        direction={'row'}
                                                                        spacing={2}
                                                                        alignItems={'center'}
                                                                        justifyContent={'flex-start'}
                                                                    >
                                                                        <h6 style={{ width: '40%' }}>Total credit:</h6>
                                                                        <h6
                                                                            style={{
                                                                                width: '100%',
                                                                                textAlign: 'left',
                                                                                color: 'green',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            {valueTotalCreditMemo.toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2,
                                                                                },
                                                                            )}
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
                                                                {/* <DataGrid
                                                                    // rows={data}
                                                                    columns={columns}
                                                                    initialState={{
                                                                        pagination: {
                                                                            paginationModel: { page: 0, pageSize: 3 },
                                                                        },
                                                                    }}
                                                                    pageSizeOptions={[3, 5, 10, 15]}
                                                                    autoHeight
                                                                /> */}
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
