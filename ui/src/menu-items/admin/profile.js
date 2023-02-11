// assets
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// constant
const icons = { KeyboardArrowRightIcon };

// ==============================|| PROFILE MENU ITEMS ||============================== //

const profile = {
    id: 'profile-group',
    type: 'group',
    children: [
        {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: '/user/profile',
            icon: icons.KeyboardArrowRightIcon,
            breadcrumbs: false
        }
    ]
};

export default profile;
