const express = require('express')
const fs = require('fs')
const path = require('path')
const template = require('./lib/template.js')
const topicRouter = require('./routes/topic')
const indexRouter = require('./routes/index')


const app = express()
const port = 3000

// custom middle-ware
app.get('*', (req, res, next) => {
	fs.readdir('./data', (err, filelist) => {
		req.list = filelist
		next()
	})
})

// middle ware - Third-party module
app.use(express.static('public')); //static file hosting
var bodyParser = require('body-parser')
var compression = require('compression')


// attatch to app Third-party module
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(compression())


app.use('/', indexRouter)
app.use('/topic', topicRouter)


// 404에러 처리
app.use((req, res, next) => {
	res.status(404).send('Sorry cant find that!');
});

// 에러 핸들링 middle-ware(4 args)
app.use((err, req, res, next)=> {
	console.error(err.stack);
	res.status(500).send('Something broke!');
  });



app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})