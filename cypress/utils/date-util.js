const formatDate = (date) => {
  let d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  let year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }

  return [day, month, year].join('/')
}

const getYesterday = () => {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  return formatDate(yesterday)
}

const getFutureDate = () => {
  const today = new Date()
  const future = new Date()
  future.setDate(today.getDate() + 1000)
  return formatDate(future)
}

export { getYesterday, getFutureDate }
