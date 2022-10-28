"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatNumber = exports.formatDate = void 0;
exports.getUserDisplayName = getUserDisplayName;
exports.getUserTextAttr = getUserTextAttr;
var _dateFns = require("date-fns");
var _accounting = _interopRequireDefault(require("accounting"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getUserTextAttr(user, key) {
  if (!user || !user.attributes) return;
  for (var i in user.attributes) {
    var attr = user.attributes[i];
    if (attr.key !== key) continue;
    return attr.text || '';
  }
  return '';
}
function getUserDisplayName(user) {
  if (!user) return '';
  var id = user.id || '';
  let name = getUserTextAttr(user, 'fullname');
  if (name && name.trim().length > 0) {
    name = name.trim();
  } else {
    const shortId = id.substr(id.length - 4, 4);
    var city = getUserTextAttr(user, 'trace_city_name');
    var country = getUserTextAttr(user, 'trace_country_name');
    if (city) {
      name = `${city} #${shortId}`;
    } else if (country) {
      name = `${country} #${shortId}`;
    } else {
      name = `User #${shortId}`;
    }
  }
  return name.trim();
}
var formatNumber = _accounting.default.formatNumber;
exports.formatNumber = formatNumber;
var formatDate = _dateFns.format;
exports.formatDate = formatDate;