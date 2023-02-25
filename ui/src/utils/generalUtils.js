export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const hasPermission = (navigate) => {
    if (sessionStorage.getItem('userRole') === "SUPER_USER" || sessionStorage.getItem('userRole') === "MANAGER") return true;

    navigate('/user/profile', { replace: true });
    return false;
}