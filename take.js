const puppeteer = require('puppeteer')

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}

async function take() {
	const browser = await puppeteer.launch({args: ['--no-sandbox']})
	const page = await browser.newPage()
	await page.setViewport({width: 940, height: 700})

	let input = {}
	let inputBase64 = ''
	if (process.argv[2]) {
		input = JSON.parse(process.argv[2])
		inputBase64 = Buffer.from(encodeURIComponent(process.argv[2])).toString('base64')
	}

	let accname = 'Subiz'
	if (input && input.account && input.account.name) accname = escapeHtml(input.account.name)

	await page.goto('file://' + __dirname + '/dist/index.html#' + inputBase64, {
		waitUntil: 'networkidle2',
	})
	await page.addStyleTag({content: '@page { size: auto; }'})
	let out = makeid(20) + '.pdf'
	const pdf = await page.pdf({
		size: 'A4',
		path: out,
		displayHeaderFooter: true,
		headerTemplate: `<div><style>#footer { padding: 0 !important; }</style></div>`,
		footerTemplate: `<style>#footer { padding: 0 !important; }</style><div style="-webkit-print-color-adjust: exact; background-color: white;color: #aaa; padding: 15px 40px; margin: 0; font-size: 10px; width: 100%; display: flex">
			<div style="flex: 1"><b style="text-transform: uppercase">${accname}</b>&nbsp;&nbsp;#&nbsp;43434&nbsp;&nbsp;|&nbsp;&nbsp;<span class="date"></span></div>
			<div>
				<span class="pageNumber"></span>
				/
				<span class="totalPages"></span>
			</div>
		</div>`,
		printBackground: true,
		margin: {
			left: '0px',
			top: '60px',
			bottom: '60px',
			right: '0px',
		},
	})
	console.log(out)
	browser.close()
}

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

function makeid(length) {
	var result = []
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var charactersLength = characters.length
	for (var i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
	}
	return result.join('')
}

take()

// try
// node take.js '{"account":{"id":"acqsulrowbxiugvginhw","name":"Infinitea","logo_url":"https://subiz.com.vn/blog/wp-content/themes/subiz_blog_2016/images/logo.png","owner_id":"agqygncqpyaxoujpfc","state":"activated","city":"H?? N???i","facebook":"https://www.facebook.com/infiniteamilktea/","phone":"0987814392","address":"283 C???u Gi???y,  H?? N???i","url":"","lang":"vi","timezone":"+07:00","country":"VN","date_format":"YYYY/MM/DD","locale":"vi-VN","supported_locales":["en-US","ja-JP","vi-VN"],"currency":"VND"},"order":{"account_id":"acqsulrowbxiugvginhw","id":"211562","shipping":{"address":{"account_id":"acqsulrowbxiugvginhw","user_id":"usrefmjqwhamyjktbqghd","id":"adrejufuonskkmksvpci","fullname":"Mrs. Ki???u Thanh","email":"thanh@gmail.com","phone":"0361224895","street":"222 Kh????ng Trung","district":"Thanh Xu??n","region":"H?? N???i","created":1638353944390,"created_by":"agqygncqpyaxoujpfc","updated":1638353944390,"updated_by":"agqygncqpyaxoujpfc"}},"note":"Kh??ng d??ng t??i b??ng ????? b???o v??? m??i tr?????ng","due_date":1638348497687,"status":"new","payment_status":"unpaid","created":1638348498737,"created_by":"agqygncqpyaxoujpfc","updated":1638353997344,"updated_by":"agqygncqpyaxoujpfc","items":[{"quantity":1,"note":"Kh??ch c???n l???y h??ng ngay","product":{"account_id":"acqsulrowbxiugvginhw","id":"2110082","product_group_id":"2110082","left_product_id":"2110082","right_product_id":"2110082","url":"https://baohanhone.com/products/man-hinh-apple-watch-s8","description":"S???n ph???m n??y b??n kh??ng nhi???u n???a","name":"M??n H??nh Apple Watch S8","i18n_name":{"vi_VN":"M??n H??nh Apple Watch S8"},"created":1637912799523,"updated":1637912799523,"created_by":"agqsulrowbxilyzhds","updated_by":"agqsulrowbxilyzhds","image":"https://vcdn.subiz-cdn.com/file/firegqzhvpwbzdudkxfd_acqsulrowbxiugvginhw","visibility":"published","sku":"dienthoainew_5265","price":6490000,"stock":84},"total":6490000,"fpv_total":6490000195584},{"quantity":1,"product":{"account_id":"acqsulrowbxiugvginhw","id":"2110080","product_group_id":"2110080","left_product_id":"2110080","right_product_id":"2110080","url":"https://baohanhone.com/products/apple-watch-series-4-duoc-nang-cap-nhu-the-nao-so-voi-watch-series-3","name":"Apple Watch Series 4 ???????c N??ng C???p Nh?? Th??? N??o so V???i Watch Series 3","i18n_name":{"vi_VN":"Apple Watch Series 4 ???????c N??ng C???p Nh?? Th??? N??o so V???i Watch Series 3"},"created":1637912799446,"updated":1637912799446,"created_by":"agqsulrowbxilyzhds","updated_by":"agqsulrowbxilyzhds","image":"https://vcdn.subiz-cdn.com/file/firegqoaunmehylnqfts_acqsulrowbxiugvginhw","visibility":"published","sku":"apple_2159","price":3200000,"stock":9},"total":3200000,"fpv_total":3199999934464}],"subtotal":9690000,"fpv_subtotal":9689999867904,"total":9690000,"fpv_total":9689999867904,"pos_id":"psreakoakjggfhlibtu","channel":"subiz","channel_touchpoint":"localhost","releated_conversations":["csrefmjrutfizfnzev"],"user":{"id":"usrefmjqwhamyjktbqghd","attributes":[{"key":"created","datetime":"2021-11-24T09:37:25Z"},{"key":"fullname","text":"Mrs. Ki???u Thanh"},{"key":"phones","text":"0364821895"},{"key":"emails","text":"thanh@gmail.com"}],"lead_owners":["agqygncqpyaxoujpfc"]},"currency_rate":1},"template":{"primary_color":"#759102","secondary_color":"white","font_family":"Signika","number_font_family":"Signika","tagline":"Strike for inovation","i18n_tagline":{"vi_VN":"C???i ti???n kh??ng ng???ng"},"terms_and_conditions":"You must pay before the due date or being charge for 10% per day","i18n_terms_and_conditions":{"vi_VN":"B???n ph???i tr??? ????ng h???n, kh??ng th?? t??nh l??i 10% m???t ng??y"},"signature":"Thanks for buying with us","i18n_signature":{"vi_VN":"C???m ??n b???n ???? mua h??ng"}},"locale":"vi-VN"}'
