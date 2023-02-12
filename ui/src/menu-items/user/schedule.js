// assets
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// constant
const icons = { CalendarMonthIcon };

// ==============================|| SCHEDULE MENU ITEMS ||============================== //

const schedule = {
    id: 'schedule-group',
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

export default schedule;
