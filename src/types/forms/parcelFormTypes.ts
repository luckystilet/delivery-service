import type { EOrderParcelTypes } from '~/types/deliveryTypes'

export interface IFormValidateParcel {
  cityFrom: string
  cityTo: string
  type: EOrderParcelTypes | null
  date: number | null
  description: string
}
