import Home from '~/Pages/Home';
import Account from '~/Pages/Setting/Account';
import AccountGroup from '~/Pages/Setting/AccountGroup';
import AccountingEntry from '~/Pages/Accountant/AccountingEntry';
import CostAllocation from '~/Pages/Accountant/CostAllocation';
import CloseAccountingPeriod from '~/Pages/Accountant/CloseAccountingPeriod';
import OpenAccountingPeriod from '~/Pages/Accountant/OpenAccountingPeriod';
import { HeaderLayoutOnly } from '~/components/Layout';
import Report from '~/Pages/Report';
import { useTranslation } from 'react-i18next';

export const publicRoutes = [
    { path: '/', component: Home, title: 'Dashboard' },
    { path: '/accountgroup', component: AccountGroup, title: 'menu-acc-group' },
    { path: '/account', component: Account, title: 'menu-acc' },
    { path: '/accountingentry', component: AccountingEntry, title: 'menu-entry' },
    { path: '/costallocation', component: CostAllocation, title: 'menu-allocation' },
    { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'menu-close-period' },
    { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'menu-open-period' },
    { path: '/report', component: Report, title: 'menu-report-costing' },
    // { path: '/following', component: Following, layout: HeaderLayoutOnly },
    // { path: '/login', component: Login, layout: null },
];

export const settingRoutes = [
    { path: '/accountgroup', component: AccountGroup, title: 'menu-acc-group' },
    { path: '/account', component: Account, title: 'menu-acc' },
];
export const accountantRoutes = [
    { path: '/accountingentry', component: AccountingEntry, title: 'menu-entry' },
    { path: '/costallocation', component: CostAllocation, title: 'menu-allocation' },
    { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'menu-close-period' },
    { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'menu-open-period' },
];
export const reportRoutes = [{ path: '/report', component: Report, title: 'menu-report-costing' }];
