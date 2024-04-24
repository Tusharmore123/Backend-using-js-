class ApiError extends Error{
    constructor(
        message="Something went wrong",
        statusCode,
        stack="",
        errors=[]
    ){
        super(message)
        this.message=message
        this.success=false
        this.errors=errors
        this.statusCode=statusCode
        
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}