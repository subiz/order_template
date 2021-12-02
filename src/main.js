import {h, render, createRef} from 'preact'
import OrderTemplateComponent from './template.js'
const ajax = require('@subiz/ajax')

// add fonts
var link = document.createElement('link')
link.setAttribute('rel', 'stylesheet')
link.setAttribute(
	'href',
	'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inconsolata:wght@300;400;500&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Signika:wght@300;400;500;600&family=Source+Serif+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Yeseva+One&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap',
)
document.head.appendChild(link)

export default class OrderTemplate {
	constructor() {
		link
		this.show = false
		// auto detect language first

		this.t = (key) => {
			if (this.locale === 'debug') return `{{${key}}}`

			let messages = langMessages[this.locale] || []
			let message = messages.find((message) => message.key === key)
			if (!message || !message['message']) return '{' + key + '}'
			return message['message']
		}

		this.t.i18n = (i18nText, fallback) => {
			if (!i18nText) return ''
			let locale = this.locale.replace('-', '_')
			return i18nText[locale] || fallback
		}
		this.t.locale = () => this.locale
	}

	mount($container) {
		this.$div = document.createElement('div')
		// $div.id = plugin.id
		$container.appendChild(this.$div) // use body as container
		this.show = true
		this._render()
	}

	_render() {
		if (!this.$div) return null
		if (!this.show) return null

		render(
			<OrderTemplateComponent
				account={this.account}
				template={this.template}
				order={this.order}
				locale={this.locale}
				t={this.t}
			/>,
			this.$div,
		)
	}

	_setLocale = async (locale) => {
		if (this.locale === locale) return
		// detect overrider plugin change language
		this.show = false
		this._render() // hide plugin first

		await downloadLanguage(this.account.id, locale)

		this.show = true
		this._render()
	}

	update(account, order, template, locale) {
		this.order = order
		this.account = account
		this.template = template

		this._setLocale(locale)
		this.locale = locale

		this._render()
	}
}

let langMessages = {}
let downloadLock = false

function getLocaleContent(accid, locale) {
	return ajax
		.setBaseUrl('https://api.subiz.com.vn/4.0/')
		.withCredentials(true)
		.addQuery('v', 6)
		.setParser('json')
		.get(`/accounts/${accid}/locales/${locale}`)
}

function downloadLanguage(accid, locale, force) {
	if (downloadLock)
		return new Promise((resolve) => setTimeout(() => downloadLanguage(accid, locale, force).then(resolve), 100))

	downloadLock = true
	// let locale = getLocale()
	let messages
	if (locale === 'debug' || (langMessages[locale] && !force)) {
		downloadLock = false
		return Promise.resolve()
	}

	return getLocaleContent(accid, locale).then((res) => {
		downloadLock = false
		messages = res.body.messages || []
		langMessages[locale] = messages
	})
}
