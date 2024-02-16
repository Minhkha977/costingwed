import styles from './Header.module.scss';
import classNames from 'classnames/bind';

import logo from '~/assets/images/logo.png';
import React from 'react';
import { Form } from 'react-bootstrap';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const cx = classNames.bind(styles);

function Header({ title }) {
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <header style={{ backgroundColor: 'orange' }} className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div></div>
                <div className={cx('title')}>
                    <h4>{title}</h4>
                </div>
                <div>background</div>
            </div>
        </header>
    );
}

export default Header;
