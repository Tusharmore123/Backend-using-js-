class ApiResponseHandler{
    constructor(data,statuscode,message="Success"){
        this.statuscode=statuscode
        this.success=statuscode<400
        this.message=message
        this.data=data
    }
}

export {ApiResponseHandler}