// assets
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// constant
const icons = { KeyboardArrowRightIcon };

// ==============================|| MY SCHEDULE MENU ITEMS ||============================== //

const myschedule = {
    id: 'myschedule-group',
    type: 'group',
    children: [
        {
            id: 'myschedule',
            title: 'My Schedule',
            type: 'item',
            url: '/user/schedule',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        }
    ]
};

export default myschedule;
