import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import logo from '~/assets/images/logo.png';
import { Navbar } from 'react-bootstrap';
import React from 'react';

const cx = classNames.bind(styles);
function Header({ title }) {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={'/'}>
                    <img className={cx('logo')} src={logo} alt="japfa" />
                </Link>
                <div className={cx('title')}>
                    <h4>{title}</h4>
                </div>
                <div>
                    <h4>icon account</h4>
                </div>
            </div>
        </header>
    );
}

export default Header;
