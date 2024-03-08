import Home from '~/Pages/Home';
import Account from '~/Pages/Setting/Account';
import AccountGroup from '~/Pages/Setting/AccountGroup';
import AccountingEntry from '~/Pages/Accountant/AccountingEntry';
import CostAllocation from '~/Pages/Accountant/CostAllocation';
import CloseAccountingPeriod from '~/Pages/Accountant/CloseAccountingPeriod';
import OpenAccountingPeriod from '~/Pages/Accountant/OpenAccountingPeriod';
import { HeaderLayoutOnly } from '~/components/Layout';
import Report from '~/Pages/Report';

export const publicRoutes = [
    { path: '/', component: Home, title: 'Dashboard' },
    { path: '/accountgroup', component: AccountGroup, title: 'Account Group' },
    { path: '/account', component: Account, title: 'Account' },
    { path: '/accountingentry', component: AccountingEntry, title: 'Accounting Entry' },
    { path: '/costallocation', component: CostAllocation, title: 'Cost Allocation' },
    { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'Close Period' },
    { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'Open Period' },
    { path: '/report', component: Report, title: 'Report Costing' },
    // { path: '/following', component: Following, layout: HeaderLayoutOnly },
    // { path: '/login', component: Login, layout: null },
];

export const settingRoutes = [
    { path: '/accountgroup', component: AccountGroup, title: 'Account Group' },
    { path: '/account', component: Account, title: 'Account' },
];
export const accountantRoutes = [
    { path: '/accountingentry', component: AccountingEntry, title: 'Accounting Entry' },
    { path: '/costallocation', component: CostAllocation, title: 'Cost Allocation' },
    { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'Close Period' },
    { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'Open Period' },
];
export const reportRoutes = [{ path: '/report', component: Report, title: 'Report Costing' }];
