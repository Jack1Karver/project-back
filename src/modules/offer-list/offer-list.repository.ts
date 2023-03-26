import { AbstractRepository } from '../../db/abstract.repository';
import { IAuthor } from '../../models/author.model';
import { IBookLiterary } from '../../models/book-literary.model';
import { IOfferList } from '../../models/offer-list.model';
import { IStatus } from '../../models/status.module';

export class OfferListRepository extends AbstractRepository {
  saveAuthor = async (author: IAuthor) => {
    try {
      return await this.insertAndGetID('author', author);
    } catch {
      throw new Error();
    }
  };

  getAuthor = async (author: IAuthor) => {
    try {
      const res = await this.getByFields('author', author, true);
      if (res.length) {
        return res[0];
      }
      return null;
    } catch {
      throw new Error();
    }
  };

  saveBook = async (book: IBookLiterary) => {
    try {
      return await this.insertAndGetID('book_literary', book);
    } catch {
      throw new Error();
    }
  };

  saveOffer = async (offer: IOfferList) => {
    try {
      return await this.insertAndGetID('offer_list', offer);
    } catch {
      throw new Error();
    }
  };

  findOffersByCategories = async (idUser: string, categories: number[], eq: boolean) => {
    try {
      const conditions = categories
        .map(cond => {
          return `category.id ${eq ? '=' : '!='} '${cond}'`;
        })
        .join(' OR ');
      const res = await this.connection.sqlQuery(`
      SELECT ol.id as id, ol."idUser" as "idUser", COUNT (*)
      FROM offer_list as ol 
      JOIN user_list ON ol.id = user_list."idOfferList" 
      JOIN user_value_category as uvc ON user_list.id = uvc."idUserList"
      JOIN category ON category.id = uvc."idCategory"
      WHERE ol."idUser" != ${idUser} ${categories.length ? `AND  (${conditions})`: ''}
        GROUP BY ol.id, ol."idUser"`);
        if(res){
        return res as {id: number, idUser: number, count: number}[]
        }
        throw new Error
    } catch(e) {
        console.log(e);
        throw new Error
    }
  };


  saveOfferList = async (idList: number) => {
    try {
      return await this.insertAndGetID('user_list', { idOfferList: idList });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  saveUserValueCategory = async (idUserList: number, idCategory: number) => {
    await this.insertAndGetID('user_value_category', { idUserList, idCategory });
  };
  
  getOfferById = async (id: number):Promise<IOfferList>=>{
    const res =  await this.getByFields('offer_list', {id})
    return res[0] as IOfferList
  }
}
