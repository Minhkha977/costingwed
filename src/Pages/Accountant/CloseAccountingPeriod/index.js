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
import { useTranslation } from 'react-i18next';
import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { Excel } from 'antd-table-saveas-excel';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Api_PDF_Report_COGM, Api_Report_COGM } from '~/components/Api/Report';
import CalculateIcon from '@mui/icons-material/Calculate';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import { ApiCalCOGM, ApiCalCostTransfer, ApiLoadDataReport } from '~/components/Api/CloseAccountingPeriod';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DialogLivePigs from './DialogLivePigs';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

function CloseAccountingPeriod({ title }) {
    var dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(false);
    const access_token = useSelector((state) => state.FetchApi.token);
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const unitcode = useSelector((state) => state.Actions.unitcode);
    const [valueNextPeriod, setValueNextPeriod] = React.useState(dayjs(dataPeriod_From_Redux).add(1, 'month'));
    const { t } = useTranslation();
    const dataCostCenter = useSelector((state) =>
        state.FetchApi.listData_CostCenter.filter((data) => data.kind_of_location !== null),
    );

    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs(dataPeriod_From_Redux));
    const [valueCostCenter, setValueCostCenter] = React.useState('');

    //todo: reload next month
    useEffect(() => {
        setValueNextPeriod(dayjs(dataPeriod_From_Redux).add(1, 'month'));
    }, [dataPeriod_From_Redux]);
    const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
    const [callApiOpen, setCallApiOpen] = React.useState(false);
    const agreeDialogr = () => {
        setDialogIsOpen(false);
        setCallApiOpen(true);
    };
    const closeDialog = () => {
        setDialogIsOpen(false);
        toast.warning(t('close-toast-cancel'));
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

    //todo: call api export file
    /* #region  call api export list */
    const [buttonExport, setButtonExport] = useState(false);
    const handleViewReport = (event) => {
        setReloadData(true);
    };

    //todo: call api calculate cogm
    const [buttonCalCOGM, setButtonCalCOGM] = useState(false);
    useEffect(() => {
        const fetchApiCalCOGM = async () => {
            if (buttonCalCOGM) {
                setIsLoading(true);
                const statusCode = await ApiCalCOGM({
                    access_token: access_token,
                    PERIOD_MONTH: dayjs(dataPeriod_From_Redux).add(1, 'month').month(),
                    PERIOD_YEAR: dayjs(dataPeriod_From_Redux).year(),
                });
                if (statusCode) {
                    toast.success(t('toast-success-cogm'));
                }
                setIsLoading(false);
            }
            setButtonCalCOGM(false);
        };
        fetchApiCalCOGM();
    }, [buttonCalCOGM]);
    const [dialogIsOpenCalCOGM, setDialogIsOpenCalCOGM] = React.useState(false);
    const agreeDialogCalCOGM = () => {
        setDialogIsOpenCalCOGM(false);
        setButtonCalCOGM(true);
    };
    const closeDialogCalCOGM = () => {
        setDialogIsOpenCalCOGM(false);
        toast.warning(t('toast-cancel-cogm'));
    };

    //todo: call api calculate cogm
    const [buttonCalCostTransfer, setButtonCalCostTransfer] = useState(false);
    useEffect(() => {
        const fetchApiCalCostTransfer = async () => {
            if (buttonCalCostTransfer) {
                setIsLoading(true);
                const statusCode = await ApiCalCostTransfer({
                    access_token: access_token,
                    PERIOD_MONTH: dayjs(dataPeriod_From_Redux).add(1, 'month').month(),
                    PERIOD_YEAR: dayjs(dataPeriod_From_Redux).year(),
                });
                if (statusCode) {
                    toast.success(t('toast-success-cost-transfer'));
                }
                setIsLoading(false);
            }
            setButtonCalCostTransfer(false);
        };
        fetchApiCalCostTransfer();
    }, [buttonCalCostTransfer]);
    const [dialogIsOpenCalCost, setDialogIsOpenCalCost] = React.useState(false);
    const agreeDialogCalCost = () => {
        setDialogIsOpenCalCost(false);
        setButtonCalCostTransfer(true);
    };
    const closeDialogCalCost = () => {
        setDialogIsOpenCalCost(false);
        toast.warning(t('toast-cancel-cost-transfer'));
    };

    //! handler change
    const handleChangePeriod = (event) => {
        setValueDateAccountPeriod(event);
    };
    const handleChangeCostCenter = (event) => {
        setValueCostCenter(event.target.value);
    };

    //! handler click export file
    const handleClickExport = () => {
        if (dataList.length > 0) {
            const data = dataList.map((el) => {
                // let doc_date = dayjs(el.doc_date);
                // let allcation_date = dayjs(el.allcation_date);
                // el.doc_date = doc_date.date() + '/' + (doc_date.month() + 1) + '/' + doc_date.year();
                // el.allcation_date =
                //     allcation_date.date() + '/' + (allcation_date.month() + 1) + '/' + allcation_date.year();
                el.amount_period_N = el.amount_period_N.toLocaleString();
                el.amount_period_N_1 = el.amount_period_N_1.toLocaleString();
                el.amount_period_N_2 = el.amount_period_N_2.toLocaleString();
                return el;
            });

            const excel = new Excel();
            excel
                .addSheet('Spread Period')
                .addColumns(columnsExport)
                .addDataSource(
                    data.sort(function (a, b) {
                        return a.expense_code.localeCompare(b.expense_code);
                    }),

                    {
                        str2Percent: true,
                    },
                )
                .saveAs(`SpreadPeriod_${valueDateAccountPeriod.format('YYYYMM')}_${dayjs().format('YYYYMMDD')}.xlsx`);
        } else {
            toast.warn(t('toast-nodata'));
        }
    };
    /* #endregion */

    const columnsExport = [
        {
            title: 'Mã tài khoản',
            dataIndex: 'acc_code',
            key: 'Mã tài khoản',
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'acc_name',
            key: 'Tên tài khoản',
        },
        {
            title: 'Mã nhóm chi phí',
            dataIndex: 'grp_expense_code',
            key: 'Mã nhóm chi phí',
        },
        {
            title: 'Nhóm chi phí',
            dataIndex: 'grp_expense_name',
            key: 'Nhóm chi phí',
        },
        {
            title: 'Mã chi phí',
            dataIndex: 'expense_code',
            key: 'Mã chi phí',
        },
        {
            title: 'Chi phí',
            dataIndex: 'expense_name',
            width: 400,
            key: 'Chi phí',
        },
        {
            title: 'Kỳ N-2',
            dataIndex: 'amount_period_N_2',
            key: 'Period N2',
        },
        {
            title: 'Kỳ N-1',
            dataIndex: 'amount_period_N_1',
            key: 'Period N1',
        },
        {
            title: 'Kỳ N',
            dataIndex: 'amount_period_N',
            key: 'Period N',
        },
    ];

    /* #region  call api list */
    const [reloadData, setReloadData] = React.useState(false);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        const asyncApiList = async () => {
            setIsLoading(true);
            if (reloadData) {
                if (valueCostCenter) {
                    const status_code = await ApiLoadDataReport({
                        valueCostCenter: valueCostCenter,
                        PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                        PERIOD_YEAR: valueDateAccountPeriod.year(),
                        setDataReport: setDataList,
                    });
                } else {
                    toast.warn(t('toast-nodata'));
                }
            }
            setIsLoading(false);
        };

        asyncApiList();
        setReloadData(false);
    }, [reloadData]);
    /* #endregion */
    //! column datagrid
    const columns = [
        {
            field: 'acc_code',
            headerName: t('account-code'),
            width: 100,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'acc_name',
            headerName: t('account-name'),
            width: 200,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'expense_name',
            headerName: t('account-expense'),
            minWidth: 300,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'amount_period_N_2',
            headerName: t('close-n2'),
            type: 'number',
            width: 130,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'amount_period_N_1',
            headerName: t('close-n1'),
            type: 'number',
            width: 130,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },

        {
            field: 'amount_period_N',
            headerName: t('close-n'),
            type: 'number',
            width: 130,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
    ];

    //! handler open dialog
    const [openDialogCost, setOpenDialogCost] = React.useState(false);
    const handleClickOpenDialogDetail = () => {
        setOpenDialogCost(true);
    };

    const handleCloseDialogDetail = () => {
        setOpenDialogCost(false);
    };

    //! on key event
    OnMultiKeyEvent(() => handleOpenPeriod(), 'l');

    //? Mobile
    //! button phan bo header
    const mobileButtonCalculated = (
        <Stack
            direction={'column'}
            spacing={1}
            alignItems={'center'}
            justifyContent={'flex-start'}
            sx={{ display: { xs: 'flex', md: 'none' } }}
        >
            <LoadingButton
                fullWidth
                startIcon={<AddBoxIcon />}
                variant="contained"
                color="primary"
                onClick={handleClickOpenDialogDetail}
                loadingPosition="start"
                sx={{ whiteSpace: 'nowrap' }}
            >
                {t('button-material-cost')}
            </LoadingButton>

            <LoadingButton
                fullWidth
                startIcon={<CalculateIcon />}
                variant="contained"
                color="warning"
                onClick={() => setDialogIsOpenCalCOGM(true)}
                loadingPosition="start"
                sx={{ whiteSpace: 'nowrap' }}
            >
                {t('button-calculate-cogm')}
            </LoadingButton>
            <LoadingButton
                fullWidth
                startIcon={<MoveUpIcon />}
                variant="contained"
                color="secondary"
                onClick={() => setDialogIsOpenCalCost(true)}
                loadingPosition="start"
                sx={{ whiteSpace: 'nowrap' }}
            >
                {t('button-calculate-cost-transfer')}
            </LoadingButton>
        </Stack>
    );
    return (
        <Spin size="large" tip="Loading" spinning={isLoading} style={{ maxHeight: 'fit-content' }}>
            <div className="main">
                <ToastContainer />
                {dialogIsOpen && (
                    <AlertDialog
                        title={t('close-toast-new')}
                        content={
                            <>
                                {t('close-toast-new')}: {dayjs(dataPeriod_From_Redux).utc(true).format('MM - YYYY')}
                            </>
                        }
                        onOpen={dialogIsOpen}
                        onClose={closeDialog}
                        onAgree={agreeDialogr}
                    />
                )}
                {dialogIsOpenCalCOGM && (
                    <AlertDialog
                        title={t('button-calculate-cogm')}
                        content={
                            <>
                                {t('button-calculate-cogm')}:{' '}
                                {dayjs(dataPeriod_From_Redux).utc(true).format('MM - YYYY')}
                            </>
                        }
                        onOpen={dialogIsOpenCalCOGM}
                        onClose={closeDialogCalCOGM}
                        onAgree={agreeDialogCalCOGM}
                    />
                )}
                {dialogIsOpenCalCost && (
                    <AlertDialog
                        title={t('button-calculate-cost-transfer')}
                        content={
                            <>
                                {t('button-calculate-cost-transfer')}:{' '}
                                {dayjs(dataPeriod_From_Redux).utc(true).format('MM - YYYY')}
                            </>
                        }
                        onOpen={dialogIsOpenCalCost}
                        onClose={closeDialogCalCost}
                        onAgree={agreeDialogCalCost}
                    />
                )}
                {openDialogCost && <DialogLivePigs open={openDialogCost} onClose={handleCloseDialogDetail} />}
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/material-ui/getting-started/installation/"
                        ></Link>
                        <Typography color="text.primary">{t(title)}</Typography>
                    </Breadcrumbs>
                </div>
                <Box
                    sx={{
                        width: '100%',
                        typography: 'body',
                        flexGrow: 1,
                        '& .super-app-theme--header': {
                            backgroundColor: '#ffc696',
                        },
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid xs={12} md={12}>
                            <Item>
                                <Grid container spacing={1}>
                                    <Grid xs={12} md={5}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '50%', textAlign: 'right' }}>{t('close-period')}</h6>
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
                                    <Grid xs={12} md={5}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '50%', textAlign: 'right' }}>{t('new-period')}</h6>
                                            <div style={{ width: '100%' }}>
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
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={2}>
                                        <LoadingButton
                                            fullWidth
                                            // loading
                                            variant="contained"
                                            color="primary"
                                            startIcon={<LockIcon />}
                                            onClick={handleOpenPeriod}
                                        >
                                            {t('button-lock')}
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid xs={12} md={12} sx={{ width: '100%' }}>
                            <Item>
                                {mobileButtonCalculated}
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
                                            <h5
                                                style={{
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {t('expenses-period')}
                                            </h5>

                                            <Stack
                                                direction={'row'}
                                                spacing={2}
                                                alignItems={'center'}
                                                justifyContent={'flex-start'}
                                                sx={{ display: { xs: 'none', md: 'flex' } }}
                                            >
                                                <LoadingButton
                                                    startIcon={<AddBoxIcon />}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleClickOpenDialogDetail}
                                                    loadingPosition="start"
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {t('button-material-cost')}
                                                </LoadingButton>

                                                <LoadingButton
                                                    startIcon={<CalculateIcon />}
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => setDialogIsOpenCalCOGM(true)}
                                                    loadingPosition="start"
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {t('button-calculate-cogm')}
                                                </LoadingButton>

                                                <LoadingButton
                                                    startIcon={<MoveUpIcon />}
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => setDialogIsOpenCalCost(true)}
                                                    loadingPosition="start"
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {t('button-calculate-cost-transfer')}
                                                </LoadingButton>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                            }}
                                        >
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
                                                                    <div className="form-title">
                                                                        {t('entry-period')}
                                                                    </div>
                                                                    <div style={{ width: '100%' }}>
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                        >
                                                                            <DatePicker
                                                                                views={['month', 'year']}
                                                                                sx={{ width: '100%' }}
                                                                                value={valueDateAccountPeriod}
                                                                                slotProps={{
                                                                                    textField: { size: 'small' },
                                                                                }}
                                                                                formatDensity="spacious"
                                                                                format="MM-YYYY"
                                                                                onChange={handleChangePeriod}
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
                                                                    <div className="form-title">
                                                                        <div>{t('cost-center')}</div>
                                                                    </div>

                                                                    <Select
                                                                        labelId="demo-simple-select-helper-label"
                                                                        id="group-cost"
                                                                        value={valueCostCenter}
                                                                        displayEmpty
                                                                        fullWidth
                                                                        onChange={(e) => handleChangeCostCenter(e)}
                                                                        // sx={{ width: 250 }}
                                                                        size="small"
                                                                    >
                                                                        {dataCostCenter.map((data) => {
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
                                                                </Stack>
                                                            </Grid>
                                                            <Grid xs={12} md={4}>
                                                                <Stack
                                                                    direction={'row'}
                                                                    spacing={2}
                                                                    alignItems={'center'}
                                                                    justifyContent={'space-evenly'}
                                                                >
                                                                    <div>
                                                                        <LoadingButton
                                                                            startIcon={<SearchIcon />}
                                                                            variant="contained"
                                                                            color="info"
                                                                            onClick={handleViewReport}
                                                                            loadingPosition="start"
                                                                            sx={{ whiteSpace: 'nowrap' }}
                                                                        >
                                                                            {t('button-view-report')}
                                                                        </LoadingButton>
                                                                    </div>
                                                                    <div>
                                                                        <LoadingButton
                                                                            startIcon={<FileDownloadIcon />}
                                                                            variant="contained"
                                                                            color="success"
                                                                            onClick={handleClickExport}
                                                                            loading={buttonExport}
                                                                            loadingPosition="start"
                                                                            sx={{ whiteSpace: 'nowrap' }}
                                                                        >
                                                                            {t('button-export')}
                                                                        </LoadingButton>
                                                                    </div>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Item>
                                                </Grid>
                                                <Grid xs={12} md={12}>
                                                    <Stack spacing={0}>
                                                        <div style={{ width: '100%' }}>
                                                            <DataGrid
                                                                rows={dataList}
                                                                columns={columns}
                                                                initialState={{
                                                                    pagination: {
                                                                        paginationModel: { page: 0, pageSize: 5 },
                                                                    },
                                                                }}
                                                                pageSizeOptions={[5, 10, 15]}
                                                                autoHeight
                                                                showCellVerticalBorder
                                                                showColumnVerticalBorder
                                                                loading={isLoading}
                                                                getRowId={(row) => row.expense_code}
                                                            />
                                                        </div>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Box>
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
