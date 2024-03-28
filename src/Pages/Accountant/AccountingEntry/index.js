import React from 'react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
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
import { ApiCostCenter, ApiCurrency } from '~/components/Api/Master';
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
    ApiImportAccountEntry,
    ApiUpdateAccountEntryDetail,
    ApiUpdateAccountEntryHeader,
} from '~/components/Api/AccountingEntryApi';
import { type } from '@testing-library/user-event/dist/type';
import TextField from '@mui/material/TextField';
// import MuiTextField from '@mui/material/TextField';
import { ApiListAccountGroup } from '~/components/Api/AccountGroup';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CancelIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { ApiAccountList } from '~/components/Api/Account';
import { Input } from '@mui/icons-material';
import { AutocompleteControlled } from '~/components/MasterFunction';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector, useDispatch } from 'react-redux';

var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

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
        headerClassName: 'super-app-theme--header',
    },
    {
        field: 'doc_date',
        headerName: 'Posting Date',
        width: 150,
        valueFormatter: (params) => dayjs(params.value).format('DD - MM - YYYY'),
        headerClassName: 'super-app-theme--header',
    },
    {
        field: 'grp_acc',
        headerName: 'Account group',
        width: 120,
        headerClassName: 'super-app-theme--header',
    },
    {
        field: 'description',
        headerName: 'Description',
        minWidth: 400,
        flex: 1,
        headerClassName: 'super-app-theme--header',
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

function AccountingEntry({ title }) {
    const access_token = ApiToken();

    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueReadonlyPostingDate, setValueReadonlyPostingDate] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [valueSearchAccountingEntry, setValueSearchAccountingEntry] = React.useState('');
    const [reloadListAccountingEntryHeader, setReloadListAccountingEntryHeader] = React.useState(false);
    const handleOnChangeValueSearch = (event) => {
        setValueSearchAccountingEntry(event.target.value);
    };
    const [valueEditGrid, setValueEditGrid] = React.useState(false);
    const [valueEdit, setValueEdit] = React.useState(false);
    const columnVisibilityModel = React.useMemo(() => {
        if (valueEdit) {
            return {
                actions: true,
                acc_code: false,
                t: true,
            };
        }
        if (valueEditGrid) {
            return {
                actions: true,
                acc_code: true,
                t: false,
            };
        }
        return {
            actions: false,
            acc_code: true,
            t: false,
        };
    }, [valueEditGrid, valueEdit]);
    /* #region  handle value */
    const [valueCodeAe, setValueCodeAe] = useState('');
    const [valueUserAe, setValueUserAe] = useState('');
    const [valueDescriptionAe, setValueDescriptionAe] = useState('');
    const [valueDocsDateAe, setValueDocsDateAe] = useState(dayjs());
    const [valueDateAe, setValueDateAe] = useState(dayjs());
    const [valueCostCenterAe, setValueCostCenterAe] = useState('');
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
    /* #endregion */

    const [dataListAEHeader, setDataAEListHeader] = useState([]);
    const [dataList, setDataList] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        if (dataPeriod_From_Redux) {
            ApiAccountEntryListHeader(
                valueDateAccountPeriod.month() + 1,
                valueDateAccountPeriod.year(),
                valueSearchAccountingEntry,
                setDataAEListHeader,
            );
        }
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
                    setValueDateAe(dayjs(key.updated_date));
                    setValueUserAe(key.updated_by);
                    setValueAccountGroupAE(key.grp_acc);
                    setValueCurrency(key.currency);
                    setValueTotalDebitAe(key.total_debit);
                    setValueTotalCreditAe(key.total_credit);
                    setValueNewButton(false);
                    setValueUpdateButton(false);
                    setValueDisableSaveButton(true);
                    setValueReadonly(true);
                    setValueReadonlyPostingDate(true);
                    setValueEditGrid(false);
                    setValueEdit(false);
                });
                setReloadListAeDetail(!reloadListAeDetail);
            }
        }
    };

    const [valueAccountGroupMemo, setValueAccountGroupMemo] = useState('');

    /* #region  call api account group */
    const [valueAccountGroupAE, setValueAccountGroupAE] = useState(9000);
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
    /* #endregion */

    /* #region  call api currency */
    const [dataListCurrency, setDataListCurrency] = React.useState([]);
    const [valueCurrency, setValueCurrency] = useState('VND');
    const handleChangeCurren = (event) => {
        setValueCurrency(event.target.value);
    };
    useEffect(() => {
        ApiCurrency(setDataListCurrency);
    }, []);
    /* #endregion */

    /* #region  call api new */
    const [valueNewButton, setValueNewButton] = React.useState(false);
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
        setValueNewButton(true);
        setValueUpdateButton(false);
        setValueDisableSaveButton(false);

        setValueCodeAe('');
        setValueUserAe(localStorage.getItem('UserName'));
        setValueDescriptionAe('');
        setValueDocsDateAe(dayjs());
        setValueDateAe(dayjs());
        setValueAccountGroupAE(9000);
        setValueTotalDebitAe(0);
        setValueTotalCreditAe(0);
        setDataListAccountEntryDetail([]);
        setValueId(1);
        setValueEditGrid(true);
        setValueEdit(false);
        setValueReadonly(false);
        setValueReadonlyPostingDate(false);
    };

    const apiNewAeHeader = async () => {
        const statusCode = await ApiCreateAccountEntryHeader(
            access_token,
            valueDocsDateAe,
            valueDescriptionAe,
            valueCurrency,
            valueAccountGroupAE,
            dataList,
        );
        if (statusCode) {
            setValueCodeAe('');
            setValueDocsDateAe(dayjs());
            setValueDateAe(dayjs());
            setValueUserAe(localStorage.getItem('UserName'));
            setValueDescriptionAe('');
            setValueAccountGroupAE('');
            setValueTotalDebitAe(0);
            setValueTotalCreditAe(0);
            setValueId(1);
            setValueNewButton(false);
            setValueDisableSaveButton(true);
            setDataListAccountEntryDetail([]);
            setValueReadonly(true);
            setValueReadonlyPostingDate(true);
            setValueEditGrid(false);
        }

        setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
    };
    useEffect(() => {
        apiNewAeHeader();
    }, [callApiNewAeHeader]);
    /* #endregion */

    /* #region  call api update */
    const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
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
        setValueNewButton(false);
        setValueUpdateButton(true);
        setValueDisableSaveButton(false);

        setValueUserAe(localStorage.getItem('UserName'));

        setValueReadonly(false);
        setValueReadonlyPostingDate(true);
        setValueEditGrid(true);
        setValueEdit(false);
    };
    const callApiUpdate = async () => {
        const statusCode = await ApiUpdateAccountEntryHeader(
            access_token,
            valueDocsDateAe,
            valueCodeAe,
            valueDescriptionAe,
            valueCurrency,
            valueAccountGroupAE,
            dataList,
            setValueTotalDebitAe,
            setValueTotalCreditAe,
        );
        if (statusCode) {
            setValueUpdateButton(false);
            setValueDisableSaveButton(true);
            setValueReadonly(true);
            setValueReadonlyPostingDate(true);
            setValueEditGrid(false);
        }
        // setValueUserAe(localStorage.getItem('UserName'));
        setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
    };
    useEffect(() => {
        callApiUpdate();
    }, [callApiUpdateAeHeader]);
    /* #endregion */

    const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
    const handleClickSave = (event) => {
        if (valueDescriptionAe && valueAccountGroupAE) {
            if (valueNewButton) {
                setDialogIsOpenNewAeHeader(true);
            }
            if (valueUpdateButton) {
                setDialogIsOpenUpdateAeHeader(true);
            }
        } else {
            toast.error(' Empty description, account group!');
        }
    };

    /* #region  call api delete */
    const [dialogIsOpenDeleteAeHeader, setDialogIsOpenDeleteAeHeader] = React.useState(false);
    const [callApiDeleteAeHeader, setCallApiDeleteAeHeader] = React.useState(false);
    const agreeDialogDeleteAeHeader = async () => {
        setDialogIsOpenDeleteAeHeader(false);
        setCallApiDeleteAeHeader(!callApiDeleteAeHeader);
    };
    const closeDialogDeleteAeHeader = () => {
        setDialogIsOpenDeleteAeHeader(false);
        toast.warning(' Cancel delete!');
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
        setValueDateAe(dayjs());
        setValueDescriptionAe('');
        setValueAccountGroupAE('');
        setValueTotalDebitAe(0);
        setValueTotalCreditAe(0);
        setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
    };
    useEffect(() => {
        apiDeleteAeHeader();
    }, [callApiDeleteAeHeader]);
    /* #endregion */

    const [dataListAccountEntryDetail, setDataListAccountEntryDetail] = useState([]);
    const [reloadListAeDetail, setReloadListAeDetail] = useState([]);
    useEffect(() => {
        const process = async () => {
            setIsLoading(true);
            if (valueCodeAe) {
                await ApiAccountEntryListDetail(valueCodeAe, valueSearchAccountingEntry, setDataListAccountEntryDetail);
            }
            setIsLoading(false);
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadListAeDetail]);
    useEffect(() => {
        if (dataListAccountEntryDetail.length !== 0) {
            dataListAccountEntryDetail.forEach((element) => {
                const filter = dataListAccount.filter((data) => data.account_code === element.acc_code);
                setValueAccountCode((old) => {
                    return {
                        ...old,
                        [element.detail_ids]: filter[0],
                    };
                });
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataListAccountEntryDetail]);

    const [valueId, setValueId] = React.useState(0);
    const handleOnClickNewAeDetail = () => {
        // const id = dataListAccountEntryDetail.sort((a, b) => parseFloat(b.detail_ids) - parseFloat(a.detail_ids));
        setValueId(valueId + 1);
        setDataListAccountEntryDetail((oldRows) => [
            ...oldRows,
            {
                id: oldRows.length + 1,
                detail_ids: valueId,
                doc_code: '',
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
        setValueEdit(true);
    };

    const [valueTab, setValueTab] = React.useState('Manage Accounting Entry');

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };
    const dataPeriod_From_Redux = useSelector((state) => state.FetchApi.listData_Period.acc_date);
    const [valueDateAccountPeriod, setValueDateAccountPeriod] = React.useState(dayjs());
    useEffect(() => {
        setValueDateAccountPeriod(dayjs(dataPeriod_From_Redux));
    }, [dataPeriod_From_Redux]);
    console.log(valueDateAccountPeriod);
    const handleOnChangeDateAccountPeriod = (event) => {
        setValueDateAccountPeriod(event);
    };
    /* #region  select debit and creedit list */
    const [valueDebitEntry, setValueDebitEntry] = React.useState(0);
    const [dataListAccount, setDataListAccount] = useState([]);

    useEffect(() => {
        ApiAccountList('', setDataListAccount);
    }, []);
    /* #endregion */

    /* #region  call api cost center */
    const [dataListCostCenter, setDataListCostCenter] = useState([]);

    useEffect(() => {
        ApiCostCenter(setDataListCostCenter);
    }, []);
    /* #endregion */
    const [valueAccountCode, setValueAccountCode] = React.useState({});

    const columnsDataAeDetail = [
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
            field: 'cost_center',
            headerName: 'Cost center',
            width: 150,
            editable: valueEditGrid,
            type: 'singleSelect',
            getOptionValue: (value) => value.code,
            getOptionLabel: (value) => value.name,
            valueOptions: dataListCostCenter,
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'acc_code',
            headerName: 'Account code.',
            width: 200,
            editable: valueEditGrid,
            type: 'singleSelect',
            getOptionValue: (value) => value.account_code,
            getOptionLabel: (value) => `${value.account_code_display} - ${value.account_name}`,
            valueOptions: dataListAccount.sort((a, b) => parseFloat(a.account_code) - parseFloat(b.account_code)),
            PaperProps: {
                sx: { maxHeight: 200 },
            },
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 't',
            headerName: 'Account code',
            width: 200,
            editable: valueEditGrid,
            // type: 'singleSelect',
            // getOptionValue: (value) => value.account_code,
            // getOptionLabel: (value) => `${value.account_code_display} - ${value.account_name}`,
            // valueOptions: dataListAccount.sort((a, b) => parseFloat(a.account_code) - parseFloat(b.account_code)),
            // PaperProps: {
            //     sx: { maxHeight: 200 },
            // },
            headerClassName: 'super-app-theme--header',
            renderEditCell: (params) => (
                <AutocompleteControlled
                    options={dataListAccount}
                    value={valueAccountCode}
                    setValue={setValueAccountCode}
                    setValueSetAccountCode
                    id={params.id}
                />
            ),
            renderCell: (params) => (
                <AutocompleteControlled
                    options={dataListAccount}
                    value={valueAccountCode}
                    setValue={setValueAccountCode}
                    id={params.id}
                />
            ),
        },
        {
            field: 'debit_amount',
            headerName: 'Debit',
            width: 150,
            editable: valueEditGrid,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
        },
        {
            field: 'credit_amount',
            headerName: 'Credit',
            width: 150,
            editable: valueEditGrid,
            type: 'number',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            // valueFormatter: (params) => dayjs(params.value).format('DD/ MM/ YYYY'),
        },
        {
            field: 'description',
            headerName: 'Description',
            minWidth: 400,
            editable: valueEditGrid,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
    ];
    useEffect(() => {
        if (dataListAccountEntryDetail.length !== 0) {
            const newData = dataListAccountEntryDetail.map((data) => {
                return { ...data, is_new_item: 'is_new_item' in data, is_delete_item: 'is_delete_item' in data };
            });
            setDataList(newData);
        }
    }, [dataListAccountEntryDetail]);

    const [rowModesModel, setRowModesModel] = React.useState({});
    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        setValueEdit(true);
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        // setDataListAccountEntryDetail(dataListAccountEntryDetail.filter((row) => row.detail_ids !== id));
        const row = {
            ...dataListAccountEntryDetail.filter((row) => row.detail_ids === id),
            is_delete_item: true,
        };
        const updatedRow = {
            ...row[0],
            is_delete_item: true,
        };
        setDataListAccountEntryDetail(
            dataListAccountEntryDetail.map((row) => (row.detail_ids === id ? updatedRow : row)),
        );
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
        const editedRow = dataListAccountEntryDetail.find((row) => row.detail_ids === id);
        if (editedRow.isNew) {
            setDataListAccountEntryDetail(dataListAccountEntryDetail.filter((row) => row.detail_ids !== id));
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
        setValueEdit(!valueEdit);
    };
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };
    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setDataListAccountEntryDetail(
            dataListAccountEntryDetail.map((row) => (row.detail_ids === newRow.detail_ids ? updatedRow : row)),
        );
        if (valueAccountCode.length !== 0) {
            const rowEdit = valueAccountCode[newRow.detail_ids];
            if (rowEdit) {
                const updatedRow = {
                    ...newRow,
                    acc_code: rowEdit.account_code,
                };
                setDataListAccountEntryDetail(
                    dataListAccountEntryDetail.map((row) => (row.detail_ids === newRow.detail_ids ? updatedRow : row)),
                );
            }
        }
        return updatedRow;
    };
    const [fileExcel, setFileExcell] = React.useState(null);
    const handleClickChoseFile = (event) => {
        setFileExcell(event.target.files);
    };

    const [dialogIsOpenImportFile, setDialogIsOpenImportFile] = React.useState(false);
    const [callApiImportFile, setCallApiImportFile] = React.useState(false);
    const agreeDialogImportFile = async () => {
        setDialogIsOpenImportFile(false);
        setCallApiImportFile(!callApiImportFile);
    };
    const closeDialogImportFile = () => {
        setDialogIsOpenImportFile(false);
        toast.warning(' Cancel Import');
    };

    useEffect(() => {
        const apiImportFile = async () => {
            await ApiImportAccountEntry(access_token, fileExcel);
            setFileExcell('');
            setReloadListAccountingEntryHeader(!reloadListAccountingEntryHeader);
        };
        apiImportFile();
    }, [callApiImportFile]);
    const handleClickImportFile = (event) => {
        let fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        if (!fileExcel) {
            toast.error('No file chosen!');
        } else {
            if (fileExcel && fileType.includes(fileExcel[0].type)) {
                setDialogIsOpenImportFile(true);
            } else {
                setFileExcell(null);
                toast.error('Please chosen excel file!');
            }
        }
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
                title={'Import file accounting entry?'}
                content={<>File Name: {fileExcel ? fileExcel[0].name : ''}</>}
                onOpen={dialogIsOpenImportFile}
                onClose={closeDialogImportFile}
                onAgree={agreeDialogImportFile}
            />
            <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                    <Typography color="text.primary">{valueTab}</Typography>
                </Breadcrumbs>
            </div>
            <Box
                sx={{
                    width: '100%',
                    typography: 'body1',
                    '& .super-app-theme--header': {
                        backgroundColor: '#ffc696',
                    },
                }}
            >
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
                                <Tab label="Manage Accounting Entry" value="Manage Accounting Entry" />
                                <Tab label="Transfer Memo" value="Transfer Memo" />
                            </TabList>
                        </Box>
                        <TabPanel value="Manage Accounting Entry" sx={{ padding: 0 }}>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                }}
                            >
                                <Grid container direction={'row'} spacing={1}>
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
                                                                    format="MM-YYYY"
                                                                    onChange={(e) => handleOnChangeDateAccountPeriod(e)}
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
                                                                // value={age}
                                                                // label="Age"
                                                                displayEmpty
                                                                // onChange={handleChange}
                                                            >
                                                                {/* <MenuItem value={''}>Group 1</MenuItem> */}
                                                            </Select>
                                                        </FormControl>
                                                        <div>
                                                            <LoadingButton
                                                                startIcon={<YoutubeSearchedForIcon />}
                                                                variant="contained"
                                                                color="warning"
                                                                onClick={() =>
                                                                    setReloadListAccountingEntryHeader(
                                                                        !reloadListAccountingEntryHeader,
                                                                    )
                                                                }
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
                                                        <input type="file" required onChange={handleClickChoseFile} />
                                                        <Button
                                                            component="label"
                                                            role={undefined}
                                                            variant="contained"
                                                            tabIndex={-1}
                                                            startIcon={<PostAddIcon />}
                                                            onClick={handleClickImportFile}
                                                        >
                                                            Import file
                                                            {/* <VisuallyHiddenInput type="file" /> */}
                                                        </Button>
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
                                                                        paginationModel: { page: 0, pageSize: 5 },
                                                                    },
                                                                }}
                                                                pageSizeOptions={[5, 10, 15]}
                                                                autoHeight
                                                                showCellVerticalBorder
                                                                showColumnVerticalBorder
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
                                                                loading={valueNewButton}
                                                                loadingPosition="start"
                                                            >
                                                                New
                                                            </LoadingButton>
                                                            <LoadingButton
                                                                startIcon={<SystemUpdateAltIcon />}
                                                                variant="contained"
                                                                color="warning"
                                                                onClick={handleOnClickUpdateAeHeader}
                                                                loading={valueUpdateButton}
                                                                loadingPosition="start"
                                                            >
                                                                Update
                                                            </LoadingButton>
                                                            <LoadingButton
                                                                startIcon={<SaveIcon />}
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={handleClickSave}
                                                                disabled={valueDisableSaveButton}
                                                            >
                                                                Save
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
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="xxxxxxxxx"
                                                                        value={valueCodeAe}
                                                                        onChange={handleChangeValueCodeAe}
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
                                                                    <h6 style={{ width: '40%' }}>Posting date:</h6>
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
                                                                                format="DD-MM-YYYY"
                                                                                onChange={(e) =>
                                                                                    handleChangeValueDocsDateAe(e)
                                                                                }
                                                                                disabled={valueReadonly}
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
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        placeholder="name..."
                                                                        value={valueUserAe}
                                                                        onChange={handleChangeValueUserAe}
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
                                                                    <h6 style={{ width: '40%' }}>Entry date:</h6>
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
                                                                                format="DD-MM-YYYY"
                                                                                onChange={(e) =>
                                                                                    handleChangeValueDateAe(e)
                                                                                }
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
                                                                    <h6 style={{ width: '40%' }}>Description:</h6>
                                                                    <Form.Control
                                                                        type="text"
                                                                        as="textarea"
                                                                        rows={3}
                                                                        placeholder="..."
                                                                        value={valueDescriptionAe}
                                                                        onChange={handleChangeValueDescriptionAe}
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
                                                                                value={valueAccountGroupAE}
                                                                                displayEmpty
                                                                                onChange={handleChangeAccountGroupAE}
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
                                                                                value={valueCurrency}
                                                                                // label="Age"
                                                                                displayEmpty
                                                                                onChange={handleChangeCurren}
                                                                                disabled={valueReadonly}
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
                                                                    rows={dataListAccountEntryDetail.filter(
                                                                        (data) =>
                                                                            data.isactive === true &&
                                                                            data.is_delete_item !== true,
                                                                    )}
                                                                    columns={columnsDataAeDetail}
                                                                    // initialState={{
                                                                    //     pagination: {
                                                                    //         paginationModel: { page: 0, pageSize: 5 },
                                                                    //     },
                                                                    //     pinnedColumns: { right: ['actions'] },
                                                                    // }}
                                                                    // pageSizeOptions={[5, 10, 15]}
                                                                    autoHeight
                                                                    showCellVerticalBorder
                                                                    showColumnVerticalBorder
                                                                    getRowId={(id) => id.detail_ids}
                                                                    loading={isLoading}
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
                                                                // value={age}
                                                                // label="Age"
                                                                displayEmpty
                                                                // onChange={handleChange}
                                                            >
                                                                {/* <MenuItem value={''}>Group 1</MenuItem> */}
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
                                                                paginationModel: { page: 0, pageSize: 5 },
                                                            },
                                                        }}
                                                        pageSizeOptions={[5, 10, 15]}
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
                                                                    <h6 style={{ width: '40%' }}>Doc date:</h6>
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
                                                                                value={valueAccountGroupMemo}
                                                                                displayEmpty
                                                                                onChange={handleChangeAccountGroupMemo}
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
                                                                            paginationModel: { page: 0, pageSize: 5 },
                                                                        },
                                                                    }}
                                                                    pageSizeOptions={[5, 10, 15]}
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
