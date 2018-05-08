export function getURLParams(key) {
  let strHref = window.document.location.href;
  let intPos = strHref.indexOf("?");
  let strRight = strHref.substr(intPos + 1);
  let arrTmp = strRight.split("&");
  for (let i = 0; i < arrTmp.length; i++) {
    let arrTemp = arrTmp[i].split("=");
    if (arrTemp[0].toUpperCase() === key.toUpperCase()) return arrTemp[1];
  }
  return "";
};
