import { Router } from 'express';
import passport from 'passport';
import { OfferListService } from './offer-list.service';
import { errorHandler } from '../../utils/error.utils';

export const OfferListController = Router();

const offerListService = new OfferListService

OfferListController.post('/', async (req, res) => {
    try{
        const result = await offerListService.saveOffer(req.body.idUser,req.body.book, req.body.author, req.body.categories, req.body.offer)
        return res.status(200).json(result)
    } catch(e: any){
       return errorHandler(e, res)
    }
});


OfferListController.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {});

OfferListController.get('/coincidences', async (req, res) => {
    try{
        if(req.query.idUser){
        const result = await offerListService.getCoincidences(req.query.idUser?.toString())
        return res.status(200).json(result);
        }
    } catch(e){
        return errorHandler(e, res)
    }
});

OfferListController.get('/by-status', (req, res) => {});
