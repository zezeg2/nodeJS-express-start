const express = require('express')
const router = express.Router();
const template = require('../lib/template.js')

router.get('/', (req, res) => {

	var title = 'Welcome'
	var description = 'Hello, Node.js'
	var list = template.list(req.list)
	var html = template.HTML(title, list,
		`<h2>${title}</h2>${description}
		<img src="/images/hello.jpeg" style="width: 300px; display: block; margin-top: 10px;">`,
		`<a href="/topic/create">create</a>`
	)
	res.writeHead(200)
	res.end(html)


})

module.exports = router