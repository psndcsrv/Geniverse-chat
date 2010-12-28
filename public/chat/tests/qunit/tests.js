
module("Chat Tests");

test('Warmup', function() {
    // make sure page is fully-loaded before starting real tests
	setTimeout(function(){
	    ok(true == true);
	    start();
	},900);
	stop(1000);
})

test('Can post and receive chats', function() {
	var testMessage = "test message";
	var channel = "/qunit-test"
    Chat.subscribe(channel, acceptChat, false);
	function acceptChat(message) {
		ok(message == testMessage, "received message");
		start();
    }
	Chat.post(testMessage, channel);
	stop(800);			// test fails if start() is not called within 800ms
})

test('Can post on separate channels', function() {
	var testMessage = "test message";
	var channel1 = "/qunit-test1"
	var channel2 = "/qunit-test2"

    Chat.subscribe(channel1, acceptChat1, false);
    Chat.subscribe(channel2, acceptChat2, false);

	function acceptChat1(message) {
		ok(message == testMessage, "received message on right channel");
		start();
    }
	function acceptChat2(message) {
		ok(false, "received message on wrong channel");		// fail if this receives anything
		start();
    }
	Chat.post(testMessage, channel1);
	stop(800);
})

test('Can post and receive JSON objects', function() {
	var testMessage = "test message";
	var channel = "/qunit-test"
    Chat.subscribe(channel, acceptChat, false);

    var jsonMessage = {message: testMessage}
	function acceptChat(message) {
		ok(message.message == testMessage, "JSON object was received correctly");
		start();
    }
	Chat.post(jsonMessage, channel);
	stop(800);
})


module("Basic GWT Tests");

test('Can get dragon from GWT', function() {
	var onSuccess = function(organism) {
		ok(organism != null, "returned organism is not null");
		var alleles = organism.alleles;
		ok(alleles != null, "organism has alleles (alleles: "+alleles+")");
		start();
	};
	var onFailure = function(throwable) {
		ok(false, "failed to get dragon");
		start();
	};

	generateDragonWithCallback(onSuccess, onFailure);
	stop(500);			// test fails if start() is not called within 500ms
})

