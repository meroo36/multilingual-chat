(function () {
    let socket = io();
    let userType = "joiner";
    let userObj = {};
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
        console.log(userObj.roomId);
        socket.emit("message:send", userObj.roomId, userObj.username, message);
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
            socket.on("room:userJoined", function (username) {
                $("#messages").append($(`<li>${username} has joined the chat room.</li>`));
            });
            socket.on("message:recieve", function (username, message) {
                console.log("message:recieve", message);
                $("#messages").append($(`<li>${username}: ${message}</li>`));
            });
        } else if (userType === "creator") {
            //create a room and join
        }
    });
})();
