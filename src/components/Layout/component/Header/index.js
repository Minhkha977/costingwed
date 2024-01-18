import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import logo from '~/assets/images/logo.png';

const cx = classNames.bind(styles);
function Header() {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <img className={cx('logo')} src={logo} alt="japfa" />
                <div className={cx('title')}>
                    <h1>Title của header</h1>
                </div>
                <div>
                    <h1>icon account</h1>
                </div>
            </div>
        </header>
    );
}

export default Header;
