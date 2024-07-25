import { bankCardNoMask, idCardMask, mobileMask, tryFixedField } from './util';

/**
 * 数据掩码
 * @param data
 * @returns
 */
export function sensitiveDataMask(data: Record<string, any> | Array<any>) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  // id_card、mobile、bank_card_no
  const dataMask = (row) => {
    if (row['id_card']) {
      row['id_card'] = idCardMask(row['id_card']);
    }
    if (row['mobile']) {
      row['mobile'] = mobileMask(row['mobile']);
    }
    if (row['bank_card_no']) {
      row['bank_card_no'] = bankCardNoMask(row['bank_card_no']);
    }
  };
  if (Array.isArray(data)) {
    data.forEach((row) => {
      dataMask(row);
    });
  } else {
    dataMask(data);
  }
  return data;
}

/**
 * 将请求数据是string类型的去除前后空格，\n \r，
 * excel导入数据和前端用户输入的数据容易出现此问题
 * 注意：对象为浅拷贝，嵌套对象自己做处理
 * @param data 对象，或者是数组对象
 * @returns 修改后的对象
 */
export function fixedFields(data: Record<string, any> | Array<any>) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  const fixedField = (row) => {
    const keys = Object.keys(row);
    const _data = {};
    keys.forEach((key) => {
      if (key && typeof key === 'string') {
        _data[key] = tryFixedField(row[key]);
      } else {
        _data[key] = row[key];
      }
    });
    return _data;
  };
  if (Array.isArray(data)) {
    const _rows = [];
    data.forEach((row) => {
      _rows.push(fixedField(row));
    });
    return _rows;
  } else {
    return fixedField(data);
  }
}
