import {h, render, createRef} from 'preact'
import OrderTemplateComponent from './template.js'
const ajax = require('@subiz/ajax')

let langMessages = {}
let downloadLock = false

export default class OrderTemplate {
	constructor() {
		this.show = false
		// auto detect language first

		this.t = (key) => {
			if (this.locale === 'debug') return `{{${key}}}`

			let messages = langMessages[this.locale] || []
			let message = messages.find((message) => message.key === key)
			if (!message || !message['message']) return '{' + key + '}'
			return message['message']
		}

		this.t.i18n = (i18nText) => {
			if (!i18nText) return ''
			let fallbackLocale = plugin.locale || this.account.locale || 'vi-VN'
			fallbackLocale = fallbackLocale.replace('-', '_')
			let locale = this.locale.replace('-', '_')

			return i18nText[locale] || i18nText[fallbackLocale]
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

		console.log("SSSSSSSSSSSSS", this.account.id, locale)
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

function getLocaleContent(accid, locale) {
	console.log("HHH")
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
