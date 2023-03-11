import { Request, Response, Router } from "express";
import { AuthService} from "./auth.service";


export const AuthRouter = Router();

const authService= new AuthService()

AuthRouter.post('login', async (req:Request, res: Response)=>{
    try{
    const result = await authService.login(req.body.email, req.body.password)
    return res.status(result.code).json(result.json);
} catch{
    return res.status(500)
} 
})