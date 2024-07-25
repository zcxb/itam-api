// 是否只是数字
export const regInter = /^\d+$/;
// 中国手机号
export const regCNMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

export const regSpecText = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]./?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");

export const parseKeyword = (keyword = '') => {
  const _text = keyword.trim();
  const is_num = regInter.test(_text);
  return {
    keyword: _text,
    is_id: is_num,
    is_mobile: is_num && regCNMobile.test(_text),
    is_name: /^(?:[\u4e00-\u9fa5·]{2,4})$/.test(_text),
  };
};

// /utils/regex.js
export const reg_address =
  '(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)(?<district>[^县]+县|.+?(区{1})|.+市|.+旗|.+海域|.+岛)?(?<detail_address>.*)';

// utils/index.js
/**
 * 识别地址 省市区其他
 * @param {string} str 收货地址
 * @returns { province: '重庆', city: '重庆市', district: '梁平区', detail_address: '和林镇xxx' }
 */
export const extractAddress = (str) => {
  if (!str) return; // 中国4个直辖市
  const municipality = ['重庆', '北京', '上海', '天津'];
  const subStr = str.substring(0, 2);
  const isExist = municipality.includes(subStr);
  if (isExist) {
    str = str.substring(2, str.length - 1);
    str = `${subStr}省${str}`;
  }
  const addr = str.match(reg_address);
  if (!addr) return;
  const groups = Object.assign({}, addr.groups); // 如果是直辖市，截取地址后，把省字替换成市
  if (isExist) {
    groups.province = groups.province.replace('省', '');
  }
  return groups;
};
