export class User{
    constructor(user){
        this.email = user.email;
        this.mobile = user.mobile;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.dob = user.dob
        this.address = user.address
        this.walletBalance =  user.walletBalance
        this.isVerified =  user.isVerified
        this.password = user.password
    }
}