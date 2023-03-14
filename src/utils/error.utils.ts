export const errorHandler = (res, error)=>{
    res.status(error.status).json({
        message: error.message
    })
}