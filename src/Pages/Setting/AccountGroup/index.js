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
import './AccountGroupStyles.css';

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
    { field: 'username', headerName: 'Group Code', width: 300 },
    { field: 'name', headerName: 'Group Name', width: 300 },
    {
        field: 'phone',
        headerName: 'Description',
        // type: 'number',
        width: 400,
    },
];

function Account({ title }) {
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
                <Grid container direction={'row'} spacing={1}>
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
                                <h4 style={{ textAlign: 'left', fontWeight: 'bold' }}>Account Group List</h4>
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
                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                <Stack>
                                    <h4 style={{ fontWeight: 'bold' }}>Account Group Information</h4>
                                </Stack>
                                <Stack
                                    direction={'row'}
                                    spacing={2}
                                    justifyContent={'flex-end'}
                                    sx={{ width: { sm: '50%', lg: '70%' } }}
                                >
                                    <Button variant="contained">New</Button>
                                    <Button variant="contained">Update</Button>
                                </Stack>
                            </Stack>
                            <Grid xs={12} md={12}>
                                <Item>
                                    <Stack spacing={3}>
                                        <Stack direction={'row'} spacing={0}>
                                            <div className="div-h5">
                                                <h5>Group Code:</h5>
                                            </div>
                                            <Form.Control type="text" placeholder="code..." />
                                        </Stack>
                                        <Stack direction={'row'} spacing={0}>
                                            <div className="div-h5">
                                                <h5>Group Name:</h5>
                                            </div>
                                            <Form.Control type="text" placeholder="name..." />
                                        </Stack>
                                        <Stack direction={'row'} spacing={0}>
                                            <div className="div-h5">
                                                <h5>Description:</h5>
                                            </div>
                                            <Form.Control type="text" as="textarea" rows={2} placeholder="..." />
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
