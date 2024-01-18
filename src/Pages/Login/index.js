import styles from '~/Pages/Login/Login.module.scss';
import classNames from 'classnames/bind';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
//import Button from 'react-bootstrap/Button';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import loginServices from '~/Services/Login';

const cx = classNames.bind(styles);

function Login() {
    const [userName, setUserName] = useState('admin');
    const [passWord, setPassWord] = useState('123');
    const handleOnChangeLogin = (name, pass) => {
        if (name != null) {
            setUserName(name);
        }
        if (pass != null) {
            setPassWord(pass);
        }
    };
    const handleOnClickLogin = () => {
        loginServices(userName, passWord);
        console.log({ userName, passWord });
    };

    return (
        <div className={cx('login-background')}>
            <div className={cx('login-container')}>
                <div className={cx('login-content')}>
                    <div className={cx('login-title')}>Login Page</div>
                    <Form>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter User Name"
                                value={userName}
                                onChange={(event) => handleOnChangeLogin(event.target.value, null)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={passWord}
                                onChange={(event) => handleOnChangeLogin(null, event.target.value)}
                            />
                        </Form.Group>
                        <Button
                            className={cx('login-button')}
                            variant="contained"
                            endIcon={<LoginIcon />}
                            onClick={(event) => handleOnClickLogin(event)}
                        >
                            Login
                        </Button>
                    </Form>
                    <div className="col-12 text-center mt-4">
                        <span className={cx('login-with')}>Or Login With</span>
                    </div>
                    <button className={cx('social-login')}>
                        <FontAwesomeIcon icon="fa-brands fa-google-plus" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
