import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { Settings } from '@mui/icons-material';
const icons = { Settings, KeyboardArrowRightIcon };

// ==============================|| DEPARTMENT MENU ITEMS ||============================== //

const manager = {
    id: 'manager-group',
    type: 'group',
    title: 'Manager',
    icon: icons.Settings,
    children: [
        {
            id: 'department',
            title: 'Department List',
            type: 'item',
            url: '/admin/department',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        },
        {
            id: 'calendar',
            title: 'Calendar List',
            type: 'item',
            url: '/admin/calendar',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        },
        {
            id: 'out-of-office-day',
            title: 'Out of Office Day List',
            type: 'item',
            url: '/admin/out-of-office-day',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        },
        {
            id: 'role',
            title: 'Role List',
            type: 'item',
            url: '/admin/role',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        },
        {
            id: 'schedule',
            title: 'Schedule List',
            type: 'item',
            url: '/admin/schedule',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        },
        {
            id: 'user',
            title: 'User List',
            type: 'item',
            url: '/admin/user-list',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        },
        {
            id: 'zone',
            title: 'Zone List',
            type: 'item',
            url: '/admin/zone',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        }
    ]
};

export default manager;