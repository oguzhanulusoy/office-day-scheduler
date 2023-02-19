class HttpUtil {
    static get(url, params, headers) {
        return new Promise((resolve, reject) => {
            const completeUrl = url + HttpUtil.getQueryString(params)
            const requestOptions = {
                method: 'GET',
                headers: headers
            };

            fetch(completeUrl, requestOptions)
            .then(async response => {
                if(response.status === 401 && window.location.pathname !== "/orion" && window.location.pathname !== "/login"){
                    window.location.assign(window.location.origin + "/orion");
                }

                const statusCode = response.status;
                const data = await response.json();

                return resolve({data: data, status: statusCode});
            })
            .then(data => {
                return resolve(data)
            })
            .catch((err) => {
                return reject(err);
            })
        });
    }
    
    static post(url, params, headers, requestBody) {
        return new Promise((resolve, reject) => {
            let completeUrl = url + HttpUtil.getQueryString(params)
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
            };

            fetch(completeUrl, requestOptions)
            .then(async response => {
                if(response.status === 401 && window.location.pathname !== "/orion" && window.location.pathname !== "/login"){
                    window.location.assign(window.location.origin + "/orion");
                }

                const statusCode = response.status;
                const data = await response.json();

                return resolve({data: data, status: statusCode});
            })
            .then(data => {
                return resolve(data)
            })
            .catch((err) => {
                return reject(err);
            })
        });
    }

    static update(url, params, headers, requestBody) {
        return new Promise((resolve, reject) => {
            let completeUrl = url + HttpUtil.getQueryString(params)
            const requestOptions = {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(requestBody),
            };

            fetch(completeUrl, requestOptions)
            .then(async response => {
                if(response.status === 401 && window.location.pathname !== "/orion" && window.location.pathname !== "/login"){
                    window.location.assign(window.location.origin + "/orion");
                }

                const statusCode = response.status;
                const data = await response.json();

                return resolve({data: data, status: statusCode});
            })
            .then(data => {
                return resolve(data)
            })
            .catch((err) => {
                return reject(err);
            })
        });
    }

    static delete(url, params, headers, requestBody) {
        return new Promise((resolve, reject) => {
            let completeUrl = url + HttpUtil.getQueryString(params)
            const requestOptions = {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify(requestBody)
            };

            fetch(completeUrl, requestOptions)
            .then(response => {
                if(response.status === 401 && window.location.pathname !== "/orion" && window.location.pathname !== "/login"){
                    window.location.assign(window.location.origin + "/orion");
                }

                return resolve(response);
            })
            .then(data => resolve(data))
            .catch((err) => {
                return reject(err);
            })
        });
    }

    static getQueryString(queryParams) {
        let queryString = '';
        for(let param in queryParams){
            if(queryString === ''){
                queryString += '?';
            }else{
                queryString += '&'
            }
            queryString =queryString + param + '=' + queryParams[param]
        }

        return queryString;
    }
}

export default HttpUtil;