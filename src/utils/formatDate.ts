import { useDateFormat } from '@vueuse/core'

export const formatDate = (inputDate) => {
  const date = new Date(inputDate)
  if (inputDate === null) return 'Not selected'
  const res = useDateFormat(date, 'YYYY-MM-DD HH:mm')
  return res.value
}
