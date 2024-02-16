import React from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isVisible } from '@testing-library/user-event/dist/utils';
import { Navbar, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '~/assets/images/logo.png';
import { Form } from 'react-bootstrap';

const cx = classNames.bind(styles);
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
    }

    render() {
        return (
            <SideNav className={cx('sidenav')} expanded={this.state.isVisible}>
                <SideNav.Toggle
                    onClick={() => {
                        this.setState({ isVisible: !this.state.isVisible });
                    }}
                ></SideNav.Toggle>
                <SideNav.Nav defaultSelected="/">
                    <NavItem eventKey="Unit">
                        <NavIcon>
                            <i className="fa fa-flag" style={{ fontSize: '1.5em' }} />
                        </NavIcon>
                        <NavText>Unit: </NavText>
                    </NavItem>

                    <NavItem
                        eventKey="Setting"
                        // onClick={
                        //     isVisible
                        //         ? () => {
                        //               this.setState({ isVisible: false });
                        //           }
                        //         : () => {
                        //               this.setState({ isVisible: true });
                        //           }
                        // }
                    >
                        <NavIcon>
                            <i class="fa fa-gear" style={{ fontSize: '1.5em' }} aria-hidden="false"></i>
                        </NavIcon>
                        <NavText>Cài đặt</NavText>
                        <NavItem eventKey="Setting/groupaccount" onSelect={() => this.props.navigate('/following')}>
                            <NavText>Nhóm tài khoản</NavText>
                        </NavItem>
                        <NavItem eventKey="Setting/account">
                            <NavText>Tài khoản</NavText>
                        </NavItem>
                    </NavItem>
                    <NavItem eventKey="statistics" onSelect={() => this.props.navigate('/following')}>
                        <NavIcon>
                            <i className="fa fa-bar-chart" style={{ fontSize: '1.5em' }} />
                        </NavIcon>
                        <NavText>Bugs statistics</NavText>
                    </NavItem>
                    <NavItem eventKey="Bugs types" onSelect={() => this.props.navigate('/following')}>
                        <NavIcon>
                            <i className="fa fa-bug" style={{ fontSize: '1.5em' }} />
                        </NavIcon>
                        <NavText>Bugs types</NavText>
                    </NavItem>
                    <NavItem eventKey="timeline" onSelect={() => this.props.navigate('/timeline')}>
                        <NavIcon>
                            <i className="fa fa-line-chart" style={{ fontSize: '1.5em' }} />
                        </NavIcon>
                        <NavText>Bugs timeline</NavText>
                    </NavItem>
                    <NavItem eventKey="Bugs area">
                        <NavIcon>
                            <i className="fa fa-area-chart" style={{ fontSize: '1.5em' }} />
                        </NavIcon>
                        <NavText>Bugs area</NavText>
                        <NavItem eventKey="Bugs area/linechart" onSelect={() => this.props.navigate('/following')}>
                            <NavIcon>
                                <i className="fa fa-area-chart" style={{ fontSize: '1em' }} />
                            </NavIcon>
                            <NavText>Line Chart</NavText>
                        </NavItem>
                        <NavItem eventKey="Bugs area/barchart">
                            <NavText>Bar Chart</NavText>
                        </NavItem>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
        );
    }
}

export default Sidebar;
