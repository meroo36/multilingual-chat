(function () {
    $("#roomModal").modal({ backdrop: "static", keyboard: false });

    let socket = io();
    let userType = "joiner";
    let userObj = {};

    socket.on("rooms:get", function (rooms) {
        $("#room-list").empty();
        for (const [key, value] of Object.entries(rooms)) {
            $("#room-list")[0].append(new Option(`${key}(${value.users.length})`, `${key}${value.only_owner_can_chat ? "-locked" : ""}`));
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
        let createRGB = `rgb(${(userObj.username.charCodeAt(0) * 999) % 255}, ${(userObj.username.charCodeAt(1) * 999) % 255}, ${
            (userObj.username.charCodeAt(2) * 999) % 255
        })`;
        $("#messages").append($(`<li><b style="color:${createRGB}">${userObj.username}</b>: ${message}</li>`));
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
            $("#roomModal").modal("hide");
        }
        socket.on("message:receive", function (username, message) {
            let createRGB = `rgb(${(username.charCodeAt(0) * 999) % 255}, ${(username.charCodeAt(1) * 999) % 255}, ${
                (username.charCodeAt(2) * 999) % 255
            })`;
            $("#messages").append($(`<li><b style="color:${createRGB}">${username}</b>: ${message}</li>`));
        });
        socket.on("room:userJoined", function (username) {
            let createRGB = `rgb(${(username.charCodeAt(0) * 999) % 255}, ${(username.charCodeAt(1) * 999) % 255}, ${
                (username.charCodeAt(2) * 999) % 255
            })`;
            $("#messages").append($(`<li><b style="color:${createRGB}">${username}</b> has joined the chat.</li>`));
        });
        socket.on("room:userLeft", function (username) {
            let createRGB = `rgb(${(username.charCodeAt(0) * 999) % 255}, ${(username.charCodeAt(1) * 999) % 255}, ${
                (username.charCodeAt(2) * 999) % 255
            })`;
            $("#messages").append($(`<li><b style="color:${createRGB}">${username}</b> has left the chat.</li>`));
        });
    });
})();
