import {format} from 'date-fns'
import accounting from 'accounting'

export function getUserTextAttr(user, key) {
	if (!user || !user.attributes) return
	for (var i in user.attributes) {
		var attr = user.attributes[i]
		if (attr.key !== key) continue
		return attr.text || ''
	}
	return ''
}

export function getUserDisplayName(user) {
	if (!user) return ''
	var id = user.id || ''
	let name = getUserTextAttr(user, 'fullname')
	if (name && name.trim().length > 0) {
		name = name.trim()
	} else {
		const shortId = id.substr(id.length - 4, 4)
		var city = getUserTextAttr(user, 'trace_city_name')
		var country = getUserTextAttr(user, 'trace_country_name')
		if (city) {
			name = `${city} #${shortId}`
		} else if (country) {
			name = `${country} #${shortId}`
		} else {
			name = `User #${shortId}`
		}
	}
	return name.trim()
}

export var formatNumber = accounting.formatNumber
export var formatDate = format
