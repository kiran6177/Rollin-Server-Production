export const getShowDates = async (startDate,endDate)=>{
    const dates = []
    const currentDate = new Date(startDate)
    const endDateLocal = new Date(endDate)
    while(currentDate <= endDateLocal){
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates
}