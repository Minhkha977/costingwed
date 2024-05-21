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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
const singleSelect = ['CH NVT', 'SH BP'];

function CloseAccountingPeriod({ title }) {
    var dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(false);
    const access_token = useSelector((state) => state.FetchApi.token);
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const unitcode = useSelector((state) => state.Actions.unitcode);
    const [valueNextPeriod, setValueNextPeriod] = React.useState(dayjs(dataPeriod_From_Redux).add(1, 'month'));
    const { t } = useTranslation();
    const dataCostCenter = useSelector((state) =>
        state.FetchApi.listData_CostCenter.filter((data) => data.kind_of_location == 'CH'),
    );

    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs());
    const [valueCostCenter, setValueCostCenter] = React.useState('BS009');
    const [valueUrlBase64, setValueUrlBase64] = React.useState('');

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
    const [dataListExport, setDataListExport] = useState([]);
    const [buttonExport, setButtonExport] = useState(true);
    const [callApi, setCallApi] = useState(true);
    useEffect(() => {
        if (valueCostCenter) {
            const process = async () => {
                setIsLoading(true);
                setButtonExport(true);
                const status_code = await Api_Report_COGM({
                    COSTCENTER: valueCostCenter,
                    PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                    PERIOD_YEAR: valueDateAccountPeriod.year(),
                    setDataExport: setDataListExport,
                });
                if (status_code) {
                    setButtonExport(false);
                }
                setIsLoading(false);
            };
            process();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callApi]);
    const handleViewReport = (event) => {
        // if (dataListExport.length > 0) {
        const process = async () => {
            setIsLoading(true);
            await Api_PDF_Report_COGM({
                COSTCENTER: valueCostCenter,
                PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                PERIOD_YEAR: valueDateAccountPeriod.year(),
                setDataUrlBase64: setValueUrlBase64,
            });
            setIsLoading(false);
        };
        process();
        // } else {
        //     toast.warning(t('toast-nodata'));
        // }
    };

    const handleChangePeriod = (event) => {
        setValueDateAccountPeriod(event);
        setCallApi(!callApi);
    };
    const handleChangeCostCenter = (event) => {
        setValueCostCenter(event.target.value);
        setCallApi(!callApi);
    };

    const columnsExport = [
        {
            title: 'Results',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Kg',
            dataIndex: 'weight_after_prcessing',
            key: 'weight_after_prcessing',
        },
        {
            title: 'Yield',
            // width: 300,
            dataIndex: 'yield_display',
            key: 'yield_display',
        },
        {
            title: 'HET',
            dataIndex: 'HET',
            key: 'HET',
        },
        {
            title: 'Basic Count',
            dataIndex: 'basic_count',
            key: 'basic_count',
        },
        {
            title: 'Material',
            dataIndex: 'material_val',
            key: 'material_val',
        },
        {
            title: 'Direct Labor',
            dataIndex: 'direct_labor',
            key: 'direct_labor',
        },
        {
            title: 'Processing Fee',
            dataIndex: 'processing_fee',
            key: 'processing_fee',
        },
        {
            title: 'Transportation',
            // width: 300,
            dataIndex: 'transportation',
            key: 'transportation',
        },
        {
            title: 'Insurance',
            dataIndex: 'insurance',
            key: 'insurance',
        },
        {
            title: 'FOH',
            dataIndex: 'FOH',
            key: 'FOH',
        },
        {
            title: 'Total Cost',
            dataIndex: 'total_cost',
            key: 'total_cost',
        },
        {
            title: 'VND/KG',
            dataIndex: 'cogs_value',
            key: 'cogs_value',
        },
    ];

    //! handler click export file
    const handleClickExport = () => {
        function download(filename, data) {
            var link = document.createElement('a');
            link.href =
                'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
                encodeURIComponent(data);
            link.setAttribute('download', filename);

            link.style.display = 'none';
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        }
        download('COGM Report.xls', dataListExport);
    };
    /* #endregion */
    //! on key event
    OnMultiKeyEvent(() => handleOpenPeriod(), 'l');
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
                                    <Grid xs={12} md={6}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '50%' }}>{t('close-period')}</h6>
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
                                            <h6 style={{ width: '50%' }}>{t('new-period')}</h6>
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
                                                {t('button-lock')}
                                            </LoadingButton>
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
                                            <h5
                                                style={{
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                1. Expenses during the period
                                            </h5>
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
                                                                    <h6 style={{ width: '40%' }}>
                                                                        {t('entry-period')}
                                                                    </h6>
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
                                                    {valueUrlBase64 && (
                                                        <embed
                                                            src={'data:application/pdf;base64,' + valueUrlBase64}
                                                            style={{
                                                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                                                width: '100%',
                                                                height: '80vh',
                                                            }}
                                                        />
                                                    )}
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
