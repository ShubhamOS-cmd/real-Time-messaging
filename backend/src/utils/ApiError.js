class ApiError extends Error{
    constructor(
        statusCode ,
        message = "Something went wrong",
        code = "ERROR",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.code = code
        this.message = message
        this.success = false;
        this.errors = errors

        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this , this.constructor)
        }
    }

}

export {ApiError}