import dingtalk from 'dingtalk-javascript-sdk';

export function authCode() {
  return new Promise(function(resolve, reject) {
    dingtalk.ready(function() {
      dingtalk.apis.runtime.permission.requestAuthCode({
        corpId: fetchCorpId(),
        onSuccess(result) {
          resolve(result);
        },
        onFail(err) {
          reject(err);
        }
      });
    });
  });
}