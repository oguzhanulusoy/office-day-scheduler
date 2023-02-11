class DepartmentService {
    async addDepartment(serviceCaller, requestBody){
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.post("/department", undefined, headers, requestBody)
    }

    async getDepartments(serviceCaller, queryParams){
        return await serviceCaller.get("/department", queryParams, undefined)
    }

    async updateDepartment(serviceCaller, requestBody){
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.update("/department", undefined, headers, requestBody)
    }

    async deleteDepartment(serviceCaller, requestBody){
        let headers = {'Accept': 'application/json','Content-Type': 'application/json'};
        return await serviceCaller.delete("/department", undefined, headers, requestBody)
    }
}

export default new DepartmentService();