import { Cashfree } from 'cashfree-pg'

    

export class CashfreeClient{
    constructor(){
        this.appId = process.env.CASHFREE_APP_ID
        this.secretKey = process.env.CASHFREE_SECRET_KEY
        Cashfree.XClientId = this.appId
        Cashfree.XClientSecret = this.secretKey
        Cashfree.XEnvironment = Cashfree.Environment.SANDBOX
    }
    async createOrder(order_id,user_id,user_email,user_name,user_mobile,amount){
        try {
            const name = user_name.split(' ').map(each=>each.replace(/[^A-Za-z]/g,'')).join(" ")
            const request = {
                "order_amount": amount,
                "order_currency": "INR",
                "order_id": `${order_id}`,
                "customer_details": {
                    "customer_id": `${user_id}`,
                    "customer_phone": `${user_mobile != 0 ? user_mobile : 9061691769}`,
                    "customer_name": `${name}`,
                    "customer_email": `${user_email}`
                },
                "order_meta": {
                    "return_url": `http://localhost:3000/paymentprocess?order_id=${order_id}`,
                    "notify_url": `http://localhost:4000/api/booking/paymentprocess?order_id=${order_id}`,
                    "payment_methods": "cc,dc,upi"
                }
            };
            const response  = await Cashfree.PGCreateOrder("2023-08-01",request)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }
    async getOrderStatus(order_id){
        try {
            const response = await Cashfree.PGOrderFetchPayments("2023-08-01",order_id)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    async createRefund(order_id,refund_id,refund_amount){
        try {
            const request = {
                "refund_id": refund_id,
                "refund_amount": refund_amount
            }
            const response = await Cashfree.PGOrderCreateRefund("2022-09-01", order_id, request)
            return response?.data;
        } catch (error) {
            console.log(error);
        }
    }

    async getRefundStatus(refund_id,order_id){
        try {
            const response = await Cashfree.PGOrderFetchRefund("2022-09-01", order_id , refund_id)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }
}