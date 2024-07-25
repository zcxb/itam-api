import { ResponseCode } from '@config/global';
interface SignJsonData {
  [key: string]: any;
}

export function transArrayToObject(ary, key) {
  const obj = {};
  for (const item of ary) {
    obj[item[key]] = {
      ...item,
    };
  }
  return obj;
}

export function sortAsc(o: SignJsonData): string {
  const n: string[] = [];
  for (const k in o) n.push(k);
  n.sort();
  let str = '';
  for (let i = 0; i < n.length; i++) {
    let v = o[n[i]];
    if (v !== '') {
      if ({}.toString.call(v) === '[object Object]') {
        v = `{${sortAsc(v)}}`;
      } else if ({}.toString.call(v) === '[object Array]') {
        let ary = '';
        for (const t of v) {
          if ({}.toString.call(t) === '[object Object]') {
            ary += `,{${sortAsc(t)}}`;
          } else {
            ary += `,${sortAsc(t)}`;
          }
        }
        v = '[' + ary.slice(1) + ']';
      }
      str += '&' + n[i] + '=' + v;
    }
  }
  return str.slice(1);
}

export function dateFormat(date: Date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds().toString().substr(0, 3), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

export function OkResponse(data?: any, msg = 'OK') {
  return {
    code: ResponseCode.OK,
    data,
    msg,
  };
}

export function ErrorResponse(code: ResponseCode, msg: string | Error) {
  if (typeof msg === 'string') {
    return {
      code,
      data: null,
      msg,
    };
  }

  return {
    code,
    data: null,
    msg: msg.message || JSON.stringify(msg),
  };
}

export function randomNo(len = 6) {
  let random_no = '';
  for (let i = 0; i < len; i++) {
    random_no += Math.floor(Math.random() * 10);
  }
  return random_no;
}

export function invitationCode(id) {
  const sourceString = '431EYZDOWGVJ5AQMSFCU2TBIRPN796XH0KL';

  let num = parseInt(id);

  let code = '';

  while (num > 0) {
    const mod = num % 35;

    num = (num - mod) / 35;

    code = sourceString.substr(mod, 1) + code;
  }

  code = '888888' + code; //长度不足8，前面补全

  code = code.slice(code.length - 4, code.length); //截取最后8位字符串

  return code;
}

export function await2<T, U = Error>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data]) // 执行成功，返回数组第一项为 null。第二个是结果。
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined]; // 执行失败，返回数组第一项为错误信息，第二项为 undefined
    });
}

export const wait = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const isJsonStr = (str: string) => {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
};

export const tryFixedField = (field: string) => {
  if (!field) {
    return field;
  }
  return field.trim().replace(/\r/g, '').replace(/\n/g, '');
};

export const makeSort = (params: Record<string, any>) => {
  const sortKeys = Object.keys(params).sort();
  const sortObj = {};
  for (const k of sortKeys) {
    const old = params[k];
    if (Array.isArray(old)) {
      const sortAry = [];
      for (const ary of old) {
        sortAry.push(makeSort(ary));
      }
      sortObj[k] = sortAry;
    } else if (typeof old === 'object') {
      sortObj[k] = makeSort(old);
    } else {
      sortObj[k] = old;
    }
  }
  return sortObj;
};

export const getBirthdayByID = (idCard: string) => {
  const regex = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})(\d|x|X)$/i;
  const match = idCard.match(regex);
  if (!match) {
    throw new Error('无效的身份证号码');
  }

  const [, , year, month, day, genderCode] = match;
  const gender = parseInt(genderCode) % 2 === 0 ? '1' : '0';
  const birthday = `${year}-${month}-${day}`;
  return { birthday, gender };
};

export const mobileMask = (mobile: string) => {
  return mobile?.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2');
};

export const idCardMask = (idCard: string) => {
  return idCard?.replace(/^(\d{6})\d+(\d{3})$/, '$1****$2');
};

export const bankCardNoMask = (bank_card_no: string) => {
  return bank_card_no?.replace(/^(\d{4})\d+(\d{4})$/, '$1****$2');
};

export const replaceSymbol = (ori_string: string) => {
  return ori_string
    .replace(/\#/g, '；')
    .replace(/\+/g, '；')
    .replace(/\-/g, '一')
    .replace(/\@/g, '；')
    .replace(/\=/g, '')
    .replace(/\&/g, '；');
};

export function arrayToTree(items, primary_key = 'id', parent_key = 'parent_id') {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item[primary_key];
    const pid = item[parent_key];

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      };
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children'],
    };

    const treeItem = itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}

export const getLenByChat = (str) => {
  return str.replace(/[^x00-\xff]/g, 'aa').length;
};

export const wrapLineWhenOverLength = (str: string, len: number) => {
  const split = str.split('');
  let res_str = '';
  let curr_line = '';
  for (const c of split) {
    const tmp = curr_line + c;
    // console.log('tmp:', tmp, getLenByChat(tmp))
    if (getLenByChat(tmp) > len) {
      // 超了，换行，并把当前字符放下一行
      res_str += `${res_str ? '\n' : ''}${curr_line}`;
      curr_line = c;
    } else {
      curr_line += c;
    }
  }
  // 加上剩下的一段
  res_str += `${res_str ? '\n' : ''}${curr_line}`;

  // console.log('res_str: ', res_str || curr_line)

  return res_str;
};
