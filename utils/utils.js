const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatTime1 = date => {
  let date1 = new Date(date)
  const year = date1.getFullYear()
  let month = date1.getMonth() + 1
  month = month >= 10 ? month : '0' + month
  return year + '年' + month + '月'
}
const formatTime2 = date => {
  let date1 = new Date(date)
  const year = date1.getFullYear()
  let month = date1.getMonth() + 1
  let day = date1.getDate()
  month = month >= 10 ? month : '0' + month
  day = day >= 10 ? day : '0' + day
  return year + '年' + month + '月' + day + '日'
}
const getBackRoute=()=>{
  let routes=getCurrentPages()
  routes=routes.map(item=>item.route)
  let beforeRoutes=routes.slice(0,routes.length-1)
  console.log(beforeRoutes, beforeRoutes.indexOf(routes[routes.length-1]))
  if(routes.indexOf(routes[routes.length]>=0)){

  }
  return routes
}
module.exports = {
  formatTime: formatTime,
  formatTime1: formatTime1,
  formatTime2: formatTime2,
  getBackRoute
}