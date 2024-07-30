import {validatenull} from "./validate";
import request from "@/router/axios";
import * as CryptoJS from "crypto-js";
import store from '@/store'
// 数据合并
export function mergeRecursive(source, target) {
  for (let index in target) {
    try {
      if (target[index].constructor === Object) {
        source[index] = mergeRecursive(source[index], target[index]);
      } else {
        source[index] = target[index];
      }
    } catch (e) {
      source[index] = target[index];
    }
  }
  return source;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  if (value === undefined) {
    return "";
  }
  let actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].value === ('' + value)) {
      actions.push(datas[key].label);
      return true;
    }
  })
  if (actions.length === 0) {
    actions.push(value);
  }
  return actions.join('');
}

// 表单序列化
export const serialize = data => {
  let list = [];
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`);
  });
  return list.join("&");
};
export const getObjType = obj => {
  var toString = Object.prototype.toString;
  var map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
};
/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data);
  var obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  delete obj1.close;
  var o1 = obj1 instanceof Object;
  var o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object;
    var t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = status => {
  if (status) {
    document.body.className = document.body.className + " grayMode";
  } else {
    document.body.className = document.body.className.replace(" grayMode", "");
  }
};
/**
 * 设置主题
 */
export const setTheme = name => {
  document.body.className = name;
};

/**
 *加密处理
 */
 export const encryption = params => {
  let { data, type, param, key } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === "Base64") {
    param.forEach(ele => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach(ele => {
      var data = result[ele];
      key = CryptoJS.enc.Latin1.parse(key);
      var iv = key;
      // 加密
      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = callback => {
  function listen() {
    callback();
  }

  document.addEventListener("fullscreenchange", function () {
    listen();
  });
  document.addEventListener("mozfullscreenchange", function () {
    listen();
  });
  document.addEventListener("webkitfullscreenchange", function () {
    listen();
  });
  document.addEventListener("msfullscreenchange", function () {
    listen();
  });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  );
};

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length != 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id == id) {
          return menu[i];
        } else {
          if (menu[i].children[j].children.length != 0) {
            return findParent(menu[i].children[j].children, id);
          }
        }
      }
    }
  }
};

// 判断当前传入的字段值是否存在于树数据中
// export function searchTree(nodesArr, searchKey) {
//   for (let _i = 0; _i < nodesArr.length; _i++) {
//       if (nodesArr[_i].id === searchKey) {
//         // 这个return自己想要的结果就行
//           return true
//       } else {
//           if (nodesArr[_i].children && nodesArr[_i].children.length > 0) {
//             // 如果是vue文件，注意下面换成this.searchTree
//               let res = searchTree(nodesArr[_i].children, searchKey);
//               return res
//           }
//       }
//   }
//   return false
// }

export function searchTree(nodesArr, searchKey) {
  let item;
  const list = [...nodesArr]
  while ((item = list.shift())) {

    if (item.id === searchKey) {
      return true;
    }
    if (item.children && item.children.length) {
      list.push(...item.children)
    }
  }
  return false;
}

/**
 * @btnType {string} 按钮类型:inquire查询，delete删除，update修改
 * @belongTo {number} 所属部门
 * @createBy {string} 创建人
 */
export function handleDataPermissions(btnType, row) {
  if(row.belongTo === 0) return true
  // 定义变量内容
  const {userInfo, infoRest} = store.state.user
  const { dataPermissionDepts, deletePermissionDepts, updatePermissionDepts } = infoRest;
  if(btnType === 'inquire') {
      if(dataPermissionDepts.length !== 0) {
         return searchTree(dataPermissionDepts, row.belongTo)
      }else {
          return userInfo.username === row.createBy 
      }
  }else if(btnType === 'delete') {
      if(deletePermissionDepts.length !== 0) {
          return searchTree(deletePermissionDepts, row.belongTo)
       }else {
           return userInfo.username === row.createBy 
       }
  }else {
      if(updatePermissionDepts.length !== 0) {
          return searchTree(updatePermissionDepts, row.belongTo)
       }else {
           return userInfo.username === row.createBy 
       }
  }
 
}

/**
 * 动态插入css
 */

export const loadStyle = url => {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
};

/**
 * 动态插入script标签
 */

 export const loadScript = url => {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(script);
};
/**
 * 判断路由是否相等
 */
export const isObjectValueEqual = (a, b) => {
  let result = true;
  Object.keys(a).forEach(ele => {
    const type = typeof a[ele];
    if (type === "string" && a[ele] !== b[ele]) result = false;
    else if (
      type === "object" &&
      JSON.stringify(a[ele]) !== JSON.stringify(b[ele])
    )
      result = false;
  });
  return result;
};
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  let result = "";
  if (validatenull(dic)) return value;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    let index = 0;
    index = findArray(dic, value);
    if (index != -1) {
      result = dic[index].label;
    } else {
      result = value;
    }
  } else if (value instanceof Array) {
    result = [];
    let index = 0;
    value.forEach(ele => {
      index = findArray(dic, ele);
      if (index != -1) {
        result.push(dic[index].label);
      } else {
        result.push(value);
      }
    });
    result = result.toString();
  }
  return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value == value) {
      return i;
    }
  }
  return -1;
};
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = "";
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len || 4);
  if (date) random = random + Date.now();
  return random;
};

/**
 *
 * @param url 目标下载接口
 * @param query 查询参数
 * @param fileName 文件名称
 * @returns {*}
 */
export function downBlobFile(url, query, fileName) {
  return request({
    url: url,
    method: "get",
    responseType: "blob",
    params: query
  }).then(response => {
    // 处理返回的文件流
    const blob = response.data;
    if (blob && blob.size === 0) {
      this.$notify.error("内容为空，无法下载");
      return;
    }
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(function () {
      URL.revokeObjectURL(blob);
      document.body.removeChild(link);
    }, 0);
  });
}

/**
 * 从数组中删除指定对象
 *  _arr:数组
 *  _obj:需删除的对象
 * */
 export function removeArray(_arr, arrKey, _obj, objKey) {
  let length = _arr.length
  for (let i = 0; i < length; i++) {
    if (_arr[i][arrKey] === _obj[objKey]) {
      if (i === 0) {
        _arr.shift() //删除并返回数组的第一个元素
        return _arr
      } else if (i === length - 1) {
        _arr.pop()  //删除并返回数组的最后一个元素
        return _arr
      } else {
        _arr.splice(i, 1) //删除下标为i的元素
        return _arr
      }
    }
  }
}

//url转为file
export function getFileFromUrl(url, fileName) {
  return new Promise((resolve, reject) => {
      var blob = null;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader('Accept', 'image/png');
      xhr.responseType = "blob";
      // 加载时处理
      xhr.onload = () => {
        // 获取返回结果
          blob = xhr.response;
          let file= new File([blob], fileName, { type: 'image/png' });
          // 返回结果
          resolve(file);
      };
      xhr.onerror = (e) => {
          reject(e)
      };
      // 发送
      xhr.send();
  });
}

// 递归返回字段, 同步获取两个数据源
export function getChildrenById(data, _id, field) {
    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item._id === _id) {
            return item;
        }
        if (item[field] && item[field].length) {
            const is = getChildrenById(item[field], _id, field)
            if (is) {
                return is;
            }
        }
    }
}
