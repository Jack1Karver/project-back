import { Router } from "express";
import { errorHandler } from "../../utils/error.utils";
import { ExchageListService } from "./exchange-list.service";

const ExchageList = Router();

const exchangeListService = new ExchageListService

ExchageList.post('/', async (req, res) =>{
    try{
        const result = await exchangeListService.saveExchangeList(req.body.coincidence)
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
})

