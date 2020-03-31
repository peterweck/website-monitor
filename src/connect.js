import { logException, SUCCESS, FAILERROR } from './utils';

const sitecall = func => {
  const MAX = 3;
  for (let n = 0; n < MAX; n += 1) {
    try {
      return func();
    } catch (e) {
      if (n === MAX - 1) {
        logException(e);
        throw e;
      }
      Utilities.sleep(2 ** n * 20000 + Math.round(Math.random() * 1000));
    }
  }
  return null;
};

const getSiteStatus = (url = '') => {
  let maxtries = 3;
  let fetchurl = url;
  let rtn = false;
  const fn = () =>
    UrlFetchApp.fetch(fetchurl, {
      validateHttpsCertificates: false,
      followRedirects: false,
      muteHttpExceptions: false
    });
  while (!rtn && maxtries > 0) {
    maxtries -= 1;
    try {
      const response = sitecall(fn);
      const headers = response.getHeaders();
      const responseCode = response.getResponseCode();
      if (responseCode >= 300 && responseCode < 400) {
        if (headers.Location && headers.Location.match(/\/main\/error$/)) {
          rtn = FAILERROR;
        } else {
          fetchurl = headers.Location;
        }
      } else {
        rtn = response.getResponseCode();
      }
    } catch (f) {
      logException(f);
      rtn = SUCCESS - 1;
    }
  }
  return rtn;
};

export default getSiteStatus;
