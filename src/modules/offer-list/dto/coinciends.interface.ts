import { IOfferList } from "../../../models/offer-list.model";
import { IUserAddress } from "../../../models/user-address.model";
import { IUser, IUserExtended } from "../../../models/user.model";

export interface ICoincidences{
    full: ICoincidence[],
    partial: ICoincidence[],
    another: ICoincidence[]
}

export interface ICoincidence{
    offer: IOfferList,
    user: IUserExtended,
    address: IUserAddress| null
}