test('Can get image from dragon using GWT', function() {
	var onSuccess = function(organism) {
		ok(organism != null, "returned organism is not null");
		var imageSuccess = function(url){
			ok(url != null, "returned image is not null");
			ok(url.indexOf(".jpg") > 0 || url.indexOf(".png") > 0 || url.indexOf(".svg") > 0 , "returned image is an image ("+url+")");
			start();
		}
		var imageFailure = function(errormsg){
			ok(false, "failed to get image");
			start();
		}
		getDragonImageURL(organism, 5, imageSuccess, imageFailure);
	stop(800);
})

test('Can get dragon with specified sex from GWT', function() {
	var onSuccess0 = function(organism) {
		ok(organism != null, "returned organism is not null");
		var sex = organism.sex;
		ok(sex == 0, "organism has sex "+sex);
		start();
	};
	var onSuccess1 = function(organism) {
		ok(organism != null, "returned organism is not null");
		var sex = organism.sex;
		ok(sex == 1, "organism has sex "+sex);
		start();
	};
	var onFailure = function(throwable) {
		ok(false, "failed to get dragon");
		start();
	};

	generateDragonWithCallback(onSuccess, onFailure);
	stop(1500);
})

test('Can get dragon image directly using GWT', function() {
	generateDragonWithSex(0, onSuccess0, onFailure);
	generateDragonWithSex(1, onSuccess1, onFailure);
	stop(1500);
})

test('Can get dragon with specified alleles from GWT', function() {
	var onSuccess0 = function(organism) {
		ok(organism != null, "returned organism is not null: "+JSON.stringify(organism));
		var alleles = organism.alleles;
		ok(alleles.indexOf("a:h") > -1 && alleles.indexOf("b:h") > -1, "returned organism has alleles a:h,b:h")
		ok(alleles.indexOf("a:H") == -1 && alleles.indexOf("b:H") == -1, "returned organism does not have alleles a:H,b:H")
		start();

	};
	var onSuccess1 = function(organism) {
		ok(organism != null, "returned organism is not null: "+JSON.stringify(organism));
		var alleles = organism.alleles;
		ok(alleles.indexOf("a:H") > -1 && alleles.indexOf("b:H") > -1, "returned organism has alleles a:H,b:H")
		start();
	};
	var onFailure = function(throwable) {
		ok(false, "failed to get dragon");
		start();
	};

	generateDragonWithAlleleString("a:h,b:h", onSuccess0, onFailure);
	generateDragonWithAlleleString("a:H,b:H", onSuccess1, onFailure);
	stop(1500);
})

test('Can get correct characteristics from dragon with specified alleles from GWT', function() {
	var onSuccess0 = function(organism) {
		ok(organism != null, "returned organism is not null: "+JSON.stringify(organism));
		var characteristics = organism.characteristics;
		ok(contains(characteristics, "No Horns"), "characteristics of 'a:h,b:h' dragon contains 'No Horns': "+characteristics);
        ok(!contains(characteristics, "2 Horns"), "characteristics of 'a:h,b:h' dragon does not contain '2 Horns': "+characteristics);

		start();

	};
	var onSuccess1 = function(organism) {
		ok(organism != null, "returned organism is not null: "+JSON.stringify(organism));
		var characteristics = organism.characteristics;
		ok(contains(characteristics, "2 Horns"), "characteristics of 'a:H,b:H' dragon contains '2 Horns': "+characteristics);
        start();
	};
	var onFailure = function(throwable) {
		ok(false, "failed to get dragon");
		start();
	};

	function contains(arrayList, obj) {
	  var array = arrayList.array
      var i = array.length;
      while (i--) {
        if (array[i] == obj) {
          return true;
        }
      }
      return false;
    }

	generateDragonWithAlleleString("a:h,b:h", onSuccess0, onFailure);
	generateDragonWithAlleleString("a:H,b:H", onSuccess1, onFailure);
	stop(1500);
})

test('Can get dragon image from generated dragon', function() {
	var onSuccess = function(organism) {
		ok(organism != null, "returned organism is not null");
		ok(organism.imageURL != null, "returned imageURL is not null ("+organism.imageURL+")");
		if (organism.imageURL != null)
			ok(organism.imageURL.indexOf(".jpg") > 0 ||
				organism.imageURL.indexOf(".png") > 0 ||
				organism.imageURL.indexOf(".svg") > 0 , "returned imageURL is an image ("+organism.imageURL+")");
		start();
	};
	var onFailure = function(throwable) {
		ok(false, "failed to get dragon");
		start();
	};

	generateDragonWithCallback(onSuccess, onFailure);
	stop(800);
})

test('Can convert JSON object into dragon', function() {
	var onSuccess = function(organism) {
		var dragon = createGOrganismFromJSONString('{"name_0": "test", "alleles": "test", "sex": 0, "imageURL": "test"}')
		ok(dragon != null, "generated dragon is not null");
		ok((""+dragon).indexOf("GOrganism") > -1, "generated dragon is a GOrganism ("+dragon+")");
		ok(dragon.alleles == "test", "dragon's properties are correctly set (dragon.alleles = "+dragon.alleles+")");
		start();
	};
	var onFailure = function(throwable) {
		ok(false, "failed to get dragon");
		start();
	};

	generateDragonWithCallback(onSuccess, onFailure);
	stop(800);
})

module("GWT-Chat Tests");

test('Can post dragon on chat', function() {
	var onSuccess = function(organism) {
		ok(organism != null, "generated organism is not null");

		var testMessage = "test message";
		dragonMessage = {message: testMessage, dragon: organism};
		var channel = "/qunit-test"
	    Chat.subscribe(channel, acceptChat, false);

		function acceptChat(message) {
			ok(message.message == testMessage, "the message was received");
			ok(message.dragon != null, "some object was received");
			// note, message.dragon != organism
			ok(message.dragon.alleles == organism.alleles, "the generated dragon was received");
			start();
	    }

		Chat.post(dragonMessage, channel);

	};
	var onFailure = function(throwable) {
		ok(false, "failed to get dragon");
		start();
	};

	generateDragonWithCallback(onSuccess, onFailure);
	stop(1500);
})

test('The received dragon can be turned into a GOrganism', function() {
	var onSuccess = function(organism) {
		ok(organism != null, "generated organism is not null");

		var testMessage = "test message";
		dragonMessage = {message: testMessage, dragon: organism};
		var channel = "/qunit-test"
	    Chat.subscribe(channel, acceptChat, false);

		function acceptChat(message) {
			ok(message.message == testMessage, "the message was received");
			ok(message.dragon != null, "some object was received");
			// need to set image, as createGOrganismFromJSONString currently demands it
			message.dragon.imageURL = "test";
			var realDragon = createGOrganismFromJSONString(JSON.stringify(message.dragon));
			ok(realDragon != null && (""+realDragon).indexOf("GOrganism") > -1, "organism was turned into a GOrganism")
			ok(realDragon.alleles == organism.alleles, "GOrganism is equivalent to the generated organism ("+realDragon.alleles+" == "+organism.alleles+")");
			start();
	    }

		Chat.post(dragonMessage, channel);

	};
	var onFailure = function(throwable) {
		ok(false, "failed to get dragon");
		start();
	};

	generateDragonWithCallback(onSuccess, onFailure);
	stop(1500);
})
