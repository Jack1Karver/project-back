import { IUserAddress } from '../../models/user-address.model';
import { AddressRepository } from './address.repository';

export class AddressService {
  addressRepository = new AddressRepository();

  saveAddress = async (address: IUserAddress, userId: number) => {
    let isDefault;
    try {
      if(address.isDefault){
        isDefault = address.isDefault
      } else{
        isDefault = !(await this.getAddressesById(userId)).length;
      }
      
      this.addressRepository.saveAddress({
        ...address,
        idUser: userId,
        isDefault: isDefault
      });
    } catch (e) {}
  };

  getAddressesById = (userId: number) => {
    return this.addressRepository.getAddressById(userId);
  };
}
