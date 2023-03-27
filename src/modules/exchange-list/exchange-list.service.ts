import { ICoincidence } from "../offer-list/dto/coinciends.interface";
import { OfferListRepository } from "../offer-list/offer-list.repository";
import { UserRepository } from "../user/user.repository";
import { WishListRepository } from "../wish-list/wish-list.repository";
import { ExchangeListRepository } from "./exchange-list.repository";


export class ExchageListService{
    exchangeListRepository = new ExchangeListRepository()
    offerListRepository = new OfferListRepository()
    userRepository = new UserRepository()

    saveExchangeList = async (coincindence: ICoincidence)=>{
        const res = await  this.exchangeListRepository.saveExchangeList({
            idWishList1: coincindence.wish.id, 
            idOfferList1: coincindence.offerOfferrer?.id,
            idWishList2: coincindence.wishOfferrer?.id,
            idOfferList2: coincindence.offer.id,
            createAt: new Date(),
            isBoth: false
        })
    }

    getUserExchanges = async (idUser: string, active: boolean)=>{
        const userExchanges = await this.exchangeListRepository.getUserExchangeList(idUser, true)
        const otherExchanges = await this.exchangeListRepository.getUserExchangeList(idUser, false)
        const userOffers = await Promise.all(userExchanges.map(async exc=>{
            const book = await this.exchangeListRepository.getBookByOfferId(exc.idOfferList1)
            const author = await this.offerListRepository.getAuthorById(book.idAuthor)
            return {
                myOffer:{
                    author: author,
                    book: book,
                    isSubmit: true
                },
                userOffer:{
                    user: await this.exchangeListRepository.getUserByOfferId(exc.idOfferList2),
                    categories : await this.exchangeListRepository.getCategoriesByOfferId(exc.idOfferList2),
                    isSubmit : exc.isBoth
                }
            }
        }))
        const otherOffers = await Promise.all(otherExchanges.map(async exc=>{
            const book = await this.exchangeListRepository.getBookByOfferId(exc.idOfferList2)
            const author = await this.offerListRepository.getAuthorById(book.idAuthor)
            return {
                myOffer:{
                    author: author,
                    book: book,
                    isSubmit: exc.isBoth
                },
                userOffer:{
                    user: await this.exchangeListRepository.getUserByOfferId(exc.idOfferList1),
                    categories : await this.exchangeListRepository.getCategoriesByOfferId(exc.idOfferList1),
                    isSubmit : true
                }
            }
        }))
        return userOffers.concat(otherOffers)
    }
}