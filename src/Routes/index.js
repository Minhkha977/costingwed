import Home from "~/Pages/Home";
import Following from "~/Pages/Following";
import Login from "~/Pages/Login";
import { HeaderLayoutOnly } from "~/components/Layout";

export const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following,layout: null },
    { path: '/login', component: Login, layout: HeaderLayoutOnly },
]

export const privateRoutes = [

]