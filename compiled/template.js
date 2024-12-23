"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _preact = require("preact");
var util = _interopRequireWildcard(require("./util.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let gstyle = `
.text__muted {
	color: #888;
}

.mt-1 {
margin-top:10px
}

.invoice_sublabel {
	font-weight: 400;
	text-transform: uppercase;
	font-size: 13px;
	color: #666;
}

.table.order_print_table {
	border: none;
	table-layout: fixed;
	width: 100%;
}

.table.order_print_table th {
	padding: 10px 10px;
	border: none;
	font-size: 13px;
	font-weight: 500;
	text-transform: uppercase;
	border-bottom: 1px solid #ddd;
	border-top: 1px solid #dee2e6;
}

.table.order_print_table td {
	padding: 5px 10px;
	border: none;
	border-bottom: 1px solid #ddd;
}
`;
class Main extends _preact.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let template = this.props.template;
    return (0, _preact.h)("div", {
      style: `font-family: ${template.font_family};`
    }, (0, _preact.h)("style", null, gstyle), (0, _preact.h)("div", {
      class: "page_section",
      style: "padding: 0px 2cm;"
    }, this.renderHeader()), (0, _preact.h)("div", {
      class: "page_section",
      style: "padding: 0 2cm;"
    }, this.renderPrintOverview()), this.renderItems(), (0, _preact.h)("div", {
      class: "page_section",
      style: "padding: 0 2cm;"
    }, this.renderPaymentMethod()), (0, _preact.h)("div", {
      class: "page_section",
      style: "padding: 0 2cm;"
    }, this.renderTerms()), (0, _preact.h)("div", {
      class: "page_section",
      style: "padding: 0 2cm;"
    }, this.renderSignature()));
  }
  renderPaymentMethod = () => {
    let order = this.props.order || {};
    let method = order.payment_method || {};
    let $method = (0, _preact.h)("div", null, this.props.t('no_information'));
    if (method.method === 'cash') {
      $method = (0, _preact.h)("div", null, this.props.t(`payment_method_cod`));
    } else if (method.method === 'bank_transfer') {
      $method = (0, _preact.h)("div", null, this.props.t(`payment_method_bank_transfer`));
    }
    return (0, _preact.h)("div", {
      style: "margin-top: 0.5cm"
    }, (0, _preact.h)("div", {
      style: "display: flex; align-items: center; margin-top: 20px"
    }, (0, _preact.h)("div", {
      class: "invoice_sublabel"
    }, this.props.t('payment'))), $method);
  };
  renderTerms() {
    let template = this.props.template;
    if (!template.terms_and_conditions) return null;
    return (0, _preact.h)("div", {
      style: "margin-top: 30px"
    }, (0, _preact.h)("div", {
      class: "d-flex",
      style: "align-items: center; margin-top: 20px"
    }, (0, _preact.h)("div", {
      class: "invoice_sublabel"
    }, this.props.t('terms_and_conditions'))), (0, _preact.h)("div", {
      style: "white-space: pre-wrap"
    }, this.props.t.i18n(template.i18n_terms_and_conditions, template.terms_and_conditions)));
  }
  renderSignature = () => {
    let template = this.props.template;
    return (0, _preact.h)("div", {
      style: "margin-top: 30px"
    }, (0, _preact.h)("div", {
      style: "color: #888"
    }, this.props.t.i18n(template.i18n_signature, template.signature)));
  };
  renderItem = (item, i) => {
    let template = this.props.template;
    let product = item.product || {};
    let total = product.price * item.quantity;
    let discount = 0;
    if (item.discount_before_tax) {
      if (item.discount_type == 'percentage') {
        discount = total * (item.discount_percentage || 0) / 100;
      } else if (item.discount_type == 'amount') {
        if (item.discount > 0) discount = item.discount;
      }
    }
    total -= discount;
    if (total < 0) {
      total = 0;
    }
    let itemtax = item.tax;
    let tax = '0%';
    if (itemtax) tax = (itemtax.percentage || 0) + '%';
    let $props = null;
    if (Array.isArray(product.props) && product.props.length) {
      let propsText = (product.props || []).map(prop => prop.value).join(' - ');
      $props = (0, _preact.h)("div", {
        style: "color: #888; font-size: 14px;"
      }, propsText);
    }
    return (0, _preact.h)("tr", null, (0, _preact.h)("td", {
      style: "padding-left: 0; width: 20px; text-align: left"
    }, i + 1), (0, _preact.h)("td", {
      style: "vertical-align: top; padding: 0; white-space: pre-wrap; padding: 10px"
    }, (0, _preact.h)("div", null, product.name), $props, (0, _preact.h)("div", {
      style: "color: #888"
    }, item.note)), (0, _preact.h)("td", {
      style: `width: 100px; text-align: right; padding: 0; height: 1px; padding: 10px; font-family: ${template.number_font_family}`
    }, util.formatNumber(product.price)), (0, _preact.h)("td", {
      style: "width: 50px; text-align: center; padding: 0; height: 1px;padding: 10px"
    }, item.quantity), (0, _preact.h)("td", {
      style: `width: 115px; text-align: right; padding-left: 0; padding-right: 0px; overflow: unset;font-family: ${template.number_font_family}`
    }, util.formatNumber(total)));
  };
  renderItems = () => {
    let acc = this.props.account;
    let template = this.props.template;
    let order = this.props.order;
    let $header = (0, _preact.h)("tr", {
      style: `background: ${template.secondary_color}; color: ${template.primary_color}`
    }, (0, _preact.h)("th", {
      style: "padding-left: 0;width: 20px; text-align: left"
    }, "#"), (0, _preact.h)("th", {
      style: "text-align: left"
    }, this.props.t('product')), (0, _preact.h)("th", {
      style: "width: 100px; text-align: right"
    }, this.props.t('price')), (0, _preact.h)("th", {
      style: "width: 50px; text-align: center"
    }, this.props.t('qty')), (0, _preact.h)("th", {
      style: "padding-right: 0;width: 115px; text-align: right"
    }, "Th\xE0nh ti\u1EC1n"));
    let items = order.items || [];
    let $rows = items.map(this.renderItem);
    let $adjustment = null;
    let adjustment = order.adjustment || 0;
    if (adjustment != 0 || order.adjustment_description) $adjustment = (0, _preact.h)("div", {
      style: "align-items: center; display: flex; justify-content: space-between;"
    }, (0, _preact.h)("div", {
      style: "width: 140px"
    }, order.adjustment_description || (0, _preact.h)("span", {
      style: "color: #888"
    }, this.props.t('empty'))), (0, _preact.h)("div", {
      style: `font-family: ${template.number_font_family}`
    }, util.formatNumber(adjustment)));
    let $ship = null;
    if (order.shipping) {
      $ship = (0, _preact.h)("div", {
        style: "display: flex; justify-content: space-between;"
      }, (0, _preact.h)("div", {
        class: "text-truncate"
      }, this.props.t('shipping_fee')), (0, _preact.h)("div", {
        style: `font-family: ${template.number_font_family}`
      }, util.formatNumber(order.shipping.nominal_fee)));
    }
    let total = order.total;
    let subtotal = order.subtotal;
    let discountbeforetax = items.map(item => {
      let discounttype = item.discount_type || 'percentage';
      let price = item.product && item.product.price || 0;
      let item_total = price * item.quantity;
      return item_total - item.total;
    }).reduce((s, a) => s + a, 0);
    let $note = (0, _preact.h)("div", {
      style: "flex: 1; padding: 0"
    });
    if (order.note) {
      $note = (0, _preact.h)("div", {
        style: "padding: 0; flex: 1"
      }, (0, _preact.h)("div", null, this.props.t('note')), (0, _preact.h)("div", null, order.note));
    }
    let left = (order.total || 0) - (order.payment_made || 0);
    if (left <= 0) left = 0;
    let $discountbeforetax = null;
    if (discountbeforetax) {
      $discountbeforetax = (0, _preact.h)("div", {
        style: "display: flex; justify-content: space-between; align-items: center"
      }, (0, _preact.h)("div", {
        style: "flex-shrink: 0"
      }, this.props.t('discount_before_tax'), "\xA0"), (0, _preact.h)("div", {
        style: `font-family: ${template.number_font_family}`
      }, "-", util.formatNumber(discountbeforetax)));
    }
    let discount = 0;
    let discount_note = '';
    if (order.discount_type === 'percentage') {
      discount = order._computed_discount;
      discount_note = `(${(order.discount_percentage || 0) / 100}%)`;
    }
    if (order.discount_type === 'amount') {
      discount = order.discount_amount;
    }
    let $discountaftertax = null;
    if (discount) {
      $discountaftertax = (0, _preact.h)("div", {
        style: "display: flex; justify-content: space-between; align-items: center"
      }, (0, _preact.h)("div", {
        style: "flex-shrink: 0"
      }, this.props.t('discount_after_tax'), "\xA0", discount_note), (0, _preact.h)("div", {
        style: `font-family: ${template.number_font_family}`
      }, "-", util.formatNumber(discount)));
    }
    return (0, _preact.h)("div", {
      style: "margin-top: 30px; padding: 0px 2cm;"
    }, (0, _preact.h)("div", {
      style: "display: flex;align-items: center; margin-top: 20px; margin-bottom: 5px"
    }, (0, _preact.h)("div", {
      class: "invoice_sublabel"
    }), (0, _preact.h)("div", {
      style: "flex: 1"
    }), (0, _preact.h)("div", null, this.props.t('currency'), ": ", order.currency || acc.currency || 'VND')), (0, _preact.h)("div", null, (0, _preact.h)("table", {
      class: "order_print_table table mt-2",
      cellspacing: "0",
      cellpadding: "0"
    }, $header, $rows)), (0, _preact.h)("div", {
      class: "page_section",
      style: "display: flex; margin-top: 10px"
    }, $note, (0, _preact.h)("div", {
      style: "width: 7cm; margin-left: 10px"
    }, $discountbeforetax, (0, _preact.h)("div", {
      style: "display: flex; justify-content: space-between;"
    }, (0, _preact.h)("div", null, this.props.t('subtotal')), (0, _preact.h)("div", {
      style: `font-family: ${template.number_font_family}`
    }, util.formatNumber(subtotal))), $ship, (0, _preact.h)("div", {
      style: "display: flex; justify-content: space-between;"
    }, (0, _preact.h)("div", null, this.props.t('tax')), (0, _preact.h)("div", {
      style: `font-family: ${template.number_font_family}`
    }, util.formatNumber(order.total_tax))), $discountaftertax, $adjustment, (0, _preact.h)("div", {
      style: "display: flex; justify-content: space-between;align-items: center; margin-top: 15px;"
    }, (0, _preact.h)("b", {
      style: "font-size: 18px"
    }, this.props.t('total')), (0, _preact.h)("div", {
      style: `font-size: 18px; font-weight: 600;font-family: ${template.number_font_family}`
    }, util.formatNumber(total))), (0, _preact.h)("div", {
      style: "display: flex; justify-content: space-between; "
    }, (0, _preact.h)("div", null, this.props.t('paid_state')), (0, _preact.h)("div", {
      style: `font-family: ${template.number_font_family}`
    }, util.formatNumber(order.payment_made))), (0, _preact.h)("div", {
      style: "display: flex; justify-content: space-between; "
    }, (0, _preact.h)("div", null, this.props.t('balance_due')), (0, _preact.h)("div", {
      style: `font-family: ${template.number_font_family}; color: ${template.primary_color}`
    }, util.formatNumber(left))))));
  };
  renderPrintOverview = () => {
    let order = this.props.order;
    let template = this.props.template;
    let $shipping = (0, _preact.h)("div", {
      style: "flex: 1"
    });
    let shipping = order.shipping || {};
    let addr = shipping.address || {};
    let address = [addr.address, addr.ward, addr.district, addr.province, addr.country].filter(a => a).join(', ');
    if (address) {
      $shipping = (0, _preact.h)("div", {
        style: "flex: 1;"
      }, (0, _preact.h)("div", {
        class: "invoice_sublabel mt-1"
      }, this.props.t('shipping_to')), (0, _preact.h)("div", null, address));
    }
    let user = order.user || {};
    let userattrs = user.attributes || [];
    let userdisplayname = util.getUserDisplayName(user);
    let phoneattr = userattrs.find(attr => attr.key === 'phones') || {
      key: 'phones',
      text: ''
    };
    let phone = (addr.phone || '').trim();
    phone = phone || (phoneattr.text || '').trim();
    let left = (order.total || 0) - (order.payment_made || 0);
    if (left <= 0) left = 0;
    return (0, _preact.h)("div", {
      style: "display: flex; margin-top: 30px"
    }, (0, _preact.h)("div", {
      style: "display: flex; flex-direction: column; justify-content: flex-end"
    }, (0, _preact.h)("div", {
      style: "flex: 1"
    }), (0, _preact.h)("div", {
      class: "invoice_sublabel",
      style: "margin-top: 10px"
    }, this.props.t('customer')), (0, _preact.h)("div", null, userdisplayname), (0, _preact.h)("div", null, phone), $shipping), (0, _preact.h)("div", {
      style: "flex: 1"
    }), (0, _preact.h)("div", {
      style: "display: flex; flex-direction: column; text-align: right"
    }, (0, _preact.h)("div", null, (0, _preact.h)("div", {
      class: "invoice_sublabel"
    }, this.props.t('invoice_date')), (0, _preact.h)("div", null, util.formatDate(order.invoice_date || order.created || Date.now(), 'yyyy/MM/dd'))), (0, _preact.h)("div", null, (0, _preact.h)("div", {
      class: "invoice_sublabel mt-1"
    }, this.props.t('due_date')), (0, _preact.h)("div", null, util.formatDate(order.due_date || order.invoice_date || order.created || Date.now(), 'yyyy/MM/dd'))), (0, _preact.h)("div", {
      style: "flex: 1"
    })));
  };
  renderHeader = () => {
    let order = this.props.order;
    let acc = this.props.account;
    let template = this.props.template;
    return (0, _preact.h)("div", {
      style: "display: flex"
    }, (0, _preact.h)("div", {
      style: "flex:1;"
    }, (0, _preact.h)("div", {
      style: ""
    }, (0, _preact.h)("img", {
      width: "120",
      src: acc.logo_url
    }), (0, _preact.h)("div", {
      style: "margin-top: 10px"
    }, (0, _preact.h)("div", null, (0, _preact.h)("b", {
      style: "font-size: 18px"
    }, acc.name), (0, _preact.h)("span", {
      style: "color: #888; font-size: 13px"
    }, "\xA0\xA0|\xA0\xA0", this.props.t.i18n(template.i18n_tagline, template.tagline))), (0, _preact.h)("div", {
      style: "font-size: 13px; color: #888; margin-top: 0px"
    }, acc.address, "\xA0\xA0\xB7\xA0\xA0", this.props.t('phn'), ":\xA0", acc.phone)))), (0, _preact.h)("div", {
      style: "display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end"
    }, (0, _preact.h)("div", {
      style: `text-transform: uppercase; font-size: 32px;  font-weight: 600;  color: ${template.primary_color}; padding: 0px`
    }, this.props.t('invoice')), (0, _preact.h)("div", {
      class: "text__muted"
    }, "#", order.number || order.id)));
  };
}
exports.default = Main;