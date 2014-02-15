var restify = require('restify');
//var mongojs = require("mongojs");
var twilio = require('twilio');

var ip_addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port    =  process.env.OPENSHIFT_NODEJS_PORT ||  8080;
 
var server = restify.createServer({
    name : "vocifero"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

function text_me(req,res,next){
   res.setHeader('Access-Control-Allow-Origin', '*');
   var from_number = req.params['From'];
   var message = req.params['Body'];
   console.log(req.params);
   var tw = twilio.TwimlResponse();
   tw.message('Hello, Mobile Reader, texting me from ' + from_number + '. I have received your message of "' + message + '"');
   //res.type('text/xml');
   //res.contentType = 'text/xml';
   //res.send(tw.toString());
   var tml = tw.toString();
   res.writeHead(200, {
      'Content-Length': Buffer.byteLength(tml),
	  'Content-Type' : 'text/xml'
   });
   res.write(tml);
   res.end();
}

server.get({path : '/textme' , version : '0.0.1'} , text_me);


server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});
