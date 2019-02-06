$(document).ready(function () {
    var LoginTask = {
        init: function () {
            var self = this;;

            self.declaration();
            self.setEvents();
        },

        declaration: function () {
            var self = this;

            self.$frmLogin = $("#frmLogin");
            self.$btnLogin = $("#btnLogin");
            self.$txtUsername = $("#txtUsername");

            self.landingPageURL = self.$frmLogin.data("url-content");
        },

        setEvents: function () {
            var self = this;

            self.$btnLogin.on("click", function (e) {
                if (self.$txtUsername.val().trim().length > 0) {
                    $.post("/Login/Login", { username: self.$txtUsername.val().trim() }, function (data) {
                        if (!data.loggedin_yn) {
                            alert(data.remarks_tx);
                        } else {
                            window.location = self.landingPageURL;
                        }
                    }).fail(function (err) {
                        alert("Login failed");
                    })
                } else {
                    alert("Please enter a username");
                }
            });
        }
    }

    var StartLoginTask = function () {
        var loginTaskObj = Object.create(LoginTask);
        loginTaskObj.init();
    }

    StartLoginTask();
});