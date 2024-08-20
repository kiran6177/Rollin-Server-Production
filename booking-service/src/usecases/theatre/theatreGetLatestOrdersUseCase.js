export class TheatreLatestOrdersGet{
    constructor(dependencies){
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
    }

    async execute(query,{id}){
        try {
            const orders = await this.orderRepository.getOrdersByTheatreId(id,10)
            console.log(orders?.length);
            return orders
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}