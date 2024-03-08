import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function AlertDialog({ title, content, onOpen, onClose, onAgree }) {
    return (
        <React.Fragment>
            <Dialog
                open={onOpen}
                // onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button startIcon={<HighlightOffIcon />} variant="contained" color="error" onClick={onClose}>
                        Disagree
                    </Button>
                    <Button startIcon={<TaskAltIcon />} variant="contained" color="success" onClick={onAgree}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
