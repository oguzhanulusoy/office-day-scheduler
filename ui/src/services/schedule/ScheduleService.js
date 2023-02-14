class ScheduleService {
    async addSchedule(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.post("/schedule", undefined, headers, requestBody)
    }

    async getSchedules(serviceCaller, queryParams) {
        return await serviceCaller.get("/schedule", queryParams, undefined)
    }

    async getActiveSchedule(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.post("/schedule/user", undefined, headers, requestBody)
    }

    async updateSchedule(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.update("/schedule", undefined, headers, requestBody)
    }

    async deleteSchedule(serviceCaller, requestBody) {
        let headers = {'Accept': 'application/json','Content-Type': 'application/json'};
        return await serviceCaller.delete("/schedule", undefined, headers, requestBody)
    }
}

export default new ScheduleService();