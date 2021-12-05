(function () {
    let socket = io();
    let userType = "joiner";
    let userObj = {};
    $("#roomModal").modal({ backdrop: "static", keyboard: false });

    socket.on("rooms:get", function (rooms) {
        console.log("rooms:get");
        $("#room-list").empty();
        for (const [key, value] of Object.entries(rooms)) {
            console.log(value);
            $("#room-list")[0].append(new Option(key, `${key}${value.only_owner_can_chat ? "-locked" : ""}`));
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
            const username = $("#joiner-username").val();
            const lang = $("#joiner-language").val();
            const roomId = $("#room-list").val().split("-")[0];
            const isLocked = $("#room-list").val().split("-")[1] === "locked" ? true : false;
            if (isLocked) {
                $("#input").val("Only room owner can chat.").attr("disabled", true);
                $("#send-message").attr("disabled", true);
            }
            userObj = {
                username,
                lang,
                roomId,
            };
            if (username.length < 1) return;
            if (lang.length < 1) return;
            if (roomId.length < 1) return;
            $("#roomModal").modal("hide");
            socket.emit("room:join", roomId, userObj);
            socket.on("room:userJoined", function (username, messages) {
                console.log(messages);
                $("#messages").append($(`<li>${username} has joined the chat.</li>`));
            });
            socket.on("message:receive", function (username, message) {
                console.log("message:receive", message);
                $("#messages").append($(`<li>${username}: ${message}</li>`));
            });
        } else if (userType === "creator") {
            //create a room
            const username = $("#creator-username").val();
            const lang = $("#creator-language").val();
            const roomId = $("#creator-roomId").val();
            const onlyOwnerCanChat = $("#onlyOwnerCanChat").is(":checked");
            userObj = {
                username,
                lang,
                roomId,
            };
            if (username.length < 1) return;
            if (lang.length < 1) return;
            if (roomId.length < 1) return;
            socket.emit("room:create", roomId, userObj, onlyOwnerCanChat);

            socket.on("message:receive", function (username, message) {
                console.log("message:receive", message);
                $("#messages").append($(`<li>${username}: ${message}</li>`));
            });
            socket.on("room:userJoined", function (username, messages) {
                console.log(messages);
                $("#messages").append($(`<li>${username} has joined the chat.</li>`));
            });
            $("#roomModal").modal("hide");
        }
    });
})();
