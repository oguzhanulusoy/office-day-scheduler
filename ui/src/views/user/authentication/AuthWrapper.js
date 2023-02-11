// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.grey[200],
    minHeight: '100vh'
}));

export default AuthWrapper;
