import { Router } from "express";
import { WishListService } from "./wish-list.service";
import { errorHandler } from "../../utils/error.utils";


export const WishListController = Router()

const wishListService = new WishListService()

WishListController.post('/', async (req, res)=>{
    try{
        console.log(req.body)
        const result = await wishListService.saveOffer(req.body.idUser, req.body.categories, req.body.address, req.body.useDefault);
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
})