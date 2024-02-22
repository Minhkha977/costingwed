import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/Routes';
import { DefaultLayout } from './components/Layout';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, MsalProvider } from '@azure/msal-react';
import { loginRequest } from './Config';
import Login from './Pages/Login';
import { useEffect } from 'react';
import '~/AppStyles.css';

const WrapperView = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    useEffect(() => {
        // if (activeAccount) window.location.replace('/login');
        return () => {};
    }, []);
    console.log(activeAccount);
    const handleRedirect = () => {
        instance.loginRedirect({ ...loginRequest, prompt: 'create' }).catch((error) => console.log(error));
    };
    return (
        <Router>
            <div className="App">
                <UnauthenticatedTemplate>
                    <Routes>
                        <Route path="/" Component={Login}></Route>
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
