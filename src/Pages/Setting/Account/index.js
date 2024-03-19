import * as React from 'react';
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
import { DataGrid } from '@mui/x-data-grid';
import './AccountStyles.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ToastContainer, toast } from 'react-toastify';
import DomainApi from '~/DomainApi';
import AlertDialog from '~/components/AlertDialog';
import ApiToken from '~/components/Api/ApiToken';
import { ApiAccountList, ApiCreateAccount, ApiUpdateAccount } from '~/components/Api/Account';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import { ApiGroupCost, ApiTypeCost } from '~/components/Api/Master';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));

// function TextField({ readOnly, ...props }) {
//     return <MuiTextField {...props} inputProps={{ readOnly }} />;
// }

function Account({ title }) {
    const columns = [
        {
            field: 'account_code_display',
            headerName: 'Account Code',
            width: 130,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'account_name',
            headerName: 'Account Name',
            minWidth: 300,
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'expense_name',
            headerName: 'Cost Group',
            width: 150,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'expense_type_name',
            headerName: 'Cost Type',
            width: 150,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'is_shared_expense',
            headerName: 'General Account',
            width: 130,
            type: 'boolean',
            headerClassName: 'super-app-theme--header',
        },
    ];

    const [isLoading, setIsLoading] = React.useState(false);

    const access_token = ApiToken();

    const [valueReadonly, setValueReadonly] = React.useState(true);
    const [valueReadonlyCode, setValueReadonlyCode] = React.useState(true);

    const [valueSearch, setValueSearch] = React.useState('');
    const [valueCode, setValueCode] = React.useState('');
    const [valueId, setValueId] = React.useState('');
    const [valueCodeMain, setValueCodeMain] = React.useState('');
    const [valueCodeSub, setValueCodeSub] = React.useState('');
    const [valueName, setValueName] = React.useState('');
    const [valueDescription, setValueDescription] = React.useState('');

    const handleOnChangeValueCode = (event) => {
        setValueCode(event.target.value);
    };
    const handleOnChangeValueCodeMain = (event) => {
        setValueCodeMain(event.target.value);
    };
    const handleOnChangeValueCodeSub = (event) => {
        setValueCodeSub(event.target.value);
    };
    const handleOnChangeValueName = (event) => {
        setValueName(event.target.value);
    };
    const handleOnChangeValueDescription = (event) => {
        setValueDescription(event.target.value);
    };
    const handleOnChangeValueSearch = (event) => {
        setValueSearch(event.target.value);
    };

    /* #region  call api list */

    const [reloadListAccount, setReloadListAccount] = React.useState(false);
    const [dataList, setDataList] = useState([]);
    const asyncApiListAccount = async () => {
        setIsLoading(true);
        await ApiAccountList(valueSearch, setDataList);
        setIsLoading(false);
    };
    useEffect(() => {
        asyncApiListAccount();
    }, [reloadListAccount]);
    /* #endregion */

    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => dataList.find((row) => row.account_code === id));
        if (selectedRowsData) {
            {
                selectedRowsData.map((key) => {
                    setValueCode(key.account_code_display);
                    setValueId(key.ids);
                    setValueCodeMain(key.account_main);
                    setValueCodeSub(key.account_sub);
                    setValueName(key.account_name);
                    setValueDescription(key.description ?? '');
                    setValueGroupCost(key.expense_acc ?? '');
                    setValueTypeCost(key.expense_type ?? '');
                    setChecked(key.is_shared_expense);
                });
            }
        }
    };
    /* #region  call api data group cost */

    const [dataGroupCost, setDataGroupCost] = React.useState([]);
    const [valueGroupCost, setValueGroupCost] = React.useState('');
    const handleChangeGroupCost = (event) => {
        setValueGroupCost(event.target.value);
    };
    React.useEffect(() => {
        ApiGroupCost(setDataGroupCost);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /* #endregion */

    /* #region  call api data type cost */
    const [dataTypeCost, setDataTypeCost] = React.useState([]);
    const [valueTypeCost, setValueTypeCost] = React.useState('');
    const handleChangeTypeCost = (event) => {
        setValueTypeCost(event.target.value);
    };
    React.useEffect(() => {
        ApiTypeCost(setDataTypeCost);
    }, []);
    /* #endregion */

    const [checked, setChecked] = React.useState(false);
    const handleChangeChecked = (event) => {
        setChecked(event.target.checked);
    };

    const [dialogIsOpenNew, setDialogIsOpenNew] = React.useState(false);
    const [dialogIsOpenUpdate, setDialogIsOpenUpdate] = React.useState(false);
    const [callApiNew, setCallApiNew] = React.useState(false);
    const [callApiUpdate, setCallApiUpdate] = React.useState(false);

    const agreeDialogNew = () => {
        setDialogIsOpenNew(false);
        setCallApiNew(!callApiNew);
    };
    const closeDialogNew = () => {
        setDialogIsOpenNew(false);
        toast.warning(' Cancel create new!');
    };

    /* #region  button new */

    const [valueNewButton, setValueNewButton] = React.useState(false);
    const handleOnClickNew = () => {
        setValueNewButton(true);
        setValueUpdateButton(false);

        setValueCode('');
        setValueCodeMain('');
        setValueCodeSub('');
        setValueName('');
        setValueDescription('');
        setValueGroupCost('');
        setValueTypeCost('');
        setChecked(false);

        setValueReadonly(false);
        setValueReadonlyCode(false);
        setValueDisableSaveButton(false);
    };
    /* #endregion */

    useEffect(() => {
        const asyncApiCreateAccount = async () => {
            const statusCode = await ApiCreateAccount(
                access_token,
                valueCodeMain,
                valueCodeSub,
                valueName,
                valueDescription,
                valueGroupCost,
                valueTypeCost,
                checked,
            );
            if (statusCode) {
                setValueCodeMain('');
                setValueCodeSub('');
                setValueName('');
                setValueDescription('');
                setValueGroupCost('');
                setValueTypeCost('');
                setChecked(false);
                setValueNewButton(false);
                setValueDisableSaveButton(true);
            }
        };
        asyncApiCreateAccount();
        setReloadListAccount(!reloadListAccount);
    }, [callApiNew]);

    const agreeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        setCallApiUpdate(!callApiUpdate);
    };
    const closeDialogUpdate = () => {
        setDialogIsOpenUpdate(false);
        toast.warning(' Cancel create new!');
    };

    /* #region  button update */
    const [valueUpdateButton, setValueUpdateButton] = React.useState(false);
    const handleOnClickUpdate = () => {
        setValueNewButton(false);
        setValueUpdateButton(true);
        setValueReadonly(false);
        setValueReadonlyCode(true);
        setValueDisableSaveButton(false);
    };
    /* #endregion */

    useEffect(() => {
        const asyncApiCreateAccount = async () => {
            const statusCode = await ApiUpdateAccount(
                access_token,
                valueId,
                valueCodeMain,
                valueCodeSub,
                valueName,
                valueDescription,
                valueGroupCost,
                valueTypeCost,
                checked,
            );
            if (statusCode) {
                setValueUpdateButton(false);
                setValueDisableSaveButton(true);
            }
        };
        asyncApiCreateAccount();
        setReloadListAccount(!reloadListAccount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callApiUpdate]);

    const [valueDisableSaveButton, setValueDisableSaveButton] = React.useState(true);
    const handleClickSave = (event) => {
        if (valueCodeMain && valueCodeSub && valueName) {
            if (valueNewButton) {
                setDialogIsOpenNew(true);
            }
            if (valueUpdateButton) {
                setDialogIsOpenUpdate(true);
            }
        } else {
            toast.error(' Empty main code, sub code, name!');
        }
    };
    return (
        <div className="main">
            <ToastContainer />
            <AlertDialog
                title={'Create a new account?'}
                content={
                    <>
                        Main Acc code: {valueCodeMain}
                        <br /> Sub Acc name: {valueCodeSub}
                        <br /> Account name: {valueName}
                        <br /> Description: {valueDescription}
                    </>
                }
                onOpen={dialogIsOpenNew}
                onClose={closeDialogNew}
                onAgree={agreeDialogNew}
            />
            <AlertDialog
                title={'Update account?'}
                content={
                    <>
                        Main Acc code: {valueCodeMain}
                        <br /> Sub Acc name: {valueCodeSub}
                        <br /> Account name: {valueName}
                        <br /> Description: {valueDescription}
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
                    flexGrow: 1,
                    '& .super-app-theme--header': {
                        backgroundColor: '#ffc696',
                    },
                }}
            >
                <Grid container spacing={1}>
                    <Grid xs={12} md={6}>
                        <Item>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    id="search"
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
                                        onClick={() => setReloadListAccount(!reloadListAccount)}
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
                                <h5 style={{ textAlign: 'left', fontWeight: 'bold' }}>Account List</h5>
                                <div style={{ width: '100%' }}>
                                    <DataGrid
                                        rows={dataList}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 3 },
                                            },
                                        }}
                                        pageSizeOptions={[3, 5, 10, 15]}
                                        autoHeight
                                        showCellVerticalBorder
                                        showColumnVerticalBorder
                                        getRowId={(row) => row.account_code}
                                        loading={isLoading}
                                        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
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
                                        <h5
                                            style={{
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: '100%',
                                            }}
                                        >
                                            Account Information
                                        </h5>

                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            // sx={{ display: { xs: 'none', md: 'flex' } }}
                                        >
                                            <LoadingButton
                                                startIcon={<AddBoxIcon />}
                                                variant="contained"
                                                color="success"
                                                onClick={handleOnClickNew}
                                                loading={valueNewButton}
                                                loadingPosition="start"
                                            >
                                                New
                                            </LoadingButton>

                                            <LoadingButton
                                                startIcon={<SystemUpdateAltIcon />}
                                                variant="contained"
                                                color="warning"
                                                onClick={handleOnClickUpdate}
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
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Item sx={{ width: '100%' }}>
                                    <Stack spacing={0}>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="div-h5">
                                                    <h6>Account Code:</h6>
                                                </div>
                                                <TextField
                                                    id="field-code-main"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    value={valueCode}
                                                    placeholder="xxxxx xxx"
                                                    disabled
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="div-h5">
                                                    <h6>Main Account:</h6>
                                                </div>
                                                <TextField
                                                    id="field-code-main"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    value={valueCodeMain}
                                                    onChange={(event) => handleOnChangeValueCodeMain(event)}
                                                    placeholder="xxxxx"
                                                    disabled={valueReadonlyCode}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="div-h5">
                                                    <h6>Sub Account:</h6>
                                                </div>
                                                <TextField
                                                    id="field-code-sub"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    value={valueCodeSub}
                                                    onChange={(event) => handleOnChangeValueCodeSub(event)}
                                                    placeholder="xxx"
                                                    disabled={valueReadonlyCode}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="div-h5">
                                                    <h6>Account Name:</h6>
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
                                                    disabled={valueReadonly}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
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
                                                    disabled={valueReadonly}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid container direction={'row'} xs={12} md={12}>
                                            <Grid xs={12} md={4}>
                                                <Stack direction={'row'} spacing={0}>
                                                    <div className="div-h5" style={{ marginLeft: 8 }}>
                                                        <h6>Expense group:</h6>
                                                    </div>
                                                    <FormControl sx={{ m: 1, maxWidth: 250 }} size="small">
                                                        <Select
                                                            labelId="demo-simple-select-helper-label"
                                                            id="group-cost"
                                                            value={valueGroupCost}
                                                            displayEmpty
                                                            onChange={handleChangeGroupCost}
                                                            sx={{ minWidth: 150 }}
                                                            disabled={valueReadonly}
                                                        >
                                                            {dataGroupCost.map((data) => {
                                                                return (
                                                                    <MenuItem
                                                                        key={data.gr_expense_ids}
                                                                        value={data.code}
                                                                    >
                                                                        {data.name}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} md={4}>
                                                <Stack direction={'row'} spacing={0}>
                                                    <div className="div-h5" style={{ marginLeft: 8 }}>
                                                        <h6>Expense:</h6>
                                                    </div>
                                                    <FormControl sx={{ m: 1, maxWidth: 250 }} size="small">
                                                        <Select
                                                            labelId="demo-simple-select-helper-label"
                                                            id="type-cost"
                                                            value={valueTypeCost}
                                                            displayEmpty
                                                            onChange={handleChangeTypeCost}
                                                            sx={{ minWidth: 150 }}
                                                            disabled={valueReadonly}
                                                        >
                                                            {dataTypeCost.map((data) => {
                                                                return (
                                                                    <MenuItem
                                                                        key={data.type_expense_id}
                                                                        value={data.code}
                                                                    >
                                                                        {data.name}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </Stack>
                                            </Grid>
                                            <Grid
                                                xs={12}
                                                md={4}
                                                sx={{ display: 'flex', marginTop: 0, alignItems: 'center' }}
                                            >
                                                <Stack direction={'row'} spacing={0}>
                                                    <div className="div-h5" style={{ marginLeft: 8 }}>
                                                        <h6>General Account:</h6>
                                                    </div>
                                                    <Checkbox
                                                        checked={checked}
                                                        onChange={handleChangeChecked}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        color="success"
                                                        size="medium"
                                                        disabled={valueReadonly}
                                                    />
                                                </Stack>
                                            </Grid>
                                        </Grid>
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
