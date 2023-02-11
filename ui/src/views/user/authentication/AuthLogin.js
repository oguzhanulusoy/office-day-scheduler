import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import { toast } from 'react-toastify';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useNavigate } from 'react-router-dom'; 
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { validateEmail, validatePassword } from 'utils/credentials-checker';
import { useEffect } from 'react';

// ============================|| FIREBASE - LOGIN ||============================ //

const Login = ({ ...others }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(()=>{
        sessionStorage.clear();
        localStorage.clear();
    },[]);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleEmail = (value) => {
        setEmail(value)
    }

    const handlePassword = (value) => {
        setPassword(value)
    }

    const login = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            toast.error("Invalid email format", { autoClose: 1000 });
            return false;
        }
        if (!validatePassword(password)) {
            toast.error("Password must be at least 8 characters long", { autoClose: 1000 });
            return false;
        }

        const requestBody = {
            email: email,
            password: password
        }

        fetch('/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(result => {
            if(result.status === 'success') {
                toast.success("Login successful", { autoClose: 1000 });
                localStorage.setItem("tokenKey", result.accessToken);
                localStorage.setItem("refreshKey", result.refreshToken);
                sessionStorage.setItem("userId", result.userId);
                sessionStorage.setItem("userRole", result.roleName);

                navigate("/user/profile", { replace: true });

            } else if(result.status === 'failed' ) {
                toast.error("Credentials are not correct", { autoClose: 1000 });
            } else {
                toast.error("Login failed. Please try again. Something went wrong.", { autoClose: 1000 })
            }
        }).catch(error => {
            toast.error("Login failed. Please try again. Something went wrong.", { autoClose: 1000 })
            console.log(error);
        })
    }
    
    return (
        <>
            <Formik>
                {({ errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={(i) => handleEmail(i.target.value)}
                                label="Email Address"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={(i) => handlePassword(i.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                            <Typography variant="subtitle1" color="#6F6E6E" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                                Forgot Password?
                            </Typography>
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    style={{backgroundColor:"#6F6E6E"}}
                                    onClick={(e) => login(e)}
                                >
                                    Sign in
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default Login;