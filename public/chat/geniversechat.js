var ch_main = '/main';
var ch_org = '/org';

Chat = {
	
   
  /**
   * Initializes the application, passing in the globally shared Comet
   * client. Apps on the same page should share a Comet client so
   * that they may share an open HTTP connection with the server.
   */
  init: function(comet) {
    var self = this;
    this._comet = comet;
    
    this._login   = $('#enterUsername');
    this._app     = $('#app');
    this._post    = $('#postMessage');
    this._postDragon    = $('#postDragon');
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
    this._comet.subscribe(ch_main, this.accept, this);
    this._comet.subscribe(ch_org, this.acceptDragon, this);
    
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
	
	// When we send a dragon...
    this._postDragon.submit(function() {
		self.postOrganism();
      return false;
    });
  },

  postMessage: function(){
  		msg = $('#message').val();
	    message = {user: this._username, message: msg};
		this.post(message, ch_main);
  		$('#message').val('');
  },

  postOrganism: function(){
  		msg = $('#message').val();
	    message = {user: this._username, message: msg, org: "My Dragon"};
		this.post(message, ch_org);
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

/**
   * Handler for messages received over subscribed channels. Takes the
   * message object sent by the post() method and displays it in
   * the user's message list.
   */
  acceptDragon: function(message) {
    this._stream.prepend('<li><b>' + message.user + ' submitted a dragon:</b> ' + message.org + ", " +
                                     message.message + '</li>');
  }
};

