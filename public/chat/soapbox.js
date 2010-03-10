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
    this._follow  = $('#addFollowee');
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
    this._comet.subscribe('/mentioning/' + this._username, this.accept, this);
    
    // Hide login form, show main application UI
    this._login.fadeOut('slow', function() {
      self._app.fadeIn('slow');
    });
    
    // When we add a follower, subscribe to a channel to which the
    // followed user will publish messages
    this._follow.submit(function() {
      var follow = $('#followee'),
          name   = follow.val();
      
      self._comet.subscribe('/from/' + name, self.accept, self);
      follow.val('');
      return false;
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
  post: function(message) {
    var mentions = [],
        words    = message.split(/\s+/),
        self     = this,
        pattern  = /\@[a-z0-9]+/i;
    
    // Extract @replies from the message
    $.each(words, function(i, word) {
      if (!pattern.test(word)) return;
      word = word.replace(/[^a-z0-9]/ig, '');
      if (word !== self._username) mentions.push(word);
    });
    
    // Message object to transmit over Comet channels
    message = {user: this._username, message: message};
    
    // Publish to this user's 'from' channel, and to channels for any
    // @replies found in the message
    this._comet.publish('/from/' + this._username, message);
    $.each(mentions, function(i, name) {
      self._comet.publish('/mentioning/' + name, message);
    });
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

