(function () {
    let socket = io();
    let userType = "joiner";
    let userObj = {};
    $("#roomModal").modal({ backdrop: "static", keyboard: false });

    socket.on("rooms:get", function (rooms) {
        $("#room-list").empty();
        for (const [key, value] of Object.entries(rooms)) {
            $("#room-list")[0].append(new Option(key, key));
        }
    });

    $(".type-handler").on("click", function (event) {
        userType = $(this)[0].dataset.type;
        if (userType === "joiner") {
            $("#create-join-btn").text("Join Room");
        } else if (userType === "creator") {
            $("#create-join-btn").text("Create Room");
        }
    });

    $("#send-message").on("click", function (event) {
        event.preventDefault();
        let message = $("#input").val();
        socket.emit("message:send", userObj.roomId, { text: message, username: userObj.username, original_lang: userObj.lang });
        $("#input").val("");
        $("#messages").append($(`<li>${userObj.username}: ${message}</li>`));
        window.scrollTo(0, document.body.scrollHeight);
    });

    $("#create-join-btn").on("click", function () {
        if (userType === "joiner") {
            //join a room
            let username = $("#joiner-username").val();
            let lang = $("#joiner-language").val();
            let roomId = $("#room-list").val();
            userObj = {
                username,
                lang,
                roomId,
            };
            const User = {
                lang,
                username,
            };
            if (username.length < 1) return;
            if (lang.length < 1) return;
            if (roomId.length < 1) return;
            $("#roomModal").modal("hide");
            socket.emit("room:join", roomId, User);
            socket.on("room:userJoined", function (username, messages) {
                console.log(messages);
                $("#messages").append($(`<li>${username} has joined the chat.</li>`));
            });
            socket.on("message:receive", function (username, message) {
                console.log("message:receive", message);
                $("#messages").append($(`<li>${username}: ${message}</li>`));
            });
        } else if (userType === "creator") {
            //join a room
            let username = $("#creator-username").val();
            let lang = $("#creator-language").val();
            let roomId = $("#room-list").val();
            userObj = {
                username,
                lang,
                roomId,
            };
            const User = {
                lang,
                username,
            };
            if (username.length < 1) return;
            if (lang.length < 1) return;
            if (roomId.length < 1) return;
            $("#roomModal").modal("hide");
            socket.emit("room:join", roomId, User);
            socket.on("room:userJoined", function (username, messages) {
                console.log(messages);
                $("#messages").append($(`<li>${username} has joined the chat.</li>`));
            });
            socket.on("message:receive", function (username, message) {
                console.log("message:receive", message);
                $("#messages").append($(`<li>${username}: ${message}</li>`));
            });
        }
    });
})();
