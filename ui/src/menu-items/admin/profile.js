import User from '@mui/icons-material/Person';
const icons = { User };

// ==============================|| PROFILE MENU ITEMS ||============================== //

const profile = {
    id: 'profile-group',
    type: 'single',
    children: [
        {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: '/user/profile',
            icon: icons.User,
            breadcrumbs: false
        }
    ]
};

export default profile;
