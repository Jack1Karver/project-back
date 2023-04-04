import { Router } from 'express';
import { errorHandler } from '../../utils/error.utils';
import { ExchageListService } from './exchange-list.service';

export const ExchageListController = Router();

const exchangeListService = new ExchageListService();

ExchageListController.post('/', async (req, res) => {
  try {
    const result = await exchangeListService.saveExchangeList(req.body.coincidence);
    return res.status(200).json(result);
  } catch (e: any) {
    return errorHandler(e, res);
  }
});

ExchageListController.get('/', async (req, res) => {
  try {
    const result = await exchangeListService.getExchanges(`${req.query.idUser}`, req.query.active === 'true');
    return res.status(200).json(result);
  } catch (e: any) {
    return errorHandler(e, res);
  }
});

ExchageListController.post('/submit', async (req, res) => {
  try {
    const result = await exchangeListService.submitExchange(req.body.id);
    return res.status(200).json(result);
  } catch (e: any) {
    return errorHandler(e, res);
  }
});

ExchageListController.post('/track', async (req, res) => {
  try {
    console.log(req.body)
    const result = await exchangeListService.saveTrackNumber(req.body.idOffer, req.body.track);
    return res.status(200).json(result);
  } catch (e: any) {
    return errorHandler(e, res);
  }
});

ExchageListController.post('/receiving', async (req, res) => {
  try {
    const result = await exchangeListService.setReceiving(req.body.idOffer, req.body.idExchange);
    return res.status(200).json(result);
  } catch (e: any) {
    return errorHandler(e, res);
  }
});
