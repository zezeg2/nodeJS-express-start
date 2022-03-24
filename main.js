const express = require('express')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')
const path = require('path')
const sanitizeHtml = require('sanitize-html');
const template = require('./lib/template.js')
const app = express()
const port = 3000

// custom middle-ware
app.get('*',(req, res, next) => {
	fs.readdir('./data', (err, filelist) => {
		req.list = filelist
		next()
	})
})

// middle ware - Third-party module
app.use(express.static('public'));
var bodyParser = require('body-parser')
var compression = require('compression')


// attatch to app Third-party module
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(compression())

app.get('/', (req, res) => {

	var title = 'Welcome'
	var description = 'Hello, Node.js'
	var list = template.list(req.list)
	var html = template.HTML(title, list,
		`<h2>${title}</h2>${description}
		<img src="/images/hello.jpeg" style="width: 300px; display: block; margin-top: 10px;">`,
		`<a href="/create">create</a>`
	)
	res.writeHead(200)
	res.end(html)


})

app.get('/page/:pageId', (req, res) => {

	var filteredId = path.parse(req.params.pageId).base
	fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
		var title = req.params.pageId
		var sanitizedTitle = sanitizeHtml(title)
		var sanitizedDescription = sanitizeHtml(description, {
			allowedTags: ['h1']
		})
		var list = template.list(req.list)
		var html = template.HTML(sanitizedTitle, list,
			`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
			` <a href="/create">create</a>
			  <a href="/update/${sanitizedTitle}">update</a>
			  <form action="delete_process" method="post">
				<input type="hidden" name="id" value="${sanitizedTitle}">
				<input type="submit" value="delete">
			  </form>`
		)

		res.send(html)
	})

})


app.get('/create', (req, res) => {

	var title = 'WEB - create'
	var list = template.list(req.list)
	var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '')
	res.send(html)

})

app.post('/create_process', (req, res) => {

	var post = req.body
	var title = post.title
	var description = post.description
	fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
		res.writeHead(302, {
			Location: `/?id=${title}`
		})
		res.end()
	})


})

app.get('/update/:pageId', (req, res) => {

	var filteredId = path.parse(req.params.pageId).base
	fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
		var title = req.params.pageId
		var list = template.list(req.list)
		var html = template.HTML(title, list,
			`
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
			`<a href="/create">create</a> <a href="/update/${title}">update</a>`
		)
		res.send(html)
	})
})


app.post('/update_process', (req, res) => {
	var body = ''
	req.on('data', (data) => {
		body = body + data
	})
	req.on('end', () => {
		var post = qs.parse(body)
		var id = post.id
		var title = post.title
		var description = post.description
		fs.rename(`data/${id}`, `data/${title}`, (error) => {
			fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
				res.redirect(`/page/${title}`)

			})
		})
	})
})

app.post('/page/delete_process', (req, res) => {

	var post = req.body
	var id = post.id
	var filteredId = path.parse(id).base
	fs.unlink(`data/${filteredId}`, (error) => {
		res.redirect('/')

	})
})



app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})