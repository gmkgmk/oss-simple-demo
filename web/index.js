const aliyunConfig = {
  endpoint: 'oss-cn-shenzhen.aliyuncs.com',
  url: 'http://guomk.oss-cn-shenzhen.aliyuncs.com/',
  bucket: 'guomk',
  folder: 'image/'
};

(function() {
  const tokenBtn = $$('#getToken');
  const sendImage = $$('#sendBtn');
  const input = $$('#input');
  const imgNode = $$('#img');

  let config = {};
  let fileData;

  tokenBtn.addEventListener('click', async () => {
    config = await fetch('http://localhost:3000').then(res => res.json());
    console.log('token获取成功');
  });

  sendImage.addEventListener('click', async () => {
    if (!config.AccessKeyId) {
      console.log('请先获取获取token');
      return;
    }
    const client = await createOss(config);
    const file = input.files[0];

    const folder = aliyunConfig.folder;
    const imageName = folder + String(new Date().getTime() + file.name);
    const result = await client.multipartUpload(imageName, file);
    console.log('result: ', result);
    imgNode.src = aliyunConfig.url + result.name;
  });
})();

function createOss(result) {
  return new OSS.Wrapper({
    accessKeyId: result.AccessKeyId,
    accessKeySecret: result.AccessKeySecret,
    stsToken: result.SecurityToken,
    endpoint: aliyunConfig.endpoint,
    bucket: aliyunConfig.bucket
  });
}
function $$(str) {
  return document.querySelector(str);
}
