import UserService from '../services/user/UserService';
import { sleep } from './generalUtils';

class JWTUtil {
    static getJWT() {
        const token = localStorage.getItem('tokenKey');
        const key = token.slice(7, token.length);
        return key
    }

    static setJWT(jwt) {
        localStorage.setItem('jwt', jwt);
    }

    static removeJWT() {
        localStorage.removeItem('jwt');
    }

    static checkSessionStorage() {
        if (sessionStorage.length === 0) {
            return false;
        }

        return true;
    }

    static checkLocalStorage() {
        if (localStorage.length === 0) {
            return false;
        }

        return true;
    }

    static checkUserInfo() {
        if (JWTUtil.checkSessionStorage()) {
            if (sessionStorage.getItem('userId') && sessionStorage.getItem('userRole')) {
                return true;
            }
        }

        return false
    }

    static checkJWT() {
        if (JWTUtil.checkLocalStorage()) {
            if (localStorage.getItem('tokenKey')) {
                return true;
            }
        }

        return false;
    }

    static async confirmJWT(serviceCaller) {
        const requestBody = {
            token: JWTUtil.getJWT()
        }

        const response = await UserService.getUserFromToken(serviceCaller, requestBody);
        if (response.status !== 200) {
            return null
        }

        sessionStorage.setItem('userId', response.data.id);
        sessionStorage.setItem('userRole', response.data.roleName);

        return {id: response.data.id, role: response.data.roleName}
    }

    static async validateStorage(serviceCaller) {
        if (!JWTUtil.checkJWT()) {
            return false
        }

        if (!JWTUtil.checkUserInfo()){
            const requestBody = {
                token: JWTUtil.getJWT()
            }

            const response = await UserService.getUserFromToken(serviceCaller, requestBody);
            if (response.status !== 200) {
                return false
            }

            sessionStorage.setItem('userId', response.data.id);
            sessionStorage.setItem('userRole', response.data.roleName);
            
            return true
        }

        return true
    }
}

export default JWTUtil;