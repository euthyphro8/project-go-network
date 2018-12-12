new Vue({
    el: '#chat',

    data: {
        ws: null,           // Our websocket
        newMsg: '',         // Holds new messages to be sent to the server
        chatContent: '',    // A running list of chat messages displayed on the screen
        email: null,        // Email address used for grabbing an avatar
        username: null,     // Our username
        joined: false       // True if email and username have been filled in
    },
    created: function() {
        this.ws = new WebSocket('ws://' + window.location.host + '/chat-ws');
        this.ws.addEventListener('message', 
            function(e) {
                var msg = JSON.parse(e.data);
                console.log(msg.message);
                this.chatContent += '<div class="chip">'
                + msg.username + ': '
                + msg.message
                + '</div>' + '<br/>';
                var element = document.getElementById('chat-messages');
                element.scrollTop = element.scrollHeight;
            });
    },
    methods: {
        send: function () {
            if (this.newMsg != '') {
                this.ws.send(
                    JSON.stringify({
                        email: this.email,
                        username: this.username,
                        message: $('<p>').html(this.newMsg).text() // Strip out html
                    }
                ));
                this.newMsg = '';
            }
        },
        join: function () {
            if (!this.email) {
                Materialize.toast('You must enter an email', 2000);
                return
            }
            if (!this.username) {
                Materialize.toast('You must choose a username', 2000);
                return
            }
            this.email = $('<p>').html(this.email).text();
            this.username = $('<p>').html(this.username).text();
            this.joined = true;
        }
    }
});