class CalendarService {
    async addCalendar(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.post("/calendar", undefined, headers, requestBody)
    }

    async getCalendars(serviceCaller, queryParams) {
        return await serviceCaller.get("/calendar", queryParams, undefined)
    }

    async updateCalendar(serviceCaller, requestBody) {
        let headers= { 'Content-Type': 'application/json'};
        return await serviceCaller.update("/calendar", undefined, headers, requestBody)
    }

    async deleteCalendar(serviceCaller, requestBody) {
        let headers = {'Accept': 'application/json','Content-Type': 'application/json'};
        return await serviceCaller.delete("/calendar", undefined, headers, requestBody)
    }
}

export default new CalendarService();