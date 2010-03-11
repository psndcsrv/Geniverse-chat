var ch_main = '/main';
var ch_org = '/org';

Chat = {
  
  /**
   * Initializes the application, passing in the globally shared Comet
   * client. Apps on the same page should share a Comet client so
   * that they may share an open HTTP connection with the server.
   */
  init: function(comet, chatchannel) {
    var self = this;
    this._comet = comet;

    this._chatchannel = chatchannel;

    this._postingChannels = [ chatchannel ];
    
    this._login   = $('#enterUsername');
    this._app     = $('#app');
    this._post    = $('#postMessage');
    this._message = $('#message');
    this._stream  = $('#stream');
    this._clear   = $('#clear');

    this._messageObject = null;
    this._messageImage = $('#messageImage');

    this._message.attr('cols', 45);
	this._messageImage.attr('width', 0)
    
    this._app.hide();
    
    // When the user enters a username, store it and start the app
    this._login.submit(function() {
      self._username = $('#username').val();
      self.launch();
      return false;
    });
  },
  
  /**
   * Starts the application after a username has been entered. A
   * subscription is made to receive messages that mention this user,
   * and forms are set up to accept new followers and send messages.
   */
  launch: function() {
    var self = this;
    this._comet.subscribe(this._chatchannel, this.accept, this);
    
    // Hide login form, show main application UI
    this._login.fadeOut('slow', function() {
      self._app.fadeIn('slow');
    });
    
    // When we enter a message, send it and clear the message field.
    this._post.submit(function() {
		self.postMessage();
      return false;
    });
	
	// post when user hits return
	this._message.keypress(function (e) {
	    if (e.keyCode != 13) 
			return;
		e.preventDefault();
		self.postMessage();
	  });
	
	// Clear text and object.
	 this._clear.click(function(e) {
		e.preventDefault();
		self.clearMessage();
	      return false;
	    });
  },

  /**
   * Posts the contents of the current chat, and the attached object, if any
   */
  postMessage: function(){
  		msg = $('#message').val();
	    message = {user: this._username, message: msg};
	    if (this._messageObject != null)
			message.messageObject = this._messageObject;
			
	    for (i in this._postingChannels){
		    var channel = this._postingChannels[i];
		    if (channel.slice(0,1) == "/")			// prevent app from crashing and dying...
				this.post(message, this._postingChannels[i]);
			else
				alert(channel + " is not a valid channel")
		}
  		this.clearMessage();
  },

  clearMessage: function(){
	this._message.val('');
	this.removeMessageObjectFromChat();
  },

  addMessageObjectToChat: function(messageObject){
	this._messageObject = messageObject;
	if (this._messageObject.image != null){
	  this._addImage(this._messageObject.image);
	}
  },

  removeMessageObjectFromChat: function(messageObject){
	this._messageObject = null;
	this._removeImage();
  },

  _addImage: function(url) {
	this._message.attr('cols', 40);
	this._messageImage.attr('src', url)
	this._messageImage.attr('width', 55)
  },

  _removeImage: function() {
	this._message.attr('cols', 45);
	this._messageImage.attr('src', '')
	this._messageImage.attr('width', 0)
  },

/**
   * Sends messages that the user has entered. The message is scanned for
   * @reply-style mentions of other users, and the message is sent to those
   * users' channels.
   */
  post: function(message, channel) {
  
    // Message object to transmit over Comet channels
  
    // Publish to this user's 'from' channel, and to channels for any
    // @replies found in the message
    this._comet.publish(channel, message);
  },
  
  /**
   * Handler for messages received over subscribed channels. Takes the
   * message object sent by the post() method and displays it in
   * the user's message list.
   */
  accept: function(message) {
	var messageString = '<b>' + message.user + ':</b> '+message.message;
	if (message.messageObject != null && message.messageObject.image != null)
		messageString = '<div><img style="float: left; margin: 5px;" src="'+message.messageObject.image+'" width="55" height="55">' + messageString + '</div>';
    this._stream.prepend('<li style="overflow: auto;">' + messageString + '</li>');
  },

  subscribe: function(channel, callback, addToChatChannels) {	
	this._comet.subscribe(channel, callback, this);
	if (addToChatChannels)
		this._postingChannels.push(channel);
   },

};

