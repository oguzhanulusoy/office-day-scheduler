import { lazy } from 'react';
// project imports
import UserLayout from 'layout/UserLayout';
import Loadable from 'ui-component/Loadable';

// sample page routing
const SchedulePage = Loadable(lazy(() => import('views/user/schedule')));
const ProfilePage = Loadable(lazy(() => import('views/user/profile')));
const SettingsPage = Loadable(lazy(() => import('views/user/settings')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/user/',
    element: <UserLayout />,
    children: [
        {
            path: 'myschedule',
            element: <SchedulePage />
        },
        {
            path: 'profile',
            element: <ProfilePage />
        },
        {
            path: 'settings',
            element: <SettingsPage />
        }
    ]
};

export default MainRoutes;
