const url = 'https://www.hsgd1995.xyz/PEIXUN';
//const url = 'http://www.localhost/PEIXUN';
//const domain = 'http://www.localhost';
const domain = 'https://www.hsgd1995.xyz';
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
/**
 * 学历提示模块根据页码获
 */
function getTextByPageNo(pageNo) {
  console.log('pageNo',pageNo);
  var data = {};

  switch (pageNo) {
    case '0':
      data.title = '广播电视大学';
      break;
    case '1':
      data.title = '函数教育';
      break;
    case '2':
      data.title = '网络教育';
      break;
    default:
      data.title = '';
      break;
  }

  return data;
}

//往外输出本js的内容
module.exports = {
  formatTime: formatTime,
  getTextByPageNo: getTextByPageNo,
  url:url,
  domain: domain
}


