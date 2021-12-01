import {h, Component} from 'preact'
import * as util from './util.js'

export default class Main extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let template = this.props.template

		return (
			<div style={`font-family: ${template.font_family}`}>
				<div style='padding: 0px 2cm; padding-top: 2cm'>{this.renderHeader()}</div>
				<div style='padding: 0 2cm;'>{this.renderPrintOverview()}</div>
				{this.renderPrintItems()}

				<div style='padding: 0 2cm;'>{this.renderPaymentMethod()}</div>
				<div style='padding: 0 2cm;'>{this.renderTerms()}</div>
				<div style='padding: 0 2cm;'>{this.renderSignature()}</div>
			</div>
		)
	}

	renderPaymentMethod = () => {
		return (
			<div style='margin-top: 0.5cm'>
				<div style='display: flex; align-items: center; margin-top: 20px'>
					<div class='order_print_label'>{this.props.t('payment')}</div>
				</div>
				<div>COD</div>
			</div>
		)
	}

	renderTerms() {
		let template = this.props.template
		if (!template.terms_and_conditions) return null
		return (
			<div style='margin-top: 0.5cm'>
				<div class='d-flex' style='align-items: center; margin-top: 20px'>
					<div class='order_print_label'>{this.props.t('terms_and_conditions')}</div>
				</div>
				<div class='text__muted'>
					{this.props.t.i18n(template.i18n_terms_and_conditions, template.terms_and_conditions)}
				</div>
			</div>
		)
	}

	renderSignature = () => {
		let template = this.props.template
		return (
			<div style='margin-top: 0.5cm'>
				<div style='color: #888'>{this.props.t.i18n(template.i18n_signature, template.signature)}</div>
			</div>
		)
	}

	renderPrintItem = (item, i) => {
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

		return (
			<tr>
				<td style='width: 35px; text-align: center'>{i + 1}</td>
				<td style='vertical-align: top; padding: 0; white-space: pre-wrap; padding: 10px'>
					<div>{product.name}</div>
					<div>{item.note}</div>
				</td>
				<td
					style={`width: 100px; text-align: center; padding: 0; height: 1px; padding: 10px; font-family: ${template.number_font_family}`}>
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

	renderPrintItems = () => {
		let acc = this.props.account
		let template = this.props.template
		let order = this.props.order
		let $header = (
			<tr style={`background: ${template.primary_background}; color: ${template.primary_color}`}>
				<th style='width: 35px; text-align: center'>#</th>
				<th>{this.props.t('product')}</th>
				<th style='width: 100px; text-align: center'>{this.props.t('price')}</th>
				<th style='width: 50px; text-align: center'>{this.props.t('qty')}</th>
				<th style='width: 115px; text-align: right'>Thành tiền</th>
			</tr>
		)
		let items = order.items || []
		let $rows = items.map(this.renderPrintItem)
		let $adjustment = null
		let adjustment = order.adjustment || 0
		if (adjustment != 0 || order.adjustment_description)
			$adjustment = (
				<div>
					<div style='margin-top: 5px' title={this.props.t('adjustment_desc')}>
						{this.props.t('adjustment')}
					</div>
					<div style='align-items: center; display: flex; margin-top: 2px'>
						<div style='width: 140px'>
							{order.adjustment_description || <span style='color: #888'>{this.props.t('empty')}</span>}
						</div>
						<div title={this.props.t('adjustment_desc')}></div>
						<div style='flex: 1' style='text-align: right'>
							{util.formatNumber(adjustment)}
						</div>
					</div>
				</div>
			)

		let $ship = null
		if (order.shipping) {
			$ship = (
				<fragment>
					<div class='text-truncate mt-3'>{this.props.t('shipping')}</div>
					<div style='display: flex; justify-content: space-between;'>
						<div style='flex: 1; margin-top: 10px'>
							<div style='display: flex; justify-content: space-between;'>
								<div class='text-truncate mr-2' style='font-size: 13px;'>
									Phí vận chuyển
								</div>
								<div style='flex: 1'>
									<div>{util.formatNumber(order.shipping.fee)}</div>
								</div>
							</div>
							<div style='display: flex; justify-content: space-between;'>
								<div>{order.shipping.note}</div>
							</div>
						</div>
					</div>
				</fragment>
			)
		}

		// discount percentage == 0 => use
		let total = order.total
		let subtotal = order.subtotal

		let discounttype = order.discount_type || 'percentage'
		discounttype += order.discount_before_tax ? '_before_tax' : '_after_tax'

		let discount = 0
		if (discounttype.startsWith('percentage')) {
			discount = (order.discount_percentage || 0) / 100
		} else if (discounttype.startsWith('amount')) {
			discount = order.discount
		}

		let $note = <div class='order_modal_region_left' style='padding: 0' />
		if (order.note) {
			$note = (
				<div class='order_modal_region_left' style='padding: 0'>
					<div>{this.props.t('note')}</div>
					<div>{order.note}</div>
				</div>
			)
		}
		let left = (order.total || 0) - (order.payment_made || 0)
		if (left <= 0) left = 0
		return (
			<div style='margin-top: 20px'>
				<div style='padding: 0px 2cm;'>
					<div style='display: flex;align-items: center; margin-top: 20px'>
						<div class='order_print_label'>{this.props.t('product')}</div>
						<div style='flex: 1' />
						<div>
							{this.props.t('currency')}: {order.currency || acc.currency || 'VND'}
						</div>
					</div>
					<div>
						<table class='order_print_table table mt-2'>
							{$header}
							{$rows}
						</table>
					</div>

					<div style='display: flex; margin-top: 10px'>
						{$note}
						<div style='width: 6cm; margin-left: 10px'>
							<div style='display: flex; justify-content: space-between;'>
								<div>{this.props.t('subtotal')}</div>
								<div style={`font-family: ${template.number_font_family}`}>{util.formatNumber(subtotal)}</div>
							</div>

							<div style='display: flex; justify-content: space-between; align-items: center'>
								<div style='flex-shrink: 0'>{this.props.t('discount')}&nbsp;</div>
								<div style={`font-family: ${template.number_font_family}`}>{discount}</div>
							</div>
							{$ship}
							{this.renderOrderTax()}
							{$adjustment}
						</div>
					</div>
				</div>
				<div style='width: 8.2cm; margin-left: auto; '>
					<div
						style={`display: flex; justify-content: space-between; background: whitesmoke; ;padding-right: 2cm; padding-left: 0.2cm; align-items: center; margin-top: 2px; padding-top: 5px; padding-bottom: 2px; margin-bottom: 2px;`}>
						<b>{this.props.t('total')}</b>
						<div style={`font-weight: 600;font-family: ${template.number_font_family}`}>{util.formatNumber(total)}</div>
					</div>
					<div style='display: flex; justify-content: space-between; padding-right: 2cm; padding-left: 0.2cm'>
						<div>{this.props.t('paid_state')}</div>
						<div style={`font-family: ${template.number_font_family}`}>{util.formatNumber(order.payment_made)}</div>
					</div>
					<div style='display: flex; justify-content: space-between; padding-right: 2cm; padding-left: 0.2cm'>
						<div>{this.props.t('balance_due')}</div>
						<div style={`font-family: ${template.number_font_family}`}>{util.formatNumber(left)}</div>
					</div>
				</div>
			</div>
		)
	}

	renderOrderTax = () => {
		let taxDict = {}
		let priceM = {}
		let order = this.props.order
		let template = this.props.template

		let totaltax = 0
		let computed_discount = order._computed_discount
		let taxM = order._taxM
		let subtotal = order.subtotal
		if (subtotal == 0) subtotal = 0.001

		Object.values(taxM || {}).map((t) => {
			taxDict[t.tax.id] = t.tax
			priceM[t.tax.id] = priceM[t.tax.id] || 0
			priceM[t.tax.id] += t.taxprice
			totaltax += t.taxprice
		})

		if (Object.keys(priceM).length === 0)
			return (
				<div style='display: flex; justify-content: space-between; margin-top: 2px'>
					<div>{this.props.t('tax')}</div>
					<div style={`font-family: ${template.number_font_family}`}>0</div>
				</div>
			)

		return (
			<div style='display: flex; justify-content: space-between; margin-top: 2px'>
				<div>{this.props.t('tax')}</div>
				<div style={`font-family: ${template.number_font_family}`}>{util.formatNumber(totaltax)}</div>
			</div>
		)
	}

	renderPrintOverview = () => {
		let order = this.props.order
		let template = this.props.template

		let $shipping = <div style='flex: 1' />
		let shipping = order.shipping || {}
		let addr = shipping.address || {}
		let address = [addr.street, addr.ward, addr.district, addr.region, addr.country].filter((a) => a).join(', ')
		if (address) {
			$shipping = (
				<div style='flex: 1;'>
					<div class='order_print_label'>{this.props.t('shipping_to')}</div>
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
			<div style='margin-top: 30px'>
				<div style='display: flex; margin-top: 40px'>
					<div style='display: flex; flex-direction: column'>
						<div style='flex: 1' />
						<div style='display: flex; margin-top: 20px'>
							<div class='invoice_sublabel'>{this.props.t('invoice_date')}</div>&nbsp;
							<div>{util.formatDate(order.invoice_date || order.created || Date.now(), 'yyyy/MM/dd')}</div>
						</div>

						<div style='display:flex'>
							<div class='invoice_sublabel'>{this.props.t('due_date')}</div>&nbsp;
							<div>
								{util.formatDate(order.due_date || order.invoice_date || order.created || Date.now(), 'yyyy/MM/dd')}
							</div>
						</div>
						<div style='display: flex'>
							<div class='invoice_sublabel'>{this.props.t('balance_due')}</div>&nbsp;
							<div style={`color: ${template.primary_color}; font-weight: 600`}>{util.formatNumber(left)}</div>
						</div>
					</div>

					<div style='flex: 1' />

					<div style='text-align: right'>
						<div class='order_print_label' style='margin-top: 10px'>
							{this.props.t('customer')}
						</div>
						<div>{userdisplayname}</div>
						<div>{phone}</div>

						{$shipping}
					</div>
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
					<div style='display: flex; align-items: center'>
						<img height='40' src={acc.logo_url} />
						<div style='margin-top: 10px'>
							<div>
								<b>{acc.name}</b>
							</div>
							<div style='line-height: 1; color: #888;'>
								<small>{this.props.t.i18n(template.i18n_tagline, template.tagline)}</small>
							</div>
						</div>
					</div>

					<div style='font-size: 13px; color: #888; margin-top: 10px'>
						{acc.address}
						&nbsp;&nbsp;·&nbsp;&nbsp;
						{this.props.t('phn')}:&nbsp;
						{acc.phone}
						<div>FB: {acc.facebook}</div>
					</div>
				</div>

				<div>
					<div
						style={`text-transform: uppercase; font-size: 30px;  font-weight: 600;  color: ${template.secondary_color}; display: inline-block; padding: 0px`}>
						{this.props.t('order')}
					</div>
					<div style='line-height: 1; color: #888; text-align: right'>#{order.number || order.id}</div>
				</div>
			</div>
		)
	}
}
