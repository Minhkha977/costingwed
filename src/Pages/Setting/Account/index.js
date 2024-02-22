import * as React from 'react';
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
import './AccountStyles.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ed6c02',
        // backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const columns = [
    { field: 'id', headerName: 'No.', width: 100 },
    { field: 'username', headerName: 'Account Code', width: 300 },
    { field: 'name', headerName: 'Account Name', width: 300 },
    {
        field: 'phone',
        headerName: 'Cost Group',
        // type: 'number',
        width: 300,
    },
    { field: 'email', headerName: 'Cost Type', width: 300 },
    {
        field: 'phone',
        headerName: 'General Account',
        // type: 'number',
        width: 300,
    },
];
function Account({ title }) {
    const [checked, setChecked] = React.useState(false);

    const handleChangeChecked = (event) => {
        setChecked(event.target.checked);
    };
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
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
    return (
        <div className="main">
            <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
            </div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                    <Grid xs={12} md={6}>
                        <Item>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    fullWidth
                                    label="Search"
                                    size="small"
                                />
                                <Button variant="contained">Search</Button>
                            </Stack>
                        </Item>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Item>
                            <Stack spacing={0}>
                                <h4 style={{ textAlign: 'left', fontWeight: 'bold' }}>Account List</h4>
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
                                {/* <TableContainer component={Paper} sx={{ maxHeight: 400, tableLayout: 'fixed' }}>
                                    <Table sx={{ minWidth: 700, tableLayout: 'fixed' }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell width={'10%'}>No.</StyledTableCell>
                                                <StyledTableCell align="right">Group Code</StyledTableCell>
                                                <StyledTableCell align="right">Group Name</StyledTableCell>
                                                <StyledTableCell align="right">Description</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody sx={{ maxHeight: 300 }}>
                                            {data.map((row) => (
                                                <StyledTableRow key={row.id} hover={true}>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.id}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{row.username}</StyledTableCell>
                                                    <StyledTableCell align="right">{row.name}</StyledTableCell>
                                                    <StyledTableCell align="right">{row.company.bs}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer> */}
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
                                            <h4
                                                style={{
                                                    fontWeight: 'bold',
                                                    textAlign: 'left',
                                                    width: '100%',
                                                }}
                                            >
                                                Account Information
                                            </h4>
                                        </>

                                        <Button variant="contained">New</Button>

                                        <Button variant="contained">Update</Button>
                                    </Stack>
                                </Grid>
                                <Item sx={{ width: '100%' }}>
                                    <Stack spacing={0}>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="div-h5">
                                                    <h5>Account Code:</h5>
                                                </div>
                                                <Form.Control type="text" placeholder="code..." />
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="div-h5">
                                                    <h5>Account Name:</h5>
                                                </div>
                                                <Form.Control type="text" placeholder="name..." />
                                            </Stack>
                                        </Grid>
                                        <Grid xs={12} md={12}>
                                            <Stack direction={'row'} spacing={2}>
                                                <div className="div-h5">
                                                    <h5>Description:</h5>
                                                </div>
                                                <Form.Control type="text" as="textarea" rows={2} placeholder="..." />
                                            </Stack>
                                        </Grid>
                                        <Grid container direction={'row'} xs={12} md={12}>
                                            <Grid Item xs={12} md={6}>
                                                <Stack direction={'row'} spacing={0}>
                                                    <div className="div-h5" style={{ marginLeft: 8 }}>
                                                        <h5>Group Cost:</h5>
                                                    </div>
                                                    <FormControl sx={{ m: 1, maxWidth: 250 }} size="small">
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
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Stack direction={'row'} spacing={0}>
                                                    <div className="div-h5" style={{ marginLeft: 8 }}>
                                                        <h5>Type Cost:</h5>
                                                    </div>
                                                    <FormControl sx={{ m: 1, maxWidth: 250 }} size="small">
                                                        <Select
                                                            labelId="demo-simple-select-helper-label"
                                                            id="demo-simple-select-helper"
                                                            value={age}
                                                            // label="Age"
                                                            displayEmpty
                                                            onChange={handleChange}
                                                        >
                                                            <MenuItem value={10}>Type 1</MenuItem>
                                                            <MenuItem value={20}>Type 2</MenuItem>
                                                            <MenuItem value={30}>Type 3</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                        <Stack direction={'row'} spacing={0} style={{ marginTop: 0 }}>
                                            <div className="div-h5" style={{ marginLeft: 8 }}>
                                                <h5>General Account:</h5>
                                            </div>
                                            <Checkbox
                                                checked={checked}
                                                onChange={handleChangeChecked}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                color="success"
                                                size="medium"
                                            />
                                        </Stack>
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
