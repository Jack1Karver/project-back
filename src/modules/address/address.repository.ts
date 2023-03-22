import { AbstractRepository } from '../../db/abstract.repository';
import { IUserAddress } from '../../models/user-address.model';

export class AddressRepository extends AbstractRepository {

  getAddressById = async (userId: number): Promise<IUserAddress[]> => {
    try {
      const res = await this.connection.sqlQuery(
        `SELECT * FROM user_address JOIN user_table ON (user_address."idUser" = user_table.id) WHERE user_table.id = ${userId}`
      );
      return res as IUserAddress[];
    } catch (e) {
      console.log(e);
      return []
    }
  };

  saveAddress = async (address: IUserAddress) => {
    try {
      return await this.insertAndGetID('user_address', address);
    } catch (e) {
      console.log(e)
      throw new Error
    }
  };

  getDefaultUserAddress = async (userId: number)=>{
    try{
    const res = await this.connection.sqlQuery(
      `SELECT * FROM user_address JOIN user_table ON (user_address."idUser" = user_table.id) WHERE user_table.id = ${userId} AND user_address."isDefault" = true LIMIT 1`
    );
    if(res.length){
      return res[0] as IUserAddress;
    } return null
    
  } catch (e) {
    console.log(e);
    throw new Error
  }
  }

  updateDefaultAddress = async (userId: number)=>{
    await this.connection.sqlQuery(`UPDATE user_address SET "isDefault" = false WHERE "idUser" = ${userId}`)
  }
}
