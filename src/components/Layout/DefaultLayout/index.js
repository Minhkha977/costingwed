import Header from '~/components/Header';
import Sidebar from '~/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import styles from '~/components/Sidebar/Sidebar.module.scss';
import classNames from 'classnames/bind';
import { styled, alpha, useTheme } from '@mui/material/styles';

const cx = classNames.bind(styles);
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));
function DefaultLayout({ children, title }) {
    const navigate = useNavigate();
    return (
        <div>
            <Header title={title} />
            <DrawerHeader />
            {/* <Sidebar navigate={navigate} /> */}
            <div className={cx('container')}>{children}</div>
        </div>
    );
}

export default DefaultLayout;
