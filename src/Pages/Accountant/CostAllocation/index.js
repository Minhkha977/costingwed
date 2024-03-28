import React from 'react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
// import TextField from '@mui/material/TextField';
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
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
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
import { Enum_Status_CostAllocation } from '~/components/Enum';
import {
    ApiCostAllocationListDetail,
    ApiCostAllocationListHeader,
    ApiCreateCostAllocationHeader,
    ApiPauseCostAllocation,
    ApiProcessCostAllocation,
    ApiUpdateCostAllocationHeader,
} from '~/components/Api/CostAllocation';
import ApiToken from '~/components/Api/ApiToken';
import { ApiCurrency } from '~/components/Api/Master';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';
import { AssignmentReturnedSharp } from '@mui/icons-material';
import { ApiAccountList } from '~/components/Api/Account';
import { ApiListAccountGroup } from '~/components/Api/AccountGroup';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CancelIcon from '@mui/icons-material/Close';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { AutocompleteControlled } from '~/components/MasterFunction';
import Autocomplete from '@mui/material/Autocomplete';
import { NumericFormat } from 'react-number-format';
import { type } from '@testing-library/user-event/dist/type';
import * as xlsx from 'xlsx';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

const columnsHeader = [
    { field: 'ids', headerName: 'No.', width: 50, headerClassName: 'super-app-theme--header' },
    {
        field: 'doc_code',
        headerName: 'Allocation code',
        width: 150,
        headerClassName: 'super-app-theme--header',
    },

    {
        field: 'description',
        headerName: 'Description',
        minWidth: 300,
        flex: 1,
        headerClassName: 'super-app-theme--header',
    },
    {
        field: 'from_date',
        headerName: 'From date',
        width: 120,
        headerClassName: 'super-app-theme--header',
        valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
        headerAlign: 'center',
    },
    {
        field: 'to_date',
        headerName: 'To date',
        width: 120,
        headerClassName: 'super-app-theme--header',
        valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
        headerAlign: 'center',
    },
    {
        field: 'process_percent',
        headerName: '% Process',
        width: 100,
        headerClassName: 'super-app-theme--header',
        valueFormatter: ({ value }) => `${value} %`,
        type: 'number',
    },
    {
        field: 'total_cost',
        headerName: 'Total cost',
        width: 150,
        headerClassName: 'super-app-theme--header',
        type: 'number',
    },
    {
        field: 'status_display',
        headerName: 'Status',
        width: 120,
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
    },
];

