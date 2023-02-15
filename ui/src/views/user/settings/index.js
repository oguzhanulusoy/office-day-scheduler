import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import UserService from 'services/user/UserService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';

class SettingsHelper {
    constructor(navigate, params) {
        this.serviceCaller = new ServiceCaller();
        this.navigate = navigate;
        this.params = params;
    }

    initSetters(setOldPassword, setNewPassword, setConfirmPassword) {
        this.setOldPassword = setOldPassword;
        this.setNewPassword = setNewPassword;
        this.setConfirmPassword = setConfirmPassword;
    }

    handleOldPassword(value) {
        this.setOldPassword(value);
    }

    handleNewPassword(value) {
        this.setNewPassword(value);
    }

    handleConfirmPassword(value) {
        this.setConfirmPassword(value);
    }

    validate() {
        if(this.params.oldPassword === '') {
            toast.error('Old password is required', { autoClose: 1000 });
            return false;
        }
        if(this.params.newPassword === '') {
            toast.error('New password is required', { autoClose: 1000 });
            return false;
        }
        if(this.params.confirmPassword === '') {
            toast.error('Confirm password is required', { autoClose: 1000 });
            return false;
        }
        if(this.params.newPassword !== this.params.confirmPassword) {
            toast.error('Passwords do not match', { autoClose: 1000 });
            return false;
        }
        return true;
    }

    effectHelper() {
        JWTUtil.validateStorage(this.serviceCaller)
        .then(res => {
            if(!res) {
                this.navigate('/', { replace: true });
                return
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    changePassword(e) {
        e.preventDefault();
        if(!this.validate()) {
            return;
        }
        
        const requestBody = {
            userId: sessionStorage.getItem('userId'),
            oldPassword: this.params.oldPassword,
            newPassword: this.params.newPassword,
        }

        UserService.changePassword(this.serviceCaller, requestBody)
        .then(res => {
            if(res.status === 401) {
                toast.error('Unauthorized', { autoClose: 1000 });
                this.navigate('/', { replace: true });
                return
            }

            if(res.status === 200) {
                if (res.data.status === "SUCCESS") {
                    toast.success(res.data.message, { autoClose: 1000 });
                    localStorage.setItem('tokenKey', res.data.token);
                    localStorage.setItem('refreshKey', res.data.refreshToken);
                } else {
                    toast.error(res.data.message, { autoClose: 1000 });
                }
            }

            this.setOldPassword('');
            this.setNewPassword('');
            this.setConfirmPassword('');
        })
        .catch(err => {
            console.log(err);
        })
    }
}

function Settings() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    let params = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
    }

    const Helper = new SettingsHelper(navigate, params);
    Helper.initSetters(setOldPassword, setNewPassword, setConfirmPassword);

    useEffect(() => {
        Helper.effectHelper();
    }, []);

  return (
    <Grid container direction="row" justifyContent="flex-start" sx={{ minHeight: '100vh' }}>
        <Grid item xs={3}>
            <h2>Settings</h2>
            <h3>Password Settings</h3>
            <Grid container justifyContent="top" alignItems="top">
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-password-login">Old Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-login"
                        type="password"
                        value={oldPassword}
                        name="old-password"
                        onChange={(i) => Helper.handleOldPassword(i.target.value)}
                        label="Old Password"
                        inputProps={{}}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-password-login">New Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-login"
                        type="password"
                        value={newPassword}
                        name="new-password"
                        onChange={(i) => Helper.handleNewPassword(i.target.value)}
                        label="New Password"
                        inputProps={{}}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-password-login">Confirm Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-login"
                        type="password"
                        value={confirmPassword}
                        name="repeat-password"
                        onChange={(i) => Helper.handleConfirmPassword(i.target.value)}
                        label="Repeat Password"
                        inputProps={{}}
                    />
                </FormControl>
                <Grid container justifyContent="right" alignItems="center">
                    <Grid item xs={6}>
                        <Box sx={{ mt: 2, mr: 1 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{backgroundColor:"#6F6E6E"}}
                                    onClick={(e) => Helper.changePassword(e)}
                                >
                                Change Password
                                </Button>
                            </AnimateButton>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
    
  )
}

export default Settings;
