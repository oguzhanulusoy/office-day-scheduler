class OutOfOfficeDayService {
    async addOutOfOfficeDay(serviceCaller, requestBody) {
        let headers = { 'Content-Type': 'application/json'};
        return await serviceCaller.post("/outofofficeday", undefined, headers, requestBody)
    }

    async getOutOfOfficeDays(serviceCaller, queryParams) {
        return await serviceCaller.get("/outofofficeday", queryParams, undefined)
    }

    async updateOutOfOfficeDay(serviceCaller, requestBody) {
        let headers = { 'Content-Type': 'application/json'};
        return await serviceCaller.update("/outofofficeday", undefined, headers, requestBody)
    }

    async deleteOutOfOfficeDay(serviceCaller, requestBody) {
        let headers = {'Accept': 'application/json','Content-Type': 'application/json'};
        return await serviceCaller.delete("/outofofficeday", undefined, headers, requestBody)
    }
}

export default new OutOfOfficeDayService();