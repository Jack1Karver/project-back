import { Router } from "express";
import { errorHandler } from "../../utils/error.utils";
import { ExchageListService } from "./exchange-list.service";

export const ExchageListController = Router();

const exchangeListService = new ExchageListService

ExchageListController.post('/', async (req, res) =>{
    try{
        const result = await exchangeListService.saveExchangeList(req.body.coincidence)
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
})

ExchageListController.get('/', async (req, res)=>{
    try{
        const result = await exchangeListService.getUserExchanges(`${req.query.idUser}`, req.query.active === 'true')
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
})

