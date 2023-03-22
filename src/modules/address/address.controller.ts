import { Router } from "express";
import { AddressService } from "./address.service";
import { errorHandler } from "../../utils/error.utils";

export const AddressController = Router()

const addressService = new AddressService

AddressController.get('/', async (req, res)=>{

})

AddressController.post('/',async (req, res)=>{
    try{
        const result = await addressService.saveAddress(req.body.address, req.body.userId)
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
})