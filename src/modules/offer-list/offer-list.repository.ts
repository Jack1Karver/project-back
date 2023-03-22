import { AbstractRepository } from "../../db/abstract.repository";
import { IAuthor } from "../../models/author.model";
import { IBookLiterary } from "../../models/book-literary.model";
import { IOfferList } from "../../models/offer-list.model";
import { IStatus } from "../../models/status.module";


export class OfferListRepository extends AbstractRepository{

    saveAuthor = async (author: IAuthor)=>{
        try{
        return await this.insertAndGetID('author', author)
    } catch{
        throw new Error
    }
    }

    getAuthor = async(author: IAuthor)=>{
        try{
        const res = await this.getByFields('author', author, true)
        if(res.length){
            return res[0]
        }
        return null
    } catch{
        throw new Error
    }
    }

    saveBook = async (book: IBookLiterary)=>{
        try{
        return await this.insertAndGetID('book_literary', book);
    } catch{
        throw new Error
    }
    }

    saveOffer = async (offer: IOfferList)=>{
        try{
        return await this.insertAndGetID('offer_list', offer)
    } catch{
        throw new Error
    }
    }

}