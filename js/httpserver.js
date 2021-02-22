const Httpserver = {};
const http = require('http');
const https = require('https');
const URL = require('url');
const request = require('request');
const qs=require('querystring');
const zlib = require('zlib');
// const SqliteDB = require('../js/db.js').SqliteDB;
// const sqlitedb = new SqliteDB('my.db');
const path = require('path');
//localstorage
const storage = require('electron-localstorage');
storage.setStoragePath(path.join(__dirname, 'restore.json'));

Httpserver.server = function(cookie){
	this.cookies = [];
	if (cookie !== undefined) {
		this.setCookie(cookie);
	}
}

Httpserver.server.post = function(url, params) {
	return this.request('POST', url, params);
}

Httpserver.server.prototype.getHeaders = function(host, postData) {
	let headers = {
		'Host': host,
		'Pragma': 'no-cache',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache',
		'Content-Type': 'application/x-www-form-urlencoded',
		'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,es;q=0.2',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
	};
	if (this.cookies.length) {
		headers.Cookie = this.cookies.join('; ');
	}
	if (postData != '') {
		headers['Content-Length'] = Buffer.byteLength(postData);
	}
	return headers;
}

Httpserver.server.prototype.setCookie = function(cookie) {
	let cookies = cookie.split(';');
	for (let c of cookies) {
		c = c.replace(/^\s/, '');
		this.cookies.push(c);
	}
	return this;
}

Httpserver.server.prototype.request = function(method, url, params) {
	let postData = qs.stringify(params || {});
	let urlObj = URL.parse(url);
	let protocol = urlObj.protocol;
	let options = {
		hostname: urlObj.host,
		port: urlObj.port,
		path: urlObj.path,
		method: method,
		headers: this.getHeaders(urlObj.host, postData),
	};

	return new Promise((resolve, reject) => {
		let req = (protocol == 'http:' ? http : https).request(options, (res) => {
			let chunks = [];
			res.on('data', (data) => {
				chunks.push(data);
			});
			res.on('end', () => {
				let buffer = Buffer.concat(chunks);
				let encoding = res.headers['content-encoding'];
				if (encoding == 'gzip') {
					zlib.gunzip(buffer, function(err, decoded) {
						resolve(decoded.toString());
					});
				} else if (encoding == 'deflate') {
					zlib.inflate(buffer, function(err, decoded) {
						resolve(decoded.toString());
					});
				} else {
					resolve(buffer.toString());
				}
			});
		});
		req.on('error', (e) => {
			reject(e);
		});
		if (postData != '') {
			req.write(postData);
		}
		req.end();
	})
}

Httpserver.server.prototype.get = function(url) {
	return this.request('GET', url, null);
}

Httpserver.server.prototype.post = function(url, params) {
	return this.request('POST', url, params);
}



Httpserver.server.prototype.respone = function HeepRespone(){
    http.createServer(function(req,res){
		var test;
        var arg = URL.parse(req.url).query;
        var code = qs.parse(arg)['code']; 
        res.end(code);
        //保存到数据库
        // var insertTileSql = "insert into userinfo (code) values(?);";
        // var arr = new Array(1);
        // arr[0] = code;
        // var arrdata = new Array(arr);
        // console.log(arrdata);
		// sqlitedb.insertData(insertTileSql,arrdata);
		console.log("准备存入session");
		storage.clear();
		storage.setItem('code',code);
		console.log("存入完成");
		// var cookie = {
        //     url: "http://localhost",
        //     name: "code", 
        //     value: code
        // };
        // session.defaultSession.cookies.set(cookie,(error) => {
        //     if(error) console.log(error);
		// })
		// session.defaultSession.cookies.get({ url: "http://localhost" }, function (error, cookies) {
		// 	console.log(cookies);
		// 	if (cookies.length > 0) {
		// 		code = cookies[0].code + "test";
		// 		// this.server.post("https://api.weibo.com/oauth2/access_token?client_id=2110492170&client_secret=6d623742beb0d11d930e5fbb91d82cae&grant_type=authorization_code&code="+
		// 		// cookies[0].code +"&redirect_uri=http://127.0.0.1:8050/code_handle","");
		// 	}
		// });
		// console.log(code);
    }).listen(8050);
}

//发送http get请求
// Request.prototype.get = function HttpGetRequest(url){
//     request(url, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//           console.log(body);
//           return body;
//         }
//     })
// }

//发送http post请求
// Request.prototype.post = function HttpPostRequest(url,requestData){
//     request({
//         url: url,
//         method: "POST",
//         json: true,
//         headers: {
//             "content-type": "application/json",
//         },
//         body: JSON.stringify(requestData)
//     }, function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(JSON.stringify(body));
//             response.end(JSON.stringify(body));
//         }
//     });
// }

module.exports.server = Httpserver.server;
// module.exports = function(cookie) {
// 	return new Request(cookie);
// }