import Header from '~/components/Layout/component/Header';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import styles from '~/components/Layout/DefaultLayout/Sidebar/Sidebar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function DefaultLayout({ children, title }) {
    const navigate = useNavigate();
    return (
        <div>
            <Header title={title} />
            <Sidebar navigate={navigate} />
            <div className={cx('container')}>{children}</div>
        </div>
    );
}

export default DefaultLayout;
