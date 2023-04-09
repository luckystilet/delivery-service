export enum EOrderParcelTypes {
  gadgets = 'gadgets',
  drinks = 'drinks',
  clothes = 'clothes',
  medicines = 'medicines',
  other = 'other',
}
export enum EDeliveryTypes {
  order = 'order',
  deliver = 'deliver',
}
export enum EEditableFields {
  date = 'date',
  cityTo = 'cityTo',
  cityFrom = 'cityFrom',
  description = 'description',
  type = 'type',
}
/** Base Interfaces */
interface IBase_DeliveryAdd {
  cityFrom: string
  cityTo: string
  date: number | string | null
}
interface IBase_DB {
  id: string
  createdat: number | string
}
/** Order */
export interface IOrderAdd extends IBase_DeliveryAdd {
  type: EOrderParcelTypes | null
  description: string
  deliveryType: EDeliveryTypes.order
}
export interface IOrder extends IBase_DB, IOrderAdd {}
/** Deliver */
export interface IDeliverAdd extends IBase_DeliveryAdd {
  deliveryType: EDeliveryTypes.deliver
}
export interface IDeliver extends IBase_DB, IDeliverAdd {}
export type TOrderOrDeliver = IOrder | IDeliver
export interface IUserRequestListWithMatches extends TOrderOrDeliver {
  matches: IUserRequestMatches[]
}
export interface IUserRequestMatches extends TOrderOrDeliver {
  userId: string
}
