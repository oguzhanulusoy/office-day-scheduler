class UserService {  
    async getUsers(serviceCaller, queryParams){
        return await serviceCaller.get("/user", queryParams, undefined)
    }

    async getOneUser(serviceCaller, url, queryParams){
        return await serviceCaller.get(url, queryParams, undefined)
    }

    async getUserFromToken(serviceCaller, requestBody){
        let headers = {'Content-Type': 'application/json'};
        return await serviceCaller.post("/user/token", undefined, headers, requestBody)
    }

    async updateUser(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.update("/user", undefined, headers, requestBody)
    }

    async changePassword(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.update("/user/change-password", undefined, headers, requestBody)
    }

    async deleteUser(serviceCaller, requestBody) {
        let headers = {'Accept': 'application/json','Content-Type': 'application/json'};
        return await serviceCaller.delete("/user", undefined, headers, requestBody)
    }
}

export default new UserService();