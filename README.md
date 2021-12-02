# Order template
---
This project make print layout for a subiz order

Its used by:
* dashboard: to show order print preview before printing or dowloading
* server: to generate corresponding PDF document


### Some useful information
* Use css media query `@media print { }` to control what should be shown or hidden when printing. For example:
```css
.html_only {
  display: block;
}

.pdf_only {
  display: none; /* only show when viewing in pdf */
}

@media print {
  .html_only: {
    display: none; /* only show when viewing in browser */
  }

  .pdf_only {
    display: block;
  }
}
```

* Use `page-break-inside` css properties to prevent breaking page in middle of the table rows

```css
/* dont break page in middle of this div */
.page_section {
  page-break-inside: avoid !important;
}

table tr, table tr {
  page-break-inside: avoid !important;
}
```

### Development
1. Start the server
```sh
npm run dev
```
2. Visit https://localhost:8089
This project generates 2 outputs. The first one is a `index.html` that can view locally so we can print the document locally (using headless browser). The second one is a library which dashboard can use to show a preview

### Build
```sh
$ npm run build
```


### Take PDF screenshoot
This command export a pdf from ./dist/index.html. Remember to run `npm run build` before running this command
```sh
// try
$ node take.js '{"account":{"id":"acqsulrowbxiugvginhw","name":"Infinitea","logo_url":"https://subiz.com.vn/blog/wp-content/themes/subiz_blog_2016/images/logo.png","owner_id":"agqygncqpyaxoujpfc","state":"activated","city":"Hà Nội","facebook":"https://www.facebook.com/infiniteamilktea/","phone":"0987814392","address":"283 Cầu Giấy,  Hà Nội","url":"","lang":"vi","timezone":"+07:00","country":"VN","date_format":"YYYY/MM/DD","locale":"vi-VN","supported_locales":["en-US","ja-JP","vi-VN"],"currency":"VND"},"order":{"account_id":"acqsulrowbxiugvginhw","id":"211562","shipping":{"address":{"account_id":"acqsulrowbxiugvginhw","user_id":"usrefmjqwhamyjktbqghd","id":"adrejufuonskkmksvpci","fullname":"Mrs. Kiều Thanh","email":"thanh@gmail.com","phone":"0361224895","street":"222 Khương Trung","district":"Thanh Xuân","region":"Hà Nội","created":1638353944390,"created_by":"agqygncqpyaxoujpfc","updated":1638353944390,"updated_by":"agqygncqpyaxoujpfc"}},"note":"Không dùng túi bóng để bảo vệ môi trường","due_date":1638348497687,"status":"new","payment_status":"unpaid","created":1638348498737,"created_by":"agqygncqpyaxoujpfc","updated":1638353997344,"updated_by":"agqygncqpyaxoujpfc","items":[{"quantity":1,"note":"Khách cần lấy hàng ngay","product":{"account_id":"acqsulrowbxiugvginhw","id":"2110082","product_group_id":"2110082","left_product_id":"2110082","right_product_id":"2110082","url":"https://baohanhone.com/products/man-hinh-apple-watch-s8","description":"Sản phẩm này bán không nhiều nữa","name":"Màn Hình Apple Watch S8","i18n_name":{"vi_VN":"Màn Hình Apple Watch S8"},"created":1637912799523,"updated":1637912799523,"created_by":"agqsulrowbxilyzhds","updated_by":"agqsulrowbxilyzhds","image":"https://vcdn.subiz-cdn.com/file/firegqzhvpwbzdudkxfd_acqsulrowbxiugvginhw","visibility":"published","sku":"dienthoainew_5265","price":6490000,"stock":84},"total":6490000,"fpv_total":6490000195584},{"quantity":1,"product":{"account_id":"acqsulrowbxiugvginhw","id":"2110080","product_group_id":"2110080","left_product_id":"2110080","right_product_id":"2110080","url":"https://baohanhone.com/products/apple-watch-series-4-duoc-nang-cap-nhu-the-nao-so-voi-watch-series-3","name":"Apple Watch Series 4 Được Nâng Cấp Như Thế Nào so Với Watch Series 3","i18n_name":{"vi_VN":"Apple Watch Series 4 Được Nâng Cấp Như Thế Nào so Với Watch Series 3"},"created":1637912799446,"updated":1637912799446,"created_by":"agqsulrowbxilyzhds","updated_by":"agqsulrowbxilyzhds","image":"https://vcdn.subiz-cdn.com/file/firegqoaunmehylnqfts_acqsulrowbxiugvginhw","visibility":"published","sku":"apple_2159","price":3200000,"stock":9},"total":3200000,"fpv_total":3199999934464}],"subtotal":9690000,"fpv_subtotal":9689999867904,"total":9690000,"fpv_total":9689999867904,"pos_id":"psreakoakjggfhlibtu","channel":"subiz","channel_touchpoint":"localhost","releated_conversations":["csrefmjrutfizfnzev"],"user":{"id":"usrefmjqwhamyjktbqghd","attributes":[{"key":"created","datetime":"2021-11-24T09:37:25Z"},{"key":"fullname","text":"Mrs. Kiều Thanh"},{"key":"phones","text":"0364821895"},{"key":"emails","text":"thanh@gmail.com"}],"lead_owners":["agqygncqpyaxoujpfc"]},"currency_rate":1},"template":{"primary_color":"#759102","secondary_color":"white","font_family":"Signika","number_font_family":"Signika","tagline":"Strike for inovation","i18n_tagline":{"vi_VN":"Cải tiến không ngừng"},"terms_and_conditions":"You must pay before the due date or being charge for 10% per day","i18n_terms_and_conditions":{"vi_VN":"Bạn phải trả đúng hạn, không thì tính lãi 10% một ngày"},"signature":"Thanks for buying with us","i18n_signature":{"vi_VN":"Cảm ơn bạn đã mua hàng"}},"locale":"vi-VN"}'
```
