import { MethodType, TopCoreFactory } from '@easy-front-core-sdk/top';

export async function item_seller_get(
  app_key,
  shop_token,
  { goods_id, fields }: { goods_id: string; fields?: string },
) {
  const default_fields = 'title,item_img,desc,cid,detail_url,price,sku';
  const topCore = TopCoreFactory.getCore(app_key);
  const res = await topCore.makeRequest(
    MethodType.ITEM_SELLER_GET,
    {
      num_iid: parseInt(goods_id),
      fields: fields ?? default_fields,
    },
    {
      session: shop_token,
    },
  );
  // console.log('taobao.item.seller.get: ', JSON.stringify(res));
  return res?.item;
}

export async function item_upshelf(app_key, shop_token, { goods_id }: { goods_id: string }) {
  const topCore = TopCoreFactory.getCore(app_key);
  const res = await topCore.makeRequest(
    MethodType.ITEM_OPERATE_UPSHELF,
    {
      item_id: parseInt(goods_id),
    },
    { session: shop_token },
  );
  console.log('item.operate.upshelf: ', JSON.stringify(res));
  return res;
}

export async function item_downshelf(app_key, shop_token, { goods_id }: { goods_id: string }) {
  const topCore = TopCoreFactory.getCore(app_key);
  const res = await topCore.makeRequest(
    MethodType.ITEM_OPERATE_DOWNSHELF,
    {
      item_id: parseInt(goods_id),
    },
    { session: shop_token },
  );
  console.log('item.operate.downshelf: ', JSON.stringify(res));
  return res;
}

export async function item_delete(app_key, shop_token, { goods_id }: { goods_id: string }) {
  const topCore = TopCoreFactory.getCore(app_key);
  try {
    const res = await topCore.makeRequest(
      MethodType.ITEM_OPERATE_DELETE,
      {
        item_id: parseInt(goods_id),
      },
      {
        session: shop_token,
      },
    );
    console.log('item.operate.delete: ', JSON.stringify(res));
    return res;
  } catch (error) {
    return { error: error.message };
  }
}
