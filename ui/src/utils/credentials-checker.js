const EMAIL_VALIDATION_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const validateEmail = (email) => {
    if (!email) {
        return false;
    }
    if (!EMAIL_VALIDATION_REGEX.test(email)) {
        return false;
    }

    return true;
}

export const validatePassword = (password) => {
    if (!password) {
        return false;
    }
    if (password.length < 1) {
        return false;
    }

    return true;
}