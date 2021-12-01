import {h, Component} from 'preact'

export default class Main extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let template = this.props.template
		return (
				<div style='padding: 0px 2cm; padding-top: 2cm'>{this.renderPrintHeader()}</div>
		)
	}

	renderPrintHeader = () => {
		let order = this.props.order
		let acc = this.props.account
		let template = this.props.template

		return (
			<div style='display: flex'>
				<div style='flex:1;'>
					<div class='d-flex align-items-center'>
						<img height='40' src={acc.logo_url} />
						<div class='ml-3'>
							<div>
								<b>{acc.name}</b>
							</div>
							<div class='text__muted' style='line-height: 1'>
								<small>{template.tagline}</small>
							</div>
						</div>
					</div>

					<div class='mt-3' style='font-size: 13px; color: #888'>
						{acc.address}
						&nbsp;&nbsp;·&nbsp;&nbsp;
						{this.props.t('phone_number')}:&nbsp;
						{acc.phone}
						<div>FB: {acc.facebook}</div>
					</div>
				</div>

				<div>
					<div
						style={`text-transform: uppercase; font-size: 30px;  font-weight: 600;  color: ${template.primary_background}; display: inline-block; padding: 0px`}>
						{this.props.t('order')}
					</div>
					<div class='text__muted text__right' style='line-height: 1'>
						#{order.number || order.id}
					</div>
				</div>
			</div>
		)
	}
}
