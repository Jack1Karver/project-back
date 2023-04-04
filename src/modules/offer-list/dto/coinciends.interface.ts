import { IOfferList } from "../../../models/offer-list.model";
import { IUserAddress } from "../../../models/user-address.model";
import { IUser, IUserExtended } from "../../../models/user.model";
import { IWishList } from "../../../models/wish-list.model";

export interface ICoincidences{
    full: ICoincidence[],
    partial: ICoincidence[],
}

export interface ICoincidence{
    wish: IWishList
    offer: IOfferList,
    user: IUserExtended,
    address: IUserAddress| null
    offerOfferrer?: IOfferList | null,
    wishOfferrer?: IWishList | null
}