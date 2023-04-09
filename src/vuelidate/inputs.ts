import { helpers, minLength, required } from '@vuelidate/validators'

export const cityFrom = () => ({
  required,
  minLength: helpers.withMessage('City should be at least 2 letters', minLength(2)),
})
export const cityTo = () => ({
  required,
  minLength: helpers.withMessage('City should be at least 2 letters', minLength(2)),
})
