// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import userMenuItems from 'menu-items/user';
import adminMenuItems from 'menu-items/admin';
import managerMenuItems from 'menu-items/manager';
import { useState } from 'react';

import ServiceCaller from 'services/ServiceCaller';
import { useNavigate } from 'react-router-dom'; 
import JWTUtil from 'utils/jwtUtil';
import { useEffect } from 'react';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const serviceCaller = new ServiceCaller();
        JWTUtil.validateStorage(serviceCaller)
        .then(async (response) => {
            if (!response) {
                navigate('/', { replace: true });
                return 
            }

            const res = await JWTUtil.confirmJWT(serviceCaller);
            if (res === null) {
                navigate('/', { replace: true });
                return;
            }

            setUserRole(res.role);
        })
    }, [])

    let navItemList;

    if (userRole === "SUPER_USER") {
        navItemList = adminMenuItems;
    } else if (userRole === "MANAGER") {
        navItemList = managerMenuItems;
    } else {
        navItemList = userMenuItems;
    }

    const navItems = navItemList.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
