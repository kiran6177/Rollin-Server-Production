export class GetCollections{
    constructor(dependencies){
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
    }

    async getCollections(type,dateRanges,screens){
        try {
            let resultObj = new Map();
            if(screens?.length > 0){
                for(let screenId of screens){
                    const screenData = await this.screenRepository.findScreenById(screenId);
                    for(let {startDate,endDate} of dateRanges){
                        const getTotalAmount = await this.orderRepository.getCollectionByScreenInRange(screenId.toString(),startDate,endDate)
                        let dateString ;
                        if(type === "DAILY"){
                            dateString = endDate.toLocaleDateString('en-US',{month:'long',day:'numeric'})
                        }else if(type === "WEEKLY"){
                            let startDateString = startDate.toLocaleDateString('en-US',{month:'long',day:'numeric'})
                            let endDateString = endDate.toLocaleDateString('en-US',{month:'long',day:'numeric'})
                            dateString = startDateString+ ' - ' + endDateString ;
                        }else if(type === "MONTHLY"){
                            dateString = startDate.toLocaleDateString('en-US',{month:'long'})
                        }else if(type === 'YEARLY'){
                            dateString = endDate.toLocaleDateString('en-US',{year:'numeric'})
                            console.log("DATESTRING",dateString);
                            
                        }else if(type === "RANGE"){
                            dateString = endDate.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})
                        }
                        if(getTotalAmount?.length < 1){
                            if(resultObj.has(dateString)){
                                resultObj.set(dateString,[...resultObj.get(dateString),{screenId,screen:screenData?.name || null,totalAmount:getTotalAmount[0]?.totalAmount || 0}])
                            }else{
                                resultObj.set(dateString,[{screenId,screen:screenData?.name || null,totalAmount:getTotalAmount[0]?.totalAmount || 0}])
                            }
                        }else{
                            if(resultObj.has(dateString)){
                                resultObj.set(dateString,[...resultObj.get(dateString),{screenId,screen:screenData?.name || null,totalAmount:getTotalAmount[0]?.totalAmount || 0}])
                            }else{
                                resultObj.set(dateString,[{screenId,screen:screenData?.name || null,totalAmount:getTotalAmount[0]?.totalAmount || 0}])
                            }
                        }
                    }
                }
            }else{
                for(let {endDate} of dateRanges){
                    let dateString ;
                    if(type === "DAILY"){
                        dateString = endDate.toLocaleDateString('en-US',{month:'long',day:'numeric'})
                    }else if(type === "WEEKLY"){
                        let startDateString = startDate.toLocaleDateString('en-US',{month:'long',day:'numeric'})
                        let endDateString = endDate.toLocaleDateString('en-US',{month:'long',day:'numeric'})
                        dateString = startDateString+ ' - ' + endDateString ;
                    }else if(type === "MONTHLY"){
                        dateString = endDate.toLocaleDateString('en-US',{month:'long'})
                    }else if(type === 'YEARLY'){
                        dateString = endDate.toLocaleDateString('en-US',{year:'numeric'})
                    }else if(type === "RANGE"){
                        dateString = endDate.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})
                    }
                    if(resultObj.has(dateString)){
                        resultObj.set(dateString,[...resultObj.get(dateString),{screenId:null,screen:null,totalAmount:0}])
                    }else{
                        resultObj.set(dateString,[{screenId:null,screen:null,totalAmount:0}])
                    }
                }
            } 
            
            return Array.from(resultObj)
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}