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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
const singleSelect = ['CH NVT', 'SH BP'];
const columns = [
    { field: 'id', headerName: 'No.', width: 100 },
    {
        field: 'username',
        headerName: 'Document Code',
        width: 300,
        editable: true,
        type: 'singleSelect',
        valueOptions: singleSelect,
    },
    { field: 'name', headerName: 'Date Added', width: 300 },
    {
        field: 'phone',
        headerName: 'Content',
        // type: 'number',
        width: 300,
    },
    { field: 'email', headerName: 'Cost Center', width: 300 },
];

function CostAllocation({ title }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);
    console.log(data);
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    let newDate = new Date();
    const [value, setValue] = React.useState(dayjs(newDate));
    let number = 1234.56789;
    const [valueTab, setValueTab] = React.useState('Manage Accounting Entries');

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    const [checked, setChecked] = React.useState(false);

    const handleChangeChecked = (event) => {
        setChecked(event.target.checked);
    };
    return (
        <div className="main">
            <div role="presentation" onClick={''}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
            </div>
            <Box sx={{ width: '100%', typography: 'body' }}>
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
                                        />

                                        <LoadingButton
                                            loading
                                            loadingPosition="end"
                                            variant="contained"
                                            color="warning"
                                            endIcon={<LockIcon />}
                                        >
                                            Search
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
                                                rows={data}
                                                columns={columns}
                                                initialState={{
                                                    pagination: {
                                                        paginationModel: { page: 0, pageSize: 3 },
                                                    },
                                                }}
                                                pageSizeOptions={[3, 5, 10, 15]}
                                                autoHeight
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

                                        <Button variant="contained" color="warning">
                                            New
                                        </Button>
                                        <Button variant="contained" color="warning">
                                            Save
                                        </Button>
                                        <LoadingButton
                                            // loading
                                            loadingPosition="start"
                                            variant="contained"
                                            color="warning"
                                            startIcon={<LockIcon />}
                                        >
                                            Delete
                                        </LoadingButton>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                    <Item>
                                        <Grid container xs={12} md={12} spacing={1}>
                                            <Grid Item xs={12} md={6}>
                                                <Stack
                                                    direction={'row'}
                                                    spacing={2}
                                                    alignItems={'center'}
                                                    justifyContent={'flex-start'}
                                                >
                                                    <h6 style={{ width: '40%' }}>CA code:</h6>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="name..."
                                                    />
                                                </Stack>
                                            </Grid>

                                            <Grid Item xs={12} md={6}>
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
                                                            <DemoContainer
                                                                components={['DatePicker']}
                                                                sx={{ paddingTop: 0 }}
                                                            >
                                                                <DatePicker
                                                                    // label={'"month" and "year"'}
                                                                    // views={['month', 'year']}
                                                                    value={value}
                                                                    // sx={{ width: 300 }}
                                                                    slotProps={{
                                                                        textField: { size: 'small' },
                                                                    }}
                                                                    formatDensity="spacious"
                                                                    format="DD/MM/YYYY"
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                </Stack>
                                            </Grid>

                                            <Grid Item xs={12} md={6}>
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

                                            <Grid Item xs={12} md={6}>
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
                                                            <DemoContainer
                                                                components={['DatePicker']}
                                                                sx={{ paddingTop: 0 }}
                                                            >
                                                                <DatePicker
                                                                    // label={'"month" and "year"'}
                                                                    // views={['month', 'year']}
                                                                    value={value}
                                                                    // sx={{ width: 300 }}
                                                                    slotProps={{
                                                                        textField: { size: 'small' },
                                                                    }}
                                                                    formatDensity="spacious"
                                                                    format="DD/MM/YYYY"
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                </Stack>
                                            </Grid>
                                            <Grid Item xs={12} md={6}>
                                                <Stack
                                                    direction={'row'}
                                                    spacing={2}
                                                    alignItems={'center'}
                                                    justifyContent={'flex-start'}
                                                >
                                                    <h6 style={{ width: '40%' }}>Content:</h6>
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
                                            <Grid Item xs={12} md={6}>
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
                                                                id="demo-simple-select-helper"
                                                                value={age}
                                                                // label="Age"
                                                                displayEmpty
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value={10}>Group 1</MenuItem>
                                                                <MenuItem value={20}>Group 2</MenuItem>
                                                                <MenuItem value={30}>Group 3</MenuItem>
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
                                                                id="demo-simple-select-helper"
                                                                value={age}
                                                                // label="Age"
                                                                displayEmpty
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value={10}>Group 1</MenuItem>
                                                                <MenuItem value={20}>Group 2</MenuItem>
                                                                <MenuItem value={30}>Group 3</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid Item xs={12} md={6}>
                                                <Stack
                                                    direction={'row'}
                                                    spacing={2}
                                                    alignItems={'center'}
                                                    justifyContent={'flex-start'}
                                                >
                                                    <h6 style={{ width: '40%' }}>in debt:</h6>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="name..."
                                                    />
                                                </Stack>
                                            </Grid>
                                            <Grid Item xs={12} md={6}>
                                                <Stack
                                                    direction={'row'}
                                                    spacing={2}
                                                    alignItems={'center'}
                                                    justifyContent={'flex-start'}
                                                >
                                                    <h6 style={{ width: '40%' }}>available:</h6>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="name..."
                                                    />
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
                                        <Button variant="contained" color="primary">
                                            Import
                                        </Button>

                                        <Button variant="contained" color="success">
                                            Save
                                        </Button>
                                        <Button variant="contained" color="warning">
                                            Update
                                        </Button>
                                        <Button variant="contained" color="error">
                                            Delete
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} md={12} sx={{ width: '100%' }}>
                                    <Item>
                                        <Stack spacing={0}>
                                            <div style={{ width: '100%' }}>
                                                <DataGrid
                                                    rows={data}
                                                    columns={columns}
                                                    initialState={{
                                                        pagination: {
                                                            paginationModel: { page: 0, pageSize: 3 },
                                                        },
                                                    }}
                                                    pageSizeOptions={[3, 5, 10, 15]}
                                                    autoHeight
                                                />
                                            </div>
                                        </Stack>
                                    </Item>
                                </Grid>
                                <Grid Item xs={12} md={6}>
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
