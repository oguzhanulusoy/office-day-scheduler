export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const hasPermission = (navigate) => {
    if (sessionStorage.getItem('userRole') !== "MANAGER") {
        navigate('/user/profile', { replace: true });
        return false;
    }

    return true;
}