import { EOrderParcelTypes } from '~/types/deliveryTypes'
import type { ISelectItem } from '~/types/selectTypes'

export const selectData: ISelectItem[] = [
  { title: 'Gadgets', value: EOrderParcelTypes.gadgets },
  { title: 'Drinks', value: EOrderParcelTypes.drinks },
  { title: 'Clothes', value: EOrderParcelTypes.clothes },
  { title: 'Medicines', value: EOrderParcelTypes.medicines },
  { title: 'Other', value: EOrderParcelTypes.other },
]
