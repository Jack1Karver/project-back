import { IAuthor } from '../../models/author.model';
import { IBookLiterary } from '../../models/book-literary.model';
import { ICategory } from '../../models/category.module';
import { IOfferList } from '../../models/offer-list.model';
import { StatusRepository } from '../status/status.repository';
import { UserListRepository } from '../userList/user-list.repository';
import { OfferListRepository } from './offer-list.repository';

export class OfferListService {
  offerRepository = new OfferListRepository();
  userListRepository = new UserListRepository();
  statusRepository = new StatusRepository();

  saveOffer = async (idUser: number, book: IBookLiterary, author: IAuthor, categories: string[], offer: IOfferList) => {
    try {
      await this.offerRepository.startTransaction()
      const offerId = await this.offerRepository.saveOffer({
        ...offer,
        yearPublishing: new Date(offer.yearPublishing),
        idBookLiterary: (await this.getBookId(book, author))!,
        idUser: idUser,
        createAt: new Date(),
        updateAt: new Date(),
        idStatus: await this.getStatus('Новый'),
      });
      if (offerId) {
        const userListId = await this.userListRepository.saveUserList('offer', offerId);
        if (userListId) {
          const categoriesId = await this.getCategories(categories);
          console.log(categoriesId)
          for(let id of categoriesId){
            await this.userListRepository.saveUserValueCategory(userListId, id);
          }
        }
      }
      await this.offerRepository.commitTransaction();

    } catch (e) {
      console.log(e)
      await this.offerRepository.rollbackTransaction();
      console.log('rollback')
      throw new Error
    }
  };

  getCategories = async (categories: string[]) => {
    try{
    let categoriesId: number[] = []

    for(let category of categories){
      const idCategory = await this.userListRepository.getCategory(category);
      if (idCategory) {
        categoriesId.push(idCategory.id);
      }else{
        const res = await this.userListRepository.saveCategory(category);
      if(res){
        categoriesId.push(res);
      }
      }
    }      
    return categoriesId
    }
    catch(e){
      console.log(e)
      throw new Error
    }
  };

  getStatus = async (status: string) => {
    try{
    let statusId = await this.statusRepository.getStatus({ name: status });
    if (!statusId) {
      return await this.statusRepository.insertStatus(status);
    }
    return statusId.id;
  } catch(e){
    console.log(e)
    throw new Error
  }
  };

  getBookId = async (book: IBookLiterary, author: IAuthor) => {
    try{
    let authorId = (await this.offerRepository.getAuthor(author));
    return await this.offerRepository.saveBook({
      ...book,
      idAuthor: authorId ? authorId.id : await this.offerRepository.saveAuthor(author),
    });
  } catch(e){
    console.log(e)
    throw new Error
  }
  };
}
