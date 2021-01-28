interface Survey {
    email: string,
    name: string,
    speciality: string,
    blockedDays: number[],
    blockedWeekendDays: number[][],
    holidayLeave: number[],
    specialityER: number[],
    comments: string,
    timestamp: Date,
}

export default Survey;
