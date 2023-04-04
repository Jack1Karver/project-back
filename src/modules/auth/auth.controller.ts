import { Request, Response, Router } from "express";
import { AuthService} from "./auth.service";
import { errorHandler } from "../../utils/error.utils";


export const AuthController = Router();

const authService= new AuthService()

AuthController.post('/login', async (req:Request, res: Response)=>{

    try{
        const result = await authService.login(req.body)
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
})

AuthController.post('/signin', async(req:Request, res: Response)=>{

    try{
        const result = await authService.signin(req.body.user, req.body.address);
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
    
})