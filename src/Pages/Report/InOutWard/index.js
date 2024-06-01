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
import ReportViewer from '~/Pages/Report/report-viewer';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Excel } from 'antd-table-saveas-excel';
import { Api_PDF_Report_InOutWard, Api_Report_InOut } from '~/components/Api/Report';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { Spin } from 'antd';
import { toast, ToastContainer } from 'react-toastify';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

export default function Report_InOut_Ward({ title }) {
    const access_token = useSelector((s) => s.FetchApi.token);
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();
    const dataCostCenter = useSelector((state) =>
        state.FetchApi.listData_CostCenter.filter((data) => data.kind_of_location == 'SH'),
    );

    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs());
    const [valueCostCenter, setValueCostCenter] = React.useState('BS048');
    const [valueUrlBase64, setValueUrlBase64] = React.useState('');

    //todo: call api export file
    /* #region  call api export list */
    const [dataListExport, setDataListExport] = useState([]);
    const [buttonExport, setButtonExport] = useState(true);
    const [callApi, setCallApi] = useState(false);
    useEffect(() => {
        if (callApi && valueCostCenter) {
            const process = async () => {
                setIsLoading(true);
                setButtonExport(true);
                const status_code = await Api_Report_InOut({
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
            setCallApi(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callApi]);
    useEffect(() => {
        if (callApi && valueCostCenter) {
            const process = async () => {
                setIsLoading(true);
                const status_code = await Api_PDF_Report_InOutWard({
                    COSTCENTER: valueCostCenter,
                    PERIOD_MONTH: valueDateAccountPeriod.month() + 1,
                    PERIOD_YEAR: valueDateAccountPeriod.year(),
                    setDataUrlBase64: setValueUrlBase64,
                });
                if (!status_code) {
                    toast.warning(t('toast-nodata'));
                }
                setIsLoading(false);
            };
            process();
        }
        setCallApi(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callApi]);
    const handleViewReport = (event) => {
        setCallApi(true);
    };

    const handleChangePeriod = (event) => {
        setValueDateAccountPeriod(event);
    };
    const handleChangeCostCenter = (event) => {
        setValueCostCenter(event.target.value);
    };

    const columnsExport = [
        {
            title: '',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: 'Opening Qty',
            dataIndex: 'begin_qty',
            key: 'begin_qty',
        },
        {
            title: 'Opening Value',
            // width: 300,
            dataIndex: 'begin_value',
            key: 'begin_value',
        },
        {
            title: 'Inward Qty',
            dataIndex: 'inward_qty',
            key: 'inward_qty',
        },
        {
            title: 'Inward Value',
            dataIndex: 'inward_value',
            key: 'inward_value',
        },
        {
            title: 'Trans Fee Qty',
            dataIndex: 'inward_trans_fee_qty',
            key: 'inward_trans_fee_qty',
        },
        {
            title: 'Trans Fee Value',
            dataIndex: 'inward_trans_fee_value',
            key: 'inward_trans_fee_value',
        },
        {
            title: 'Outward Qty',
            dataIndex: 'outward_qty',
            key: 'outward_qty',
        },
        {
            title: 'Outward Rate',
            // width: 300,
            dataIndex: 'outward_rate',
            key: 'outward_rate',
        },
        {
            title: 'Outward Value',
            dataIndex: 'outward_value',
            key: 'outward_value',
        },
        {
            title: 'Closing Qty',
            dataIndex: 'end_qty',
            key: 'end_qty',
        },
        {
            title: 'Closing Value',
            dataIndex: 'end_value',
            key: 'end_value',
        },
    ];

    //! handler click export file
    const handleClickExport = () => {
        const data = dataListExport.map((el) => {
            // let doc_date = dayjs(el.doc_date);
            // let allcation_date = dayjs(el.allcation_date);
            // el.doc_date = doc_date.date() + '/' + (doc_date.month() + 1) + '/' + doc_date.year();
            // el.allcation_date =
            //     allcation_date.date() + '/' + (allcation_date.month() + 1) + '/' + allcation_date.year();
            el.begin_qty = el.begin_qty.toLocaleString();
            el.begin_value = el.begin_value.toLocaleString();
            el.inward_qty = el.inward_qty.toLocaleString();
            el.inward_value = el.inward_value.toLocaleString();
            el.inward_trans_fee_qty = el.inward_trans_fee_qty.toLocaleString();
            el.inward_trans_fee_value = el.inward_trans_fee_value.toLocaleString();
            el.outward_qty = el.outward_qty.toLocaleString();
            el.outward_rate = el.outward_rate.toLocaleString();
            el.outward_value = el.outward_value.toLocaleString();
            el.end_qty = el.end_qty.toLocaleString();
            el.end_value = el.end_value.toLocaleString();
            return el;
        });

        const excel = new Excel();
        excel
            .addSheet('InOut Ward')
            .addColumns(columnsExport)
            .addDataSource(
                dataListExport.sort(function (a, b) {
                    return a.item_name.localeCompare(b.item_name);
                }),

                {
                    str2Percent: true,
                },
            )
            .saveAs(`InOutWard_${valueDateAccountPeriod.format('YYYYMM')}_${dayjs().format('YYYYMMDD')}.xlsx`);
    };
    /* #endregion */

    return (
        <Spin size="large" tip={t('loading')} spinning={isLoading} style={{ maxHeight: 'fit-content' }}>
            <div className="main">
                <ToastContainer />
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
                                            <h6 style={{ width: '40%' }}>{t('entry-period')}</h6>
                                            <div style={{ width: '100%' }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                                        <MenuItem key={data.code} value={data.code}>
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
            </div>
        </Spin>
    );
}
