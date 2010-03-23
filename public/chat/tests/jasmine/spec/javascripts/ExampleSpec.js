describe('Faye', function () {
	it('should run a pointless test', function() {
		expect(true).toEqual(true);
	});
  	it('should post and receive chats', function() {
		Comet = new Faye.Client('/chat/comet');
	    Chat.init(Comet, "/test");
	
		this.testMessage = "test message";
		channel = "/jasmine-test"
		Chat.subscribe(channel, acceptChat, false);
		this.messageReceived = "";

		var self = this;
		function acceptChat(message) {
			self.messageReceived = message;
		}

		Chat.post(this.testMessage, channel);

		waits(500);

		runs(function(){
			expect(this.messageReceived).toEqual(this.testMessage)
		});
	  });
});
describe('GWT', function () {
	it('should run a pointless test', function() {
		this.passed = false;
		var self = this;
		var onSuccess = function(organism) {
			self.passed = true;
		};
		var onFailure = function(throwable) {
			self.passed = false;
		};
		generateDragonWithCallback(onSuccess, onFailure);
		waits(500);

		runs(function(){
			expect(this.passed).toEqual(true)
		});
	});
});