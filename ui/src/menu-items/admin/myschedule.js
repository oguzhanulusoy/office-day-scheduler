import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const icons = { CalendarMonthIcon };

// ==============================|| MY SCHEDULE MENU ITEMS ||============================== //

const myschedule = {
    id: 'myschedule-group',
    type: 'group',
    children: [
        {
            id: 'myschedule',
            title: 'My Schedule',
            type: 'item',
            url: '/user/myschedule',
            icon: icons.CalendarMonthIcon,
            breadcrumbs: false
        }
    ]
};

export default myschedule;
