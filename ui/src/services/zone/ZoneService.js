class ZoneService {
    async addZone(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.post("/zone", undefined, headers, requestBody)
    }

    async getZones(serviceCaller, queryParams) {
        return await serviceCaller.get("/zone", queryParams, undefined)
    }

    async updateZone(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.update("/zone", undefined, headers, requestBody)
    }

    async deleteZone(serviceCaller, requestBody) {
        let headers = {'Accept': 'application/json','Content-Type': 'application/json'};
        return await serviceCaller.delete("/zone", undefined, headers, requestBody)
    }
}

export default new ZoneService();