import { Fragment } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/Routes';
import { DefaultLayout } from './components/Layout';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, MsalProvider } from '@azure/msal-react';
import { loginRequest } from './Config';
import Login from './Pages/Login';
import { useEffect } from 'react';
import '~/AppStyles.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPeriod, fetchApiToken } from '~/Redux/FetchApi/fetchApiMaster';

const WrapperView = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    var dispatch = useDispatch();
    const unitcode = useSelector((state) => state.Actions.unitcode);
    useEffect(() => {
        dispatch(fetchPeriod(unitcode));
    }, []);
    useEffect(() => {
        if (activeAccount) {
            dispatch(fetchApiToken(activeAccount ? activeAccount.username : ''));
        }
    }, [activeAccount]);
    return (
        <Router>
            <div className="App">
                <UnauthenticatedTemplate>
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                    </Routes>
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            let Layout = DefaultLayout;
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }

                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact
                                    element={
                                        <Layout title={route.title}>
                                            <Page title={route.title} />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </AuthenticatedTemplate>
            </div>
        </Router>
    );
};
const App = ({ msalInstance }) => {
    return (
        <MsalProvider instance={msalInstance}>
            <WrapperView />
        </MsalProvider>
    );
};
export default App;
