module.exports = function(express , app){
	var router = express.Router();
	
	router.get('/', function(req,res,next){
		res.render('index', {title:'Welcome to ChatBox'});
	})
	
	router.get('/chatbox', function(req,res,next){
		res.render('chatbox',{title:'ChatBox'});
		
	})
	
router.get('/setcolor', function(req,res,next){
		req.session.favcolor ='Red';
		res.send('setting favourite color');
	})
	
		router.get('/getcolor', function(req,res,next){
		res.send('Favourite color:' +(req.session.favcolor ===undefined?"NotFound":req.session.favcolor));
	})
	
	app.use('/', router);
}