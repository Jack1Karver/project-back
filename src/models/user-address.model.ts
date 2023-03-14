export interface IUserAddress {
  id: number;
  udUser: number;
  addrIndex: string;
  addrCity: string;
  addrStreet: string;
  addrHouse: string;
  addrStructure?: string;
  addrApart?: string;
  isDefault: boolean;
}
