import { Request, Response, Router } from "express";
import { AuthService} from "./auth.service";


export const AuthController = Router();

const authService= new AuthService()

AuthController.post('/login', async (req:Request, res: Response)=>{
    try{
    const result = await authService.login(req.body.email, req.body.password)
    return res.status(result.code).json(result.json);
} catch{
    return res.status(500).json()
} 
})

AuthController.post('/signin', async(req:Request, res: Response)=>{
    try{
        const result = await authService.signin(req.body);
        return res.status(result.code).json(result.json);
    } catch(e){
        return res.status(500).json()
    }
})