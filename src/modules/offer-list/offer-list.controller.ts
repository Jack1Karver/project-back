import { Router } from 'express';
import passport from 'passport';

export const OfferListController = Router();

OfferListController.post('/', (req, res) => {});

OfferListController.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {});

OfferListController.get('/all', (req, res) => {});

OfferListController.get('/by-status', (req, res) => {});
