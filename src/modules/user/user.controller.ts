import { Router } from 'express';
import { UserService } from './user.service';
import { errorHandler } from '../../utils/error.utils';

export const UserController = Router();

const userService = new UserService

UserController.post('/set-address', (req, res) => {});

UserController.get('/', async (req, res) => {
    try{
        const result = await userService.getUser(req.query.userName as string);
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
});

UserController.post('/update', (req, res) => {});
