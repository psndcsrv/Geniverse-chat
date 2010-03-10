Soapbox = {
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
    this._comet.subscribe('/main', this.accept, this);
    
    // Hide login form, show main application UI
    this._login.fadeOut('slow', function() {
      self._app.fadeIn('slow');
    });
    
    // When we enter a message, send it and clear the message field.
    this._post.submit(function() {
      var msg = $('#message');
      self.post(msg.val());
      msg.val('');
      return false;
    });
  },
  
  /**
   * Sends messages that the user has entered. The message is scanned for
   * @reply-style mentions of other users, and the message is sent to those
   * users' channels.
   */
  post: function(orig_message) {
    
    // Message object to transmit over Comet channels
    message = {user: this._username, message: orig_message};
    
    // Publish to this user's 'from' channel, and to channels for any
    // @replies found in the message
    this._comet.publish('/main', message);
  },
  
  /**
   * Handler for messages received over subscribed channels. Takes the
   * message object sent by the post() method and displays it in
   * the user's message list.
   */
  accept: function(message) {
    this._stream.prepend('<li><b>' + message.user + ':</b> ' +
                                     message.message + '</li>');
  }
};