// function TextField({ readOnly, ...props }) {
//     return <MuiTextField {...props} inputProps={{ readOnly }} />;
// }
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function CostAllocation({ title }) {
    const access_token = ApiToken();
    const [valueIsLoading, setIsLoading] = React.useState(false);
    const [valueSearch, setValueSearch] = React.useState('');
    const handleOnChangeValueSearch = (event) => {
        setValueSearch(event.target.value);
    };
    const [valueAllocationCode, setValueAllocationCode] = React.useState('');
    const [valueUser, setValueUser] = React.useState('');
    const [valueDocDate, setValueDocDate] = React.useState(dayjs());
    const [valueUpdateDate, setValueUpdateDate] = React.useState(dayjs());
    const [valueDescription, setValueDescription] = React.useState('');
    const [valueEditGrid, setValueEditGrid] = React.useState(false);
    const columnVisibilityModel = React.useMemo(() => {
        if (valueEditGrid) {
            return {
                actions: true,
            };
        }
        return {
            actions: false,
        };
    }, [valueEditGrid]);

    /* #region  button status */
    const status = Enum_Status_CostAllocation();
    const [valueStatus, setValueStatus] = React.useState('');
    const handleChangeStatus = (event) => {
        setValueStatus(event.target.value);
        setReloadListHeader(!reloadListHeader);
    };
    /* #endregion */

    /* #region  button currency */
    const [dataListCurrency, setDataListCurrency] = React.useState([]);
    const [valueCurrency, setValueCurrency] = useState('VND');

    useEffect(() => {
        ApiCurrency(setDataListCurrency);
    }, []);
    /* #endregion */

    /* #region  button account list */
    const [valueAccountGroup, setValueAccountGroup] = useState('');
    const [dataListAccountGroup, setDataListAccountGroup] = useState([]);
    useEffect(() => {
        ApiListAccountGroup('', setDataListAccountGroup);
    }, []);
    /* #endregion */

    /* #region  select debit and creedit list */
    const [valueCreditEntry, setValueCreditEntry] = React.useState(0);
    const [valueCreditAuto, setValueCreditAuto] = React.useState({});
    const [valueDebitEntry, setValueDebitEntry] = React.useState(0);
    const [valueDebitAuto, setValueDebitAuto] = React.useState({});
    const [dataListAccount, setDataListAccount] = useState([]);

    useEffect(() => {
        ApiAccountList('', setDataListAccount);
    }, []);
    /* #endregion */

    /* #region data list header */
    const [dataListHeader, setDataListHeader] = useState([]);
    const [reloadListHeader, setReloadListHeader] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        const asyncApiListHeader = async () => {
            await ApiCostAllocationListHeader(valueStatus, setDataListHeader);
        };
        asyncApiListHeader();
        setIsLoading(false);
    }, [reloadListHeader]);

    const onHandleRowsSelectionHeader = (ids) => {
        const selectedRowsData = ids.map((id) => dataListHeader.find((row) => row.ids === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueAllocationCode(key.doc_code);
                    setValueUser(key.updated_user);
                    setValueDocDate(dayjs(key.doc_date));
                    setValueDescription(key.description);
                    setValueUpdateDate(dayjs(key.updated_date));
                    setValueAccountGroup(key.acc_group);
                    setValueCurrency(key.currency);
                    setValueDebitEntry(key.debit_entry);
                    const filterDebit = dataListAccount.filter((data) => data.account_code === key.debit_entry);
                    setValueDebitAuto(filterDebit[0]);
                    setValueCreditEntry(key.credit_entry);
                    const filterCredit = dataListAccount.filter((data) => data.account_code === key.credit_entry);
                    setValueCreditAuto(filterCredit[0]);
                    setValueReadonly(true);
                    setValueReadonlyDocdate(true);
                    if (key.status === 2) {
                        setValueButtonProcess(true);
                        setValueButtonPause(false);
                    }
                    if (key.status === 3) {
                        setValueButtonProcess(false);
                        setValueButtonPause(true);
                    }
                    setValueEditGrid(false);
                    setValueDisabledSaveButton(true);
                    setValueButtonNew(false);
                    setValueButtonUpdate(false);
                });
                setReloadListDetail(!reloadListDetail);
            }
        }
    };
    /* #endregion */
    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueReadonlyDocdate, setValueReadonlyDocdate] = React.useState(true);
    const [valueDisabledSaveButton, setValueDisabledSaveButton] = React.useState(true);

    /* #region button new header */
    const [valueButtonNew, setValueButtonNew] = React.useState(false);

    const handleClickNewHeader = (event) => {
        setValueDisabledSaveButton(false);
        setValueReadonly(false);
        setValueReadonlyDocdate(false);
        setValueButtonUpdate(false);
        setValueButtonNew(true);
        setValueAllocationCode('');
        setValueUser(localStorage.getItem('UserName'));
        setValueDescription('');
        setValueDocDate(dayjs());
        setValueUpdateDate(dayjs());
        setValueAccountGroup(9000);
        setValueDebitEntry('');
        setValueDebitAuto({});
        setValueCreditEntry('');
        setValueCreditAuto({});
        setValueButtonProcess(false);
        setValueButtonPause(false);
        setDataListDetail([]);
        setValueEditGrid(true);
    };
    /* #endregion */

    /* #region button update header */
    const [valueButtonUpdate, setValueButtonUpdate] = React.useState(false);
    const handleClickUpdateHeader = (event) => {
        setValueDisabledSaveButton(false);
        setValueReadonly(false);
        setValueReadonlyDocdate(true);
        setValueButtonNew(false);
        setValueButtonUpdate(true);
        setValueUpdateDate(dayjs());
        setValueEditGrid(true);
    };
    /* #endregion */

    /* #region button save header */
    const handleClickSaveHeader = (event) => {
        if (valueDescription && valueAccountGroup) {
            if (valueButtonNew) {
                setDialogIsOpenNewHeader(true);
            }
            if (valueButtonUpdate) {
                setDialogIsOpenUpdate(true);
            }
        } else {
            toast.error(' Empty description, account group!');
        }
    };
    /* #endregion */

    /* #region button Process */
    const [valueButtonProcess, setValueButtonProcess] = React.useState(false);
    const handleClickButtonProcess = (event) => {
        if (valueAllocationCode) {
            setCallApiProcess(!callApiProcess);
        } else {
            toast.error('Empty allocation code!');
        }
    };

    const [callApiProcess, setCallApiProcess] = React.useState(false);
    useEffect(() => {
        const apiProcess = async () => {
            const statusCode = await ApiProcessCostAllocation(access_token, valueAllocationCode);
            if (statusCode) {
                setValueButtonProcess(true);
                setValueButtonPause(false);
                setReloadListHeader(!reloadListHeader);
            }
        };
        apiProcess();
    }, [callApiProcess]);
    /* #endregion */

    /* #region button Pause */
    const [valueButtonPause, setValueButtonPause] = React.useState(false);
    const handleClickButtonPause = (event) => {
        if (valueAllocationCode) {
            setCallApiPause(!callApiPause);
        } else {
            toast.error('Empty allocation code!');
        }
    };
    const [callApiPause, setCallApiPause] = React.useState(false);
    useEffect(() => {
        const apiPause = async () => {
            const statusCode = await ApiPauseCostAllocation(access_token, valueAllocationCode);
            if (statusCode) {
                setValueButtonProcess(false);
                setValueButtonPause(true);
                setReloadListHeader(!reloadListHeader);
            }
        };
        apiPause();
    }, [callApiPause]);
    /* #endregion */

    /* #region  call api new */
    const [dialogIsOpenNewHeader, setDialogIsOpenNewHeader] = React.useState(false);
    const [callApiNewHeader, setCallApiNewHeader] = React.useState(false);
    const agreeDialogNewHeader = () => {
        setDialogIsOpenNewHeader(false);
        setCallApiNewHeader(!callApiNewHeader);
    };
    const closeDialogNewHeader = () => {
        setDialogIsOpenNewHeader(false);
        toast.warning(' Cancel create new!');
    };

    useEffect(() => {
        const apiNewHeader = async () => {
            const statusCode = await ApiCreateCostAllocationHeader(
                access_token,
                valueDescription,
                valueCurrency,
                valueAccountGroup,
                valueDebitEntry,
                valueCreditEntry,
                valueUser,
                dataList,
            );
            if (statusCode) {
                setValueAllocationCode('');
                setValueUser('');
                setValueDescription('');
                setValueDocDate(dayjs());
                setValueUpdateDate(dayjs());
                setValueAccountGroup('');
                setValueDebitEntry('');
                setValueCreditEntry('');
                setValueButtonNew(false);
                setValueDisabledSaveButton(true);
                setValueReadonly(true);
                setValueReadonlyDocdate(true);
                setValueEditGrid(false);
            }

            setReloadListHeader(!reloadListHeader);
        };
        apiNewHeader();
    }, [callApiNewHeader]);
    /* #endregion */

    /* #region  call api update */
    const [dialogIsOpenUpdate, setDialogIsOpenUpdate] = React.useState(false);
    const [callApiUpdate, setCallApiUpdate] = React.useState(false);
    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        setCallApiUpdate(!callApiUpdate);
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(' Cancel Update!');
    };

    useEffect(() => {
        const apiUpdate = async () => {
            const statusCode = await ApiUpdateCostAllocationHeader(
                access_token,
                valueAllocationCode,
                valueDescription,
                valueCurrency,
                valueAccountGroup,
                valueDebitEntry,
                valueCreditEntry,
                valueUser,
                dataList,
            );
            if (statusCode) {
                setValueButtonUpdate(false);
                setValueDisabledSaveButton(true);
                setValueReadonly(true);
                setValueEditGrid(false);
            }
            setReloadListHeader(!reloadListHeader);
        };
        apiUpdate();
    }, [callApiUpdate]);
    /* #endregion */

    /* #region  call api detail list */
    const [dataListDetail, setDataListDetail] = useState([]);
    const [reloadListDetail, setReloadListDetail] = useState([]);
    useEffect(() => {
        const process = async () => {
            setIsLoading(true);
            if (valueAllocationCode) {
                await ApiCostAllocationListDetail(valueAllocationCode, setDataListDetail);
            }
            setIsLoading(false);
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListDetail]);
    /* #endregion */

    const columnsDataDetail = [
        {
            field: 'id',
            headerName: 'No.',
            width: 50,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            headerClassName: 'super-app-theme--header',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
        {
            field: 'doc_date',
            headerName: 'Doc date',
            width: 150,
            editable: valueEditGrid,
            type: 'date',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
        },
        {
            field: 'description',
            headerName: 'Description',
            minWidth: 400,
            editable: valueEditGrid,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 150,
            editable: valueEditGrid,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'status_display',
            headerName: 'Status',
            width: 100,
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'entry_doc_code',
            headerName: 'Doc code',
            width: 100,
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
    ];
    const [dataList, setDataList] = useState([]);

    /* #region  handle click edit detail */
    const [valueId, setValueId] = React.useState(1);
    const handleOnClickNewAeDetail = () => {
        setValueId(valueId + 1);
        setDataListDetail((oldRows) => [
            ...oldRows,
            {
                detail_ids: valueId,
                doc_code: '',
                doc_date: dayjs().utc(),
                unitcode: '',
                acc_code: '',
                description: '',
                cost_center: '',
                credit_amount: null,
                debit_amount: null,
                isactive: true,
                updated_user: localStorage.getItem('UserName'),
                updated_date: new Date(),
                is_new_item: true,
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [valueId]: { mode: GridRowModes.Edit, fieldToFocus: 'cost_center' },
        }));
    };
    useEffect(() => {
        if (dataListDetail.length !== 0) {
            const newData = dataListDetail.map((data) => {
                return { ...data, is_new_item: 'is_new_item' in data, is_delete_item: 'is_delete_item' in data };
            });
            setDataList(newData);
        }
    }, [dataListDetail]);

    const [rowModesModel, setRowModesModel] = React.useState({});
    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        // setDataListAccountEntryDetail(dataListAccountEntryDetail.filter((row) => row.detail_ids !== id));
        const row = {
            ...dataListDetail.filter((row) => row.detail_ids === id),
            is_delete_item: true,
        };
        const updatedRow = {
            ...row[0],
            is_delete_item: true,
        };
        setDataListDetail(dataListDetail.map((row) => (row.detail_ids === id ? updatedRow : row)));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = dataListDetail.find((row) => row.detail_ids === id);
        if (editedRow.isNew) {
            setDataListDetail(dataListDetail.filter((row) => row.detail_ids !== id));
        }
    };
    /* #endregion */

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };
    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setDataListDetail(dataListDetail.map((row) => (row.detail_ids === newRow.detail_ids ? updatedRow : row)));
        return updatedRow;
    };

    let number = 0;
    const [fileExcel, setFileExcell] = React.useState(null);
    const handleClickChoseFile = (event) => {
        setFileExcell(event.target.files);
    };
    const handleClickImportFile = (event) => {
        let fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        if (!fileExcel) {
            toast.error('No file chosen!');
        } else {
            if (fileExcel && fileType.includes(fileExcel[0].type)) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(fileExcel[0]);
                reader.onload = (e) => {
                    const data = e.target.result;
                    const workbook = xlsx.read(data, { type: 'buffer' });
                    const worksheetname = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[worksheetname];
                    const dataExcel = xlsx.utils.sheet_to_json(worksheet);
                    const dataDetail = dataListDetail.map((data) => {
                        return {
                            detail_ids: data.detail_ids,
                            doc_date: data.doc_date,
                            description: data.description,
                            amount: data.amount,
                        };
                    });
                    setDataListDetail(dataExcel.concat(dataDetail));
                };
                setFileExcell(null);
            } else {
                setFileExcell(null);
                toast.error('Please chosen excel file!');
            }
        }
    };
    console.log(dataListDetail);
    return (
        <div className="main">
            <ToastContainer />
            <AlertDialog
                title={'Create a new Allocation?'}
                content={
                    <>
                        Description: {valueDescription}
                        <br /> Account group: {valueAccountGroup}
                        <br /> Debit entry: {valueDebitEntry}
                        <br /> Credit entry: {valueCreditEntry}
                    </>
                }
                onOpen={dialogIsOpenNewHeader}
                onClose={closeDialogNewHeader}
                onAgree={agreeDialogNewHeader}
            />
            <AlertDialog
                title={'update Allocation?'}
                content={
                    <>
                        Allocation code: {valueAllocationCode}
                        <br /> Description: {valueDescription}
                        <br /> Account group: {valueAccountGroup}
                        <br /> Debit entry: {valueDebitEntry}
                        <br /> Credit entry: {valueCreditEntry}
                    </>
                }
                onOpen={dialogIsOpenUpdate}
                onClose={closeDialogUpdate}
                onAgree={agreeDialogUpdate}
            />
            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
            </div>
            <Box
                sx={{
                    width: '100%',
                    typography: 'body',
                    '& .super-app-theme--header': {
                        backgroundColor: '#ffc696',
                    },
                }}
            >
                <Grid container spacing={1}>
                    <Grid xs={12} md={12} sx={{ width: '100%' }}>
                        <Item>
                            <Grid container xs={12} md={12} spacing={1}>
                                <Grid xs={12} md={6}>
                                    <Stack
                                        direction={'row'}
                                        spacing={1}
                                        alignItems={'center'}
                                        justifyContent={'flex-start'}
                                    >
                                        <h6>Status</h6>
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
                                                value={valueStatus}
                                                displayEmpty
                                                onChange={handleChangeStatus}
                                                // onChange={(e) => setValueStatus(e.target.value)}
                                            >
                                                {status.map((data) => {
                                                    return (
                                                        <MenuItem key={data.code} value={data.code}>
                                                            {data.name}
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Stack
                                        direction={'row'}
                                        spacing={1}
                                        alignItems={'center'}
                                        justifyContent={'flex-start'}
                                    >
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            fullWidth
                                            label="Search"
                                            size="small"
                                            value={valueSearch}
                                            onChange={(event) => handleOnChangeValueSearch(event)}
                                        />

                                        <div>
                                            <LoadingButton
                                                startIcon={<SearchIcon />}
                                                variant="contained"
                                                color="warning"
                                                onClick={() => setReloadListHeader(!reloadListHeader)}
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
                                                Cost allocation list
                                            </h5>
                                        </>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} md={12}>
                                    <Stack spacing={0}>
                                        <div style={{ width: '100%' }}>
                                            <DataGrid
                                                rows={dataListHeader}
                                                columns={columnsHeader}
                                                initialState={{
                                                    pagination: {
                                                        paginationModel: { page: 0, pageSize: 5 },
                                                    },
                                                }}
                                                pageSizeOptions={[5, 10, 15]}
                                                autoHeight
                                                getRowId={(row) => row.ids}
                                                loading={valueIsLoading}
                                                onRowSelectionModelChange={(ids) => onHandleRowsSelectionHeader(ids)}
                                                showCellVerticalBorder
                                                showColumnVerticalBorder
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
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                1. Cost allocation information
                                            </h5>
                                        </>
                                        <Stack direction={'row'} spacing={1}>
                                            <LoadingButton
                                                startIcon={<AddBoxIcon />}
                                                variant="contained"
                                                color="success"
                                                onClick={handleClickNewHeader}
                                                disabled={valueButtonNew}
                                                loading={valueButtonNew}
                                                loadingPosition="start"
                                            >
                                                New
                                            </LoadingButton>
                                            <LoadingButton
                                                startIcon={<SystemUpdateAltIcon />}
                                                variant="contained"
                                                color="warning"
                                                onClick={handleClickUpdateHeader}
                                                disabled={valueButtonUpdate}
                                                loading={valueButtonUpdate}
                                                loadingPosition="start"
                                            >
                                                Update
                                            </LoadingButton>
                                            <LoadingButton
                                                startIcon={<SaveIcon />}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleClickSaveHeader}
                                                disabled={valueDisabledSaveButton}
                                            >
                                                Save
                                            </LoadingButton>
                                            <LoadingButton
                                                startIcon={<CurrencyExchangeIcon />}
                                                variant="contained"
                                                color="secondary"
                                                loading={valueButtonProcess}
                                                loadingPosition="start"
                                                disabled={valueButtonProcess}
                                                onClick={handleClickButtonProcess}
                                                sx={{ display: valueButtonProcess ? 'none' : null }}
                                            >
                                                Process
                                            </LoadingButton>
                                            <LoadingButton
                                                startIcon={<StopCircleIcon />}
                                                variant="contained"
                                                color="error"
                                                disabled={valueButtonPause}
                                                onClick={handleClickButtonPause}
                                                sx={{ display: valueButtonPause ? 'none' : null }}
                                            >
                                                Pause
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
                                                    <h6 style={{ width: '40%' }}>Allocation code:</h6>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="xxxxxx"
                                                        value={valueAllocationCode}
                                                        onChange={(e) => setValueAllocationCode(e.target.value)}
                                                        disabled
                                                        // inputProps={{ readOnly: { valueDisabledText } }}
                                                        // disabled={valueDisabledText}
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
                                                    <h6 style={{ width: '40%' }}>Doc date:</h6>
                                                    <div style={{ width: '100%' }}>
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDayjs}
                                                            sx={{ width: '100%' }}
                                                        >
                                                            <DemoContainer
                                                                components={['DatePicker']}
                                                                sx={{ paddingTop: 0 }}
                                                            >
                                                                <DatePicker
                                                                    // label={'"month" and "year"'}
                                                                    // views={['month', 'year']}
                                                                    value={valueDocDate}
                                                                    // sx={{ width: 300 }}
                                                                    slotProps={{
                                                                        textField: { size: 'small' },
                                                                    }}
                                                                    formatDensity="spacious"
                                                                    format="DD-MM-YYYY"
                                                                    onChange={(e) => setValueDocDate(e)}
                                                                    disabled={valueReadonlyDocdate}
                                                                />
                                                            </DemoContainer>
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
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="name"
                                                        value={valueUser}
                                                        onChange={(e) => setValueUser(e.target.value)}
                                                        disabled
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
                                                    <h6 style={{ width: '40%' }}>Update date:</h6>
                                                    <div style={{ width: '100%' }}>
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDayjs}
                                                            sx={{ width: '100%' }}
                                                        >
                                                            <DemoContainer
                                                                components={['DatePicker']}
                                                                sx={{ paddingTop: 0 }}
                                                            >
                                                                <DatePicker
                                                                    // label={'"month" and "year"'}
                                                                    // views={['month', 'year']}
                                                                    value={valueUpdateDate}
                                                                    // sx={{ width: 300 }}
                                                                    slotProps={{
                                                                        textField: { size: 'small' },
                                                                    }}
                                                                    formatDensity="spacious"
                                                                    format="DD-MM-YYYY"
                                                                    onChange={(e) => setValueUpdateDate(e)}
                                                                    disabled
                                                                />
                                                            </DemoContainer>
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
                                                    <h6 style={{ width: '40%' }}>Descriptiont:</h6>
                                                    <Form.Control
                                                        type="text"
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="..."
                                                        value={valueDescription}
                                                        onChange={(e) => setValueDescription(e.target.value)}
                                                        disabled={valueReadonly}
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
                                                                value={valueAccountGroup}
                                                                displayEmpty
                                                                onChange={(e) => setValueAccountGroup(e.target.value)}
                                                                disabled={valueReadonly}
                                                            >
                                                                {dataListAccountGroup
                                                                    .sort(
                                                                        (a, b) =>
                                                                            parseFloat(a.gr_acc_code) -
                                                                            parseFloat(b.gr_acc_code),
                                                                    )
                                                                    .map((data) => {
                                                                        return (
                                                                            <MenuItem
                                                                                key={data.gr_acc_code}
                                                                                value={data.gr_acc_code}
                                                                            >
                                                                                {data.gr_acc_code} - {data.gr_acc_name}
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
                                                                value={valueCurrency}
                                                                displayEmpty
                                                                onChange={(e) => setValueCurrency(e.target.value)}
                                                                disabled={valueReadonly}
                                                            >
                                                                {dataListCurrency.map((data) => {
                                                                    return (
                                                                        <MenuItem key={data.code} value={data.code}>
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
                                                    <h6 style={{ width: '40%' }}>Debit entry:</h6>

                                                    <div style={{ width: '100%' }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            componentsProps={{
                                                                popper: {
                                                                    style: { width: 'fit-content' },
                                                                },
                                                            }}
                                                            size="small"
                                                            disabled={valueReadonly}
                                                            // freeSolo
                                                            value={valueDebitAuto}
                                                            onChange={(event, newValue) => {
                                                                setValueDebitEntry(
                                                                    newValue ? newValue.account_code : '',
                                                                );
                                                                setValueDebitAuto(newValue);
                                                            }}
                                                            options={dataListAccount.sort(
                                                                (a, b) =>
                                                                    parseFloat(a.account_code) -
                                                                    parseFloat(b.account_code),
                                                            )}
                                                            getOptionLabel={(option) =>
                                                                `${option.account_code_display ?? ''} - ${
                                                                    option.account_name ?? ''
                                                                }`
                                                            }
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
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
                                                    <h6 style={{ width: '40%' }}>Credit entry:</h6>
                                                    <div style={{ width: '100%' }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            componentsProps={{
                                                                popper: {
                                                                    style: { width: 'fit-content' },
                                                                },
                                                            }}
                                                            size="small"
                                                            disabled={valueReadonly}
                                                            // freeSolo
                                                            value={valueCreditAuto}
                                                            onChange={(event, newValue) => {
                                                                setValueCreditEntry(
                                                                    newValue ? newValue.account_code : '',
                                                                );
                                                                setValueCreditAuto(newValue);
                                                            }}
                                                            options={dataListAccount.sort(
                                                                (a, b) =>
                                                                    parseFloat(a.account_code) -
                                                                    parseFloat(b.account_code),
                                                            )}
                                                            getOptionLabel={(option) =>
                                                                `${option.account_code_display ?? ''} - ${
                                                                    option.account_name ?? ''
                                                                }`
                                                            }
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </div>
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
                                        <h5
                                            style={{
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: '100%',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            2. Detail
                                        </h5>
                                        <Stack direction={'row'} spacing={1}>
                                            <input
                                                type="file"
                                                required
                                                disabled={!valueEditGrid}
                                                onChange={handleClickChoseFile}
                                            />
                                            <LoadingButton
                                                component="label"
                                                role={undefined}
                                                variant="contained"
                                                startIcon={<PostAddIcon />}
                                                onClick={handleClickImportFile}
                                                disabled={!valueEditGrid}
                                            >
                                                Import
                                                {/* <VisuallyHiddenInput type="file" /> */}
                                            </LoadingButton>

                                            <LoadingButton
                                                startIcon={<AddBoxIcon />}
                                                variant="contained"
                                                color="success"
                                                onClick={handleOnClickNewAeDetail}
                                                sx={{ alignItems: 'left' }}
                                                disabled={!valueEditGrid}
                                            >
                                                Detail
                                            </LoadingButton>
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                    <Item>
                                        <Stack spacing={0}>
                                            <div style={{ width: '100%', minHeight: 500 }}>
                                                <DataGrid
                                                    columnVisibilityModel={columnVisibilityModel}
                                                    rows={dataListDetail.filter((data) => data.is_delete_item !== true)}
                                                    columns={columnsDataDetail}
                                                    autoHeight
                                                    showCellVerticalBorder
                                                    showColumnVerticalBorder
                                                    getRowId={(id) => id.detail_ids}
                                                    loading={valueIsLoading}
                                                    editMode="row"
                                                    rowModesModel={rowModesModel}
                                                    onRowModesModelChange={handleRowModesModelChange}
                                                    onRowEditStop={handleRowEditStop}
                                                    processRowUpdate={processRowUpdate}
                                                    slotProps={{
                                                        baseSelect: {
                                                            MenuProps: {
                                                                PaperProps: {
                                                                    sx: {
                                                                        maxHeight: 250,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </Stack>
                                    </Item>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Stack
                                            direction={'row'}
                                            spacing={2}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'}
                                        >
                                            <h6 style={{ width: '40%' }}>Allocated costs:</h6>
                                            <h6
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    // color: 'red',
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
                                            <h6 style={{ width: '40%' }}>Remaining costs:</h6>
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

export default CostAllocation;
