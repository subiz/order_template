import {h, Component} from 'preact'
import * as util from './util.js'

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
`

export default class Main extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let template = this.props.template

		return (
			<div style={`font-family: ${template.font_family};`}>
				<style>{gstyle}</style>
				<div class='page_section' style='padding: 0px 2cm;'>
					{this.renderHeader()}
				</div>
				<div class='page_section' style='padding: 0 2cm;'>
					{this.renderPrintOverview()}
				</div>
				{this.renderItems()}
				<div class='page_section' style='padding: 0 2cm;'>
					{this.renderPaymentMethod()}
				</div>
				<div class='page_section' style='padding: 0 2cm;'>
					{this.renderTerms()}
				</div>
				<div class='page_section' style='padding: 0 2cm;'>
					{this.renderSignature()}
				</div>
			</div>
		)
	}

	renderPaymentMethod = () => {
		let order = this.props.order || {}
		let method = order.payment_method || {}

		let $method = <div>{this.props.t('no_information')}</div>
		if (method.method === 'cash') {
			$method = <div>{this.props.t(`payment_method_cod`)}</div>
		} else if (method.method === 'bank_transfer') {
			$method = <div>{this.props.t(`payment_method_bank_transfer`)}</div>
		}

		return (
			<div style='margin-top: 0.5cm'>
				<div style='display: flex; align-items: center; margin-top: 20px'>
					<div class='invoice_sublabel'>{this.props.t('payment')}</div>
				</div>
				{$method}
			</div>
		)
	}

	renderTerms() {
		let template = this.props.template
		if (!template.terms_and_conditions) return null
		return (
			<div style='margin-top: 30px'>
				<div class='d-flex' style='align-items: center; margin-top: 20px'>
					<div class='invoice_sublabel'>{this.props.t('terms_and_conditions')}</div>
				</div>
				<div>{this.props.t.i18n(template.i18n_terms_and_conditions, template.terms_and_conditions)}</div>
			</div>
		)
	}

	renderSignature = () => {
		let template = this.props.template
		return (
			<div style='margin-top: 30px'>
				<div style='color: #888'>{this.props.t.i18n(template.i18n_signature, template.signature)}</div>
			</div>
		)
	}

	renderItem = (item, i) => {
		let template = this.props.template
		let product = item.product || {}

		let total = product.price * item.quantity
		let discount = 0
		if (item.discount_before_tax) {
			if (item.discount_type == 'percentage') {
				discount = (total * (item.discount_percentage || 0)) / 100
			} else if (item.discount_type == 'amount') {
				if (item.discount > 0) discount = item.discount
			}
		}

		total -= discount
		if (total < 0) {
			total = 0
		}

		let itemtax = item.tax
		let tax = '0%'
		if (itemtax) tax = (itemtax.percentage || 0) + '%'

		let $props = null
		if (Array.isArray(product.props) && product.props.length) {
			let propsText = (product.props || []).map(prop => prop.value).join(' - ')
			$props = <div style='color: #888; font-size: 14px;'>{propsText}</div>
		}
		return (
			<tr>
				<td style='padding-left: 0; width: 20px; text-align: left'>{i + 1}</td>
				<td style='vertical-align: top; padding: 0; white-space: pre-wrap; padding: 10px'>
					<div>{product.name}</div>
					{$props}
					<div style='color: #888'>{item.note}</div>
				</td>
				<td
					style={`width: 100px; text-align: right; padding: 0; height: 1px; padding: 10px; font-family: ${template.number_font_family}`}>
					{util.formatNumber(product.price)}
				</td>

				<td style='width: 50px; text-align: center; padding: 0; height: 1px;padding: 10px'>{item.quantity}</td>
				<td
					style={`width: 115px; text-align: right; padding-left: 0; padding-right: 0px; overflow: unset;font-family: ${template.number_font_family}`}>
					{util.formatNumber(total)}
				</td>
			</tr>
		)
	}

	renderItems = () => {
		let acc = this.props.account
		let template = this.props.template
		let order = this.props.order
		let $header = (
			<tr style={`background: ${template.secondary_color}; color: ${template.primary_color}`}>
				<th style='padding-left: 0;width: 20px; text-align: left'>#</th>
				<th style='text-align: left'>{this.props.t('product')}</th>
				<th style='width: 100px; text-align: right'>{this.props.t('price')}</th>
				<th style='width: 50px; text-align: center'>{this.props.t('qty')}</th>
				<th style='padding-right: 0;width: 115px; text-align: right'>Thành tiền</th>
			</tr>
		)
		let items = order.items || []
		// items = items.concat(items).concat(items).concat([items[0]]).concat([items[0]])
		let $rows = items.map(this.renderItem)
		let $adjustment = null
		let adjustment = order.adjustment || 0
		if (adjustment != 0 || order.adjustment_description)
			$adjustment = (
				<div style='align-items: center; display: flex; justify-content: space-between;'>
					<div style='width: 140px'>
						{order.adjustment_description || <span style='color: #888'>{this.props.t('empty')}</span>}
					</div>
					<div style={`font-family: ${template.number_font_family}`}>{util.formatNumber(adjustment)}</div>
				</div>
			)

		let $ship = null
		if (order.shipping) {
			$ship = (
				<div style='display: flex; justify-content: space-between;'>
					<div class='text-truncate'>{this.props.t('shipping_fee')}</div>
					<div style={`font-family: ${template.number_font_family}`}>
						{util.formatNumber(order.shipping.nominal_fee)}
					</div>
				</div>
			)
		}

		// discount percentage == 0 => use
		let total = order.total
		let subtotal = order.subtotal

		let discountbeforetax = items
			.map((item) => {
				let discounttype = item.discount_type || 'percentage'

				let price = (item.product && item.product.price) || 0
				let item_total = price * item.quantity
				return item_total - item.total
			})
			.reduce((s, a) => s + a, 0)

		let $note = <div style='flex: 1; padding: 0' />
		if (order.note) {
			$note = (
				<div style='padding: 0; flex: 1'>
					<div>{this.props.t('note')}</div>
					<div>{order.note}</div>
				</div>
			)
		}
		let left = (order.total || 0) - (order.payment_made || 0)
		if (left <= 0) left = 0

		let $discountbeforetax = null
		if (discountbeforetax) {
			$discountbeforetax = (
				<div style='display: flex; justify-content: space-between; align-items: center'>
					<div style='flex-shrink: 0'>{this.props.t('discount_before_tax')}&nbsp;</div>
					<div style={`font-family: ${template.number_font_family}`}>-{util.formatNumber(discountbeforetax)}</div>
				</div>
			)
		}

		let discount = 0
		let discount_note = ''
		if (order.discount_type === 'percentage') {
			discount = order._computed_discount
			discount_note = `(${(order.discount_percentage || 0) / 100}%)`
		}
		if (order.discount_type === 'amount') {
			discount = order.discount_amount
		}
		let $discountaftertax = null
		if (discount) {
			$discountaftertax = (
				<div style='display: flex; justify-content: space-between; align-items: center'>
					<div style='flex-shrink: 0'>
						{this.props.t('discount_after_tax')}&nbsp;{discount_note}
					</div>
					<div style={`font-family: ${template.number_font_family}`}>-{util.formatNumber(discount)}</div>
				</div>
			)
		}
		return (
			<div style='margin-top: 30px; padding: 0px 2cm;'>
				<div style='display: flex;align-items: center; margin-top: 20px; margin-bottom: 5px'>
					<div class='invoice_sublabel'>{}</div>
					<div style='flex: 1' />
					<div>
						{this.props.t('currency')}: {order.currency || acc.currency || 'VND'}
					</div>
				</div>
				<div>
					<table class='order_print_table table mt-2' cellspacing='0' cellpadding='0'>
						{$header}
						{$rows}
					</table>
				</div>

				<div class='page_section' style='display: flex; margin-top: 10px'>
					{$note}
					<div style='width: 7cm; margin-left: 10px'>
						{$discountbeforetax}
						<div style='display: flex; justify-content: space-between;'>
							<div>{this.props.t('subtotal')}</div>
							<div style={`font-family: ${template.number_font_family}`}>{util.formatNumber(subtotal)}</div>
						</div>
						{$ship}
						<div style='display: flex; justify-content: space-between;'>
							<div>{this.props.t('tax')}</div>
							<div style={`font-family: ${template.number_font_family}`}>{util.formatNumber(order.total_tax)}</div>
						</div>
						{$discountaftertax}
						{$adjustment}
						<div style='display: flex; justify-content: space-between;align-items: center; margin-top: 15px;'>
							<b style='font-size: 18px'>{this.props.t('total')}</b>
							<div style={`font-size: 18px; font-weight: 600;font-family: ${template.number_font_family}`}>
								{util.formatNumber(total)}
							</div>
						</div>
						<div style='display: flex; justify-content: space-between; '>
							<div>{this.props.t('paid_state')}</div>
							<div style={`font-family: ${template.number_font_family}`}>{util.formatNumber(order.payment_made)}</div>
						</div>
						<div style='display: flex; justify-content: space-between; '>
							<div>{this.props.t('balance_due')}</div>
							<div style={`font-family: ${template.number_font_family}; color: ${template.primary_color}`}>
								{util.formatNumber(left)}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	renderPrintOverview = () => {
		let order = this.props.order
		let template = this.props.template

		let $shipping = <div style='flex: 1' />
		let shipping = order.shipping || {}
		let addr = shipping.address || {}
		let address = [addr.address, addr.ward, addr.district, addr.province, addr.country].filter((a) => a).join(', ')
		if (address) {
			$shipping = (
				<div style='flex: 1;'>
					<div class='invoice_sublabel mt-1'>{this.props.t('shipping_to')}</div>
					<div>{address}</div>
				</div>
			)
		}

		let user = order.user || {}
		let userattrs = user.attributes || []
		let userdisplayname = util.getUserDisplayName(user)

		let phoneattr = userattrs.find((attr) => attr.key === 'phones') || {
			key: 'phones',
			text: '',
		}
		let phone = (addr.phone || '').trim()
		phone = phone || (phoneattr.text || '').trim()

		let left = (order.total || 0) - (order.payment_made || 0)
		if (left <= 0) left = 0

		return (
			<div style='display: flex; margin-top: 30px'>
				<div style='display: flex; flex-direction: column; justify-content: flex-end'>
					<div style='flex: 1' />

					<div class='invoice_sublabel' style='margin-top: 10px'>
						{this.props.t('customer')}
					</div>
					<div>{userdisplayname}</div>
					<div>{phone}</div>

					{$shipping}
				</div>
				<div style='flex: 1' />
				<div style='display: flex; flex-direction: column; text-align: right'>
					<div>
						<div class='invoice_sublabel'>{this.props.t('invoice_date')}</div>
						<div>{util.formatDate(order.invoice_date || order.created || Date.now(), 'yyyy/MM/dd')}</div>
					</div>

					<div>
						<div class='invoice_sublabel mt-1'>{this.props.t('due_date')}</div>
						<div>
							{util.formatDate(order.due_date || order.invoice_date || order.created || Date.now(), 'yyyy/MM/dd')}
						</div>
					</div>
					<div style='flex: 1' />
				</div>
			</div>
		)
	}

	renderHeader = () => {
		let order = this.props.order
		let acc = this.props.account
		let template = this.props.template

		return (
			<div style='display: flex'>
				<div style='flex:1;'>
					<div style=''>
						<img width='120' src={acc.logo_url} />
						<div style='margin-top: 10px'>
							<div>
								<b style='font-size: 18px'>{acc.name}</b>
								<span style='color: #888; font-size: 13px'>
									&nbsp;&nbsp;|&nbsp;&nbsp;{this.props.t.i18n(template.i18n_tagline, template.tagline)}
								</span>
							</div>
							<div style='font-size: 13px; color: #888; margin-top: 0px'>
								{acc.address}
								&nbsp;&nbsp;·&nbsp;&nbsp;
								{this.props.t('phn')}:&nbsp;
								{acc.phone}
							</div>
						</div>
					</div>
				</div>

				<div style='display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end'>
					<div
						style={`text-transform: uppercase; font-size: 32px;  font-weight: 600;  color: ${template.primary_color}; padding: 0px`}>
						{this.props.t('invoice')}
					</div>
					<div class='text__muted'>#{order.number || order.id}</div>
				</div>
			</div>
		)
	}
}
