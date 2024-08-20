const STARTYEAR = 2023;

const isLeapYear = (date) => {
    const year = date.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

const getReductionDays = (now)=>{
    const thirtyDays = [3,5,8,10];
    const thirtyOneDays = [0,2,4,6,7,9,11];
    let reducedDayCount = 0;
    const thisMonth = now.getMonth();
    if(thirtyDays.includes(thisMonth)){
        reducedDayCount = 30
    }else if(thirtyOneDays.includes(thisMonth)){
        reducedDayCount = 31
    }else if(thisMonth === 1){
        if(isLeapYear(now)){
            reducedDayCount = 29
        }else{
            reducedDayCount = 28
        }
    }
    return reducedDayCount
}  

export const getSevenDayRange = (now)=>{
    let rangeArray = []
    const firstStart = new Date(now)
    firstStart.setHours(0,0,0,0) //12 PM midnight of today
    rangeArray.push({startDate:firstStart,endDate:now})
    for(let i = 1 ; i < 7 ; i++){
        let startDate = new Date(firstStart);
        startDate.setDate(startDate.getDate() - i)

        let endDate = new Date(startDate);
        endDate.setHours(23,59,59,999)
        rangeArray.push({startDate,endDate})
    }
    return rangeArray
}

export const getWeekRange = (now)=>{
    const weekRangeArray = [];
    const firstStart = new Date(now)
    firstStart.setDate(firstStart.getDate() - 7)//7 day before today
    firstStart.setHours(0,0,0,0) //12 PM midnight of day
    weekRangeArray.push({startDate:firstStart,endDate:now})
    for(let i = 1 ; i < 4 ; i++){
        let startDate = new Date(firstStart);
        startDate.setDate(startDate.getDate() - (i * 7))

        let endDate = new Date(firstStart);
        endDate.setDate(endDate.getDate() - ((i - 1) * 7))
        weekRangeArray.push({startDate,endDate})
    }
    return weekRangeArray    
}

export const getMonthRange = (now)=>{
    const monthRangeArray = [];
    const firstStart = new Date(now);
    firstStart.setDate(1)
    const reducedDayCount = getReductionDays(firstStart);
    firstStart.setHours(0,0,0,0)
    console.log(reducedDayCount);
    
    const firstEnd = new Date(firstStart)
    firstEnd.setDate(firstEnd.getDate() + (reducedDayCount))
    monthRangeArray.push({startDate:firstStart,endDate:firstEnd})
    for(let i = 1 ; i < 12 ; i++){
        //ORDERING IS IMPORTANT in BELOW 5 LINES
        const startDate = new Date(now);
        startDate.setDate(1);
        startDate.setHours(0,0,0,0)
        startDate.setMonth(startDate.getMonth() - i)
        const reductionDays = getReductionDays(startDate);
        
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + (reductionDays) )
        monthRangeArray.push({startDate,endDate});
    }
    return monthRangeArray    
}

export const getYearRange = (now)=>{
    const yearRangeArray = []
    const firstStart = new Date(now)
    const currentYear = firstStart.getFullYear();//FINDING_CURRENT_YEAR
    firstStart.setDate(1)
    firstStart.setMonth(0)
    firstStart.setHours(0,0,0,0)
    
    const firstEnd = new Date(now)
    firstEnd.setDate(31)
    firstEnd.setMonth(11)
    firstEnd.setHours(23,59,59,999)

    yearRangeArray.push({startDate:firstStart,endDate:firstEnd})

    //LIMITING FROM 2024 
    for(let i = (currentYear - 1) ; i >= 2024 ; i--){
        let startDate = new Date(i,0,1,0,0,0,0)
        let endDate = new Date(i,11,31,23,59,59,999)
        yearRangeArray.push({startDate,endDate})
    }
    return yearRangeArray
}