import Home from '~/Pages/Home';
import Account from '~/Pages/Setting/Account';
import AccountGroup from '~/Pages/Setting/AccountGroup';
import AccountingEntry from '~/Pages/Accountant/AccountingEntry';
import CostAllocation from '~/Pages/Accountant/CostAllocation';
import CloseAccountingPeriod from '~/Pages/Accountant/CloseAccountingPeriod';
import OpenAccountingPeriod from '~/Pages/Accountant/OpenAccountingPeriod';
import { HeaderLayoutOnly } from '~/components/Layout';
import Report_COGS from '~/Pages/Report/COGS';
import Report_InOut_Ward from '~/Pages/Report/InOutWard';
import { useTranslation } from 'react-i18next';
import LivePig from '~/Pages/Accountant/LivePig';

export const publicRoutes = [
    { path: '/', component: Home, title: 'Dashboard' },
    { path: '/accountgroup', component: AccountGroup, title: 'menu-acc-group' },
    { path: '/account', component: Account, title: 'menu-acc' },
    { path: '/accountingentry', component: AccountingEntry, title: 'menu-entry' },
    { path: '/costallocation', component: CostAllocation, title: 'menu-allocation' },
    { path: '/closeaccountingperiod', component: CloseAccountingPeriod, title: 'menu-close-period' },
    { path: '/openaccountingperiod', component: OpenAccountingPeriod, title: 'menu-open-period' },
    { path: '/reportcogs', component: Report_COGS, title: 'menu-report-cogs' },
    { path: '/reportinout', component: Report_InOut_Ward, title: 'menu-report-inout-ward' },
    { path: '/livepig', component: LivePig, title: 'live-pig' },
    // { path: '/reportcogm', component: Report_COGM, title: 'menu-report-cogm' },
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
    { path: '/livepig', component: LivePig, title: 'live-pig' },
];
export const reportRoutes = [
    { path: '/reportcogs', component: Report_COGS, title: 'menu-report-cogs' },
    { path: '/reportinout', component: Report_InOut_Ward, title: 'menu-report-inout-ward' },
    // { path: '/reportcogm', component: Report_COGM, title: 'menu-report-cogm' },
];
