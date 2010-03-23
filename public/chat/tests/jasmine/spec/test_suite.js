describe('Faye', function () {
	it('should run a pointless test', function() {
		expect(true).toEqual(true);
	});
  	it('should post and receive chats', function() {
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