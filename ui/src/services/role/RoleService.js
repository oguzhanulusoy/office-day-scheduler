class RoleService {
    async addRole(serviceCaller, requestBody) {
        let headers = { 'Content-Type': 'application/json'};
        return await serviceCaller.post("/role", undefined, headers, requestBody)
    }

    async getRoles(serviceCaller, queryParams) {
        return await serviceCaller.get("/role", queryParams, undefined)
    }

    async updateRole(serviceCaller, requestBody) {
        let headers = { 'Content-Type': 'application/json'};
        return await serviceCaller.update("/role", undefined, headers, requestBody)
    }

    async deleteRole(serviceCaller, requestBody) {
        let headers = {'Accept': 'application/json','Content-Type': 'application/json'};
        return await serviceCaller.delete("/role", undefined, headers, requestBody)
    }
}

export default new RoleService();