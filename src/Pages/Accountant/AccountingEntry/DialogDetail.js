import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Input, Tag, Space } from 'antd';
import Form from 'react-bootstrap/Form';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import { InputNumber } from 'antd';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import OnMultiKeyEvent from '~/components/Event/OnMultiKeyEvent';
import { toast } from 'react-toastify';

export default function DialogDetail({
    isNew,
    onOpen,
    onClose,
    dataList,
    setDataListAccountEntryDetail,
    dataUpdate,
    setValueDescriptionAe,
    description,
}) {
    const listCostCenter = useSelector((state) => state.FetchApi.listData_CostCenter);
    const listAccountGroup = useSelector((state) => state.FetchApi.listData_Account);
    const [valueCostCenter, setValueCostCenter] = React.useState('');
    const [valueAccountCode, setValueAccountCode] = React.useState(null);
    const [valueCredit, setValueCredit] = React.useState(0);
    const [valueDebit, setValueDebit] = React.useState(0);
    const [valueAmount, setValueAmount] = React.useState(0);
    const [valueDescription, setValueDescription] = React.useState(description);
    const [valueId, setValueId] = React.useState(1);
    const [valueSelectAmount, setValueSelectAmount] = React.useState('-');

    React.useEffect(() => {
        const data = dataList
            .filter((data) => data.is_delete_item !== true)
            .sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
        const Count = data[data.length - 1];
        setValueId(Count ? Count.id + 1 : 1);
    }, [dataList]);
    // console.log('----data', dataUpdate);
    React.useEffect(() => {
        if (!isNew) {
            const handleUpdate = () => {
                if (dataUpdate.debit_amount !== 0) {
                    setValueSelectAmount('-');
                    setValueAmount(dataUpdate.debit_amount);
                }
                if (dataUpdate.credit_amount !== 0) {
                    setValueSelectAmount('+');
                    setValueAmount(dataUpdate.credit_amount);
                }
                const acct = listAccountGroup.filter((data) => data.account_code === dataUpdate.acc_code);
                setValueId(dataUpdate.id);
                setValueCostCenter(dataUpdate.cost_center);
                setValueAccountCode(acct[0]);
                // setValueDebit(dataUpdate.debit_amount);
                // setValueCredit(dataUpdate.credit_amount);
                setValueDescription(dataUpdate.description);
            };
            handleUpdate();
        }
    }, []);

    const handleClickSave = () => {
        if (isNew) {
            if (valueAccountCode && valueDescription) {
                setDataListAccountEntryDetail((oldRows) => [
                    ...oldRows,
                    {
                        id: valueId,
                        detail_ids: valueId,
                        acc_code: valueAccountCode.account_code,
                        description: valueDescription,
                        cost_center: valueCostCenter,
                        credit_amount: valueSelectAmount === '+' ? valueAmount : 0,
                        debit_amount: valueSelectAmount === '-' ? valueAmount : 0,
                        // credit_amount: valueCredit,
                        // debit_amount: valueDebit,
                        isactive: true,
                        is_new_item: true,
                        isNew: true,
                        is_delete_item: false,
                    },
                ]);
                setValueDescriptionAe((oldDesc) => (oldDesc ? oldDesc : valueDescription));
                onClose();
            } else {
                toast.warn('Empty account code | description!');
            }
        } else {
            const updatedRow = {
                ...dataUpdate,
                acc_code: valueAccountCode.account_code,
                description: valueDescription,
                cost_center: valueCostCenter,
                credit_amount: valueSelectAmount === '+' ? valueAmount : 0,
                debit_amount: valueSelectAmount === '-' ? valueAmount : 0,
                // credit_amount: valueCredit,
                // debit_amount: valueDebit,
            };
            setDataListAccountEntryDetail((oldRows) =>
                oldRows.map((row) => (row.detail_ids === dataUpdate.detail_ids ? updatedRow : row)),
            );
            onClose();
        }
    };

    // console.log('>>>>cost', valueCostCenter);
    // console.log('acct', valueAccountCode);
    // console.log('credit', valueCredit);
    // console.log('debit', valueDebit);
    // console.log('descrip', valueDescription);

    OnMultiKeyEvent(handleClickSave, 's');

    return (
        <React.Fragment>
            <Dialog open={onOpen} onClose={onClose}>
                <DialogTitle sx={{ background: '#ffc696', marginBottom: 2 }}>Detail No. {valueId}</DialogTitle>
                <DialogContent>
                    <Box display="flex" alignItems="center">
                        <Grid container spacing={1} width={400}>
                            <Stack direction={'column'} spacing={1} width={'100%'} justifyContent={'center'}>
                                <div>Cost center</div>
                                <Select
                                    autoFocus
                                    size="small"
                                    value={valueCostCenter}
                                    onChange={(e) => setValueCostCenter(e.target.value)}
                                >
                                    {listCostCenter &&
                                        listCostCenter.map((data) => {
                                            return (
                                                <MenuItem key={data.code} value={data.code}>
                                                    {data.name}
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                                <div>
                                    <Tag color="red">*</Tag>
                                    Account code&nbsp;
                                </div>

                                <Autocomplete
                                    fullWidth
                                    // componentsProps={{
                                    //     popper: {
                                    //         style: { width: 'fit-content' },
                                    //     },
                                    // }}
                                    size="small"
                                    freeSolo
                                    value={valueAccountCode}
                                    onChange={(event, newValue) => {
                                        // setValueAccountCode(newValue ? newValue.account_code : '');
                                        setValueAccountCode(newValue);
                                    }}
                                    options={listAccountGroup}
                                    getOptionLabel={(option) =>
                                        `${option.account_code_display ?? ''} - ${option.account_name ?? ''}`
                                    }
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                {/* <div style={{ color: 'red' }}>
                                    <Tag color="red">*</Tag>
                                    Debit &nbsp;
                                </div>
                                <InputNumber
                                    // prefix="-₫"
                                    style={{ width: '100%' }}
                                    size="large"
                                    formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$-+₫\s?|(,*)/g, '')}
                                    value={valueDebit}
                                    onChange={(e) => setValueDebit(e)}
                                /> */}
                                <div>
                                    <Tag color="red">*</Tag>
                                    Amount
                                </div>
                                <Stack direction={'row'} spacing={0.5}>
                                    <Select
                                        size="small"
                                        value={valueSelectAmount}
                                        onChange={(e) => setValueSelectAmount(e.target.value)}
                                        sx={{ width: 100 }}
                                        variant="outlined"
                                    >
                                        <MenuItem key={1} value={'-'} sx={{ color: 'red' }}>
                                            Debit
                                        </MenuItem>
                                        <MenuItem key={2} value={'+'} sx={{ color: 'green' }}>
                                            Credit
                                        </MenuItem>
                                    </Select>
                                    <InputNumber
                                        // prefix="+₫"
                                        style={{ width: '100%' }}
                                        size="large"
                                        formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$-+₫\s?|(,*)/g, '')}
                                        value={valueAmount}
                                        onChange={(e) => setValueAmount(e)}
                                    />
                                </Stack>

                                <div>
                                    <Tag color="red">*</Tag>
                                    Description &nbsp;
                                </div>
                                <Input.TextArea
                                    showCount
                                    maxLength={250}
                                    rows={3}
                                    value={valueDescription}
                                    onChange={(e) => setValueDescription(e.target.value)}
                                />
                            </Stack>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        startIcon={<SaveAltIcon />}
                        variant="contained"
                        type="submit"
                        onClick={handleClickSave}
                        fullWidth
                    >
                        <u>S</u>ave
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
