import { AbstractRepository } from "../../db/abstract.repository";
import { IBookLiterary } from "../../models/book-literary.model";
import { ICategory } from "../../models/category.module";
import { IExchangeList } from "../../models/exchange-list.model";
import { IUserExtended } from "../../models/user.model";


export class ExchangeListRepository extends AbstractRepository{

    saveExchangeList = async (fields)=>{
        return this.insertAndGetID('exchange_list', fields)
    }

    getUserExchangeList = async (idUser: string, byUser: boolean)=>{
        const res = await this.connection.sqlQuery(`
        SELECT el.* FROM exchange_list  as el
        JOIN offer_list as of ON of.id = el."idOfferList${byUser ? 1 : 2}"
        WHERE of."idUser" = ${idUser}
        `)
        return res as IExchangeList[]
    }

    getBookByOfferId = async (id: number)=>{
        const res = await this.connection.sqlQuery(`
        SELECT bl.* FROM book_literary as bl
        JOIN offer_list as of ON of."idBookLiterary" = bl.id 
        WHERE of.id = ${id}
        `)
        return res[0] as IBookLiterary
    }

    getCategoriesByOfferId = async (id: number)=>{
        const res = await this.connection.sqlQuery(`
        SELECT c.*
        from category as c 
                JOIN user_value_category as uvc ON uvc."idCategory" = c.id
                JOIN user_list as ul ON ul.id = uvc."idUserList"
                JOIN offer_list as ol ON ol.id = ul."idOfferList"
                WHERE ol.id = ${id}
        `)
        return res as ICategory[]
    }
    getUserByOfferId = async(id: number)=>{
        const res = await this.connection.sqlQuery(`
        SELECT ut.* FROM user_table as ut
        JOIN offer_list as of ON of."idUser" = ut.id 
        WHERE of.id = ${id}
        `)
        return res[0] as IUserExtended
    }
}