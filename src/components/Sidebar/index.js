import React from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import logo from '~/assets/images/logo.png';
import { Link } from 'react-router-dom';
import { colors } from '@mui/material';

const cx = classNames.bind(styles);
const NavHeader = styled.div`
    display: ${(props) => (props.expanded ? 'block' : 'none')};
    white-space: nowrap;
    background-color: #db3d44;
    color: #fff;

    > * {
        color: inherit;
        background-color: inherit;
    }
`;

const NavTitle = styled.div`
    font-size: 2em;
    line-height: 20px;
    padding: 10px 0;
`;

// height: 20px + 4px = 24px;
const NavSubTitle = styled.div`
    font-size: 1em;
    line-height: 20px;
    padding-bottom: 4px;
`;
const NavInfoPane = styled.div`
    float: left;
    width: 100%;
    padding: 10px 20px;
    ${'' /* background-color: #eee; */}
`;

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            unit: '1',
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
                <NavHeader expanded={this.state.isVisible}>
                    <NavTitle>
                        <div>
                            <Link to={'/'}>
                                <img className={cx('logo')} src={logo} alt="japfa" />
                            </Link>
                        </div>
                    </NavTitle>
                </NavHeader>
                {this.state.isVisible && (
                    <NavInfoPane>
                        <div>
                            <Form.Select
                                aria-label="Default select example"
                                onChange={(event) => {
                                    this.setState({ unit: event.target.value });
                                }}
                            >
                                <option value="1">Heo</option>
                                <option value="2">Gà</option>
                            </Form.Select>
                        </div>
                    </NavInfoPane>
                )}
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
                            <i class="fa fa-gear" style={{ fontSize: '1.5em', color: 'black' }} aria-hidden="false"></i>
                        </NavIcon>
                        <NavText>
                            <a style={{ color: 'black' }}>Cài đặt</a>
                        </NavText>
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
