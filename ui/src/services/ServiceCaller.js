import { v1 as uuidv1 } from 'uuid';
import HttpUtil from 'utils/httpUtil';
class ServiceCaller {
    constructor() {
        const uuidOptions = {};

        this.correlationId = uuidv1(uuidOptions);
        this.headers = {
            'X-Correlation-Id': this.correlationId,
            'Authorization' : localStorage.getItem("tokenKey")
        };
    }

    async get(url, queryParams, headers) {
        if(!headers){
            headers ={}
        }
        headers = Object.assign(headers, this.headers)
        return await HttpUtil.get(url, queryParams, headers);
    }

    async post(url, queryParams, headers, requestBody) {
        if(!headers){
            headers ={}
        }
        headers = Object.assign(headers, this.headers)
        return await HttpUtil.post(url, queryParams, headers, requestBody);
    }

    async delete(url, queryParams, headers, requestBody) {
        if(!headers){
            headers ={}
        }
        headers = Object.assign(headers, this.headers)
        return await HttpUtil.delete(url, queryParams, headers, requestBody);
    }

    async update(url, queryParams, headers, requestBody) {
        if(!headers){
            headers ={}
        }
        headers = Object.assign(headers, this.headers)
        return await HttpUtil.update(url, queryParams, headers, requestBody);
    }
}

export default ServiceCaller;
