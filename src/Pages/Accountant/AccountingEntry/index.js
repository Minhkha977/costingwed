import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    direction: 'row',
    color: theme.palette.text.secondary,
}));
function AccountingEntry({ title }) {
    return (
        <div className="main">
            <div role="presentation" onClick={''}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/"></Link>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
            </div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container direction={'row'} spacing={1}>
                    <Grid xs={12} md={12}>
                        <Item>
                            <Grid container xs={12} md={12}>
                                <Grid Item xs={12} md={5}>
                                    <Item>
                                        <div className="div-h5">
                                            <h5>Account Name:</h5>
                                        </div>
                                    </Item>
                                </Grid>
                                <Grid Item xs={12} md={7}>
                                    <Item>
                                        <h1 style={{ width: 500 }}>a</h1>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default AccountingEntry;
