const Koa = require('koa2');
const { STS } = require('ali-oss');
const fs = require('fs');

const app = new Koa();
const path = require('path');
const conf = require('./config');

const stsRequest = async ctx => {
  ctx.set('Access-Control-Allow-Origin', '*');
  const client = new STS({
    accessKeyId: conf.AccessKeyId,
    accessKeySecret: conf.AccessKeySecret
  });
  let policy;

  const result = await client
    .assumeRole(conf.RoleArn, policy, conf.TokenExpireTime)
    .catch(err => {
      console.log(err);
    });

  let body = {
    AccessKeyId: result.credentials.AccessKeyId,
    AccessKeySecret: result.credentials.AccessKeySecret,
    SecurityToken: result.credentials.SecurityToken,
    Expiration: result.credentials.Expiration
  };
  ctx.body = body;
};
app.use(stsRequest);
app.listen(3000, () => {
  console.log('app is listening at porn 3000!');
});
