# Question) express 미들웨어에서 next(), next(’route’), return next()의 차이



## Answer )

미들웨어란 클라이언트로 요청이 왔을 때 요청을 처리하여 응답하기 위해 중간에서 서비스로직에 따라 처리하는 일련의 함수들이며, 다음 미들웨어에 대한 엑세스 권한을 가집니다. next 인자를 어떻게 처리하느냐에 따라 미들웨어를 유동적으로 제어할 수 있으며  next(), next(’route’), return next()의 차이는 다음 예제코드를 통해 확인할 수 있습니다. 

```javascript
const express = require('express')
const app = express()
app.use(express.json())
var routeTester = false
var returnTester = false

// 1st middle ware 
app.get('/',(req, res, next) => {
	console.log("1")
	if(returnTester) return next() 
	else next() 
	console.log("2")
})

app.listen(8080)


// 2nd middle ware (stack)
app.get('/',(req, res, next) => {
	if (routeTester) {

		console.log("when next('route')")
		console.log("3*")
		next('route')
		console.log("4*")
	} 
	
	else{
		console.log("when next()")
		console.log("3")
		next()
		console.log("4")
	}


}, (req, res, next) => {
	console.log("5")
	next()
	console.log("6")
})

// 3rd middle ware 
app.get('/',(req, res, next) => {
	console.log("7")
	next() 
	console.log("8")
	
})
```





### - next()

![image-20220324183624943](https://user-images.githubusercontent.com/71999370/169799094-1488a206-2aa4-4bc0-bb12-16eb8e6eb274.png)


- next()를 호출했을 경우, 미들웨어의 제어권이 다음 미들웨어함수로 전이되며,  미들웨어 스택에서는 순차적으로 미들웨어 함수를 실행합니다. 다음으로 전이할 미들웨어가 없는경우 순차적으로 이전 미들웨어의 next() 이후의 로직을 실행하게 됩니다. 

### - next(’route’) 

![image-20220324184218643](https://user-images.githubusercontent.com/71999370/169799111-9f3be795-7e7e-49ab-9b74-f5e7b7eb0152.png)

- next(’route’)를 호출했을 경우, next()와 달리 미들웨어의 스택 아래를 처리하지 않고 다음 라우트로 미들웨어함수 제어권을 전이합니다.

### - return next()

![image-20220324184612564](https://user-images.githubusercontent.com/71999370/169799123-ef7b5488-46f1-490e-bc83-5a3d6dc17213.png)

- return next()를 호출할 경우, 미들웨어의 제어권은 다음 미들웨어함수로 전이되지만,  제어권 전이 이후 함수가 종료되기때문에 이후의 로직을 처리하지 않습니다. 즉 해당 미들웨어의 동작을 종료해야하는 경우  return next()를 호출합니다.
