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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function DialogDetailAllocation({ isNew, onOpen, onClose, dataList, dataUpdate, setDataListDetail }) {
    const [valueDocDate, setValueDocDate] = React.useState(null);
    const [valueDescription, setValueDescription] = React.useState(null);
    const [valueAmount, setValueAmount] = React.useState(0);
    const [valueStatus, setValueStatus] = React.useState(null);
    const [valueEntryCode, setValueEntryCode] = React.useState(null);
    const [valueId, setValueId] = React.useState(1);

    React.useEffect(() => {
        const data = dataList
            .filter((data) => data.is_delete_item !== true)
            .sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
        const Count = data[data.length - 1];
        setValueId(Count ? Count.id + 1 : 1);
    }, [dataList]);

    React.useEffect(() => {
        if (!isNew) {
            const handleUpdate = () => {
                setValueDocDate(dayjs(dataUpdate.doc_date));
                setValueDescription(dataUpdate.description);
                setValueAmount(dataUpdate.amount);
                setValueStatus(dataUpdate.status_display);
                setValueEntryCode(dataUpdate.entry_doc_code);
            };
            handleUpdate();
        }
    }, []);

    const handleClickSave = () => {
        if (isNew) {
            if (valueDocDate && valueDescription && valueAmount !== 0) {
                setDataListDetail((oldRows) => [
                    ...oldRows,
                    {
                        id: valueId,
                        detail_ids: valueId,
                        doc_date: dayjs(valueDocDate).utc(true),
                        description: valueDescription,
                        amount: valueAmount,
                        isactive: true,
                        updated_user: localStorage.getItem('UserName'),
                        updated_date: new Date(),
                        is_new_item: true,
                        isNew: true,
                    },
                ]);
                onClose();
            } else {
                toast.warn('Empty doc date | description | amount!');
            }
        } else {
            const updatedRow = {
                ...dataUpdate,
                doc_date: dayjs(valueDocDate).utc(true),
                description: valueDescription,
                amount: valueAmount,
            };
            setDataListDetail((oldRows) =>
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
                <DialogTitle sx={{ background: '#ffc696' }}>Detail No. {valueId}</DialogTitle>
                <DialogContent>
                    <Box display="flex" alignItems="center">
                        <Grid container spacing={1} width={400}>
                            <Stack direction={'column'} spacing={1} width={'100%'} justifyContent={'center'}>
                                <div style={{ marginTop: 16 }}>
                                    <Tag color="red">*</Tag>Doc date
                                </div>
                                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                                    <DatePicker
                                        autoFocus
                                        // label={'"month" and "year"'}
                                        // views={['month', 'year']}
                                        value={valueDocDate}
                                        onChange={(e) => setValueDocDate(e)}
                                        // sx={{ width: 300 }}
                                        slotProps={{
                                            textField: { size: 'small' },
                                        }}
                                        formatDensity="spacious"
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>

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
                                <div>
                                    <Tag color="red">*</Tag>
                                    Amount
                                </div>
                                <InputNumber
                                    // prefix="+₫"
                                    style={{ width: '100%' }}
                                    size="large"
                                    formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$-+₫\s?|(,*)/g, '')}
                                    value={valueAmount}
                                    onChange={(e) => setValueAmount(e)}
                                />
                                <div>Status</div>
                                <TextField variant="outlined" fullWidth size="small" value={valueStatus} disabled />
                                <div>Entry code</div>
                                <TextField variant="outlined" fullWidth size="small" value={valueEntryCode} disabled />
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
