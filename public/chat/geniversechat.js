var ch_main = '/main';
var ch_org = '/org';

Chat = {
  
  chatCommet: null,
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
  },

  postMessage: function(){
  		msg = $('#message').val();
	    message = {user: this._username, message: msg};
	    for (i in this._postingChannels){
		    var channel = this._postingChannels[i];
		    if (channel.slice(0,1) == "/")			// prevent app from crashing and dying...
				this.post(message, this._postingChannels[i]);
			else
				alert(channel + " is not a valid channel")
		}
  		$('#message').val('');
  },
  
  /**
   * Sends messages that the user has entered. "message" is a json object
   */
  // post: function(message) {
  // 	
  // 		// Message object to transmit over Comet channels
  // 	    message = {user: this._username, message: message};
  // 	
  //     // Publish to this user's 'from' channel, and to channels for any
  //     // @replies found in the message
  //     this._comet.publish('/main', message);
  //   },

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
    this._stream.prepend('<li><b>' + message.user + ':</b> ' +
                                     message.message + '</li>');
  },

  subscribe: function(channel, callback) {
	this._postingChannels.push(channel);
	this._comet.subscribe(channel, callback, this);
   },

};

