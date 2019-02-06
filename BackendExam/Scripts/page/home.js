$(document).ready(function () {
    var HomeTask = {
        init: function () {
            var self = this;
            self.declaration();
            self.setEvents();
        },

        declaration: function () {
            var self = this;

            self.$tblUsers = $("#tblUsers");
            self.$btnAddClient = $("#btnAddClient");
            self.$btnShowProfile = $("#btnShowProfile");
            self.modalDirtyyn = false;
        },

        setEvents: function () {
            var self = this;

            var AddEditFunc = function ($element, taskcd, userid) {
                $.get("/Home/AddEditClient", { taskcd: taskcd, userid: userid }, function (partialviewhtmltx) {

                    var afterShowEventFunc = [], eventsBtnYes = [], eventsBtnNo = [];
                    var hidebtnyn = false;
                    var title = "View Client";
                    if (taskcd != "view") {
                        title = taskcd == "add" ? "Add Client" : "Edit Client";
                        afterShowEventFunc.push(function (modalObj) {
                            modalObj.$modalForm.validate();
                            self.modalDirtyyn = false;
                            $.each(modalObj.$modalForm.find("input[data-val-required]"), function (ind, obj) {
                                $(obj).rules('add', { required: true });
                            });

                            $.each(modalObj.$modalForm.find("input[data-numeric-only]"), function (ind, obj) {
                                $(obj).keypress(function (event) {
                                    if (event.charCode == 0) return;

                                    if ((event.charCode < 48 || event.charCode > 57)) event.preventDefault();

                                });
                            });

                            $.each(modalObj.$modalForm.find("input[data-valid-email]"), function (ind, obj) {
                                $(obj).rules('add', { email: true });
                            });


                            $.each(modalObj.$modalForm.find("input[data-date-only]"), function (ind, obj) {
                                $(obj).datepicker();
                                $(obj).rules('add', { date: true });
                            });
                        });

                        eventsBtnYes.push(function (modalObj) {
                            if (modalObj.$modalForm.valid()) {
                                var dataObjTemp = modalObj.$modalForm.serializeArray();
                                var dataObj = JSON.parse(JSON.stringify(dataObjTemp));
                                dataObj = {};

                                $.each(dataObjTemp, function (ind, obj) {
                                    var value = obj.value;
                                    if (obj.name.indexOf("_dt") > 0 && value.trim().length > 0) {
                                        var valueArr = value.split("/");
                                        value = valueArr[2] + "-" + valueArr[0] + "-" + valueArr[1];
                                        value += " 00:00:00";
                                        value = new Date(value).toISOString();
                                    }

                                    dataObj[obj.name] = value;
                                });
                                dataObj = JSON.stringify(dataObj);
                                $.ajax({
                                    url: "/Home/AddEditClient",
                                    data: dataObj,
                                    type: "POST",
                                    contentType: 'application/json; charset=utf-8',
                                    //dataType: 'json',
                                    success: function (returnData) {
                                        if (returnData.successyn) {
                                            var deferred = $.Deferred();

                                            $.when(deferred).done(function () {
                                                location.reload();
                                            });

                                            Alert("Record was successfully saved", deferred);
                                            modalObj.$modal.modal('toggle');

                                        } else {
                                            Alert("Record was not saved");
                                        }
                                    },
                                    error: function (data) {
                                        alert(data.responseText);
                                        //self.saveObj = undefined;
                                        //HideLoading();
                                    },
                                });
                            }
                        });
                    } else {
                        hidebtnyn = true;
                        afterShowEventFunc.push(function (modalObj) {
                            modalObj.$modalForm.find("input").attr("readonly", true);
                            modalObj.$modalForm.find("textarea").attr("readonly", true);
                            modalObj.$modalForm.find("select").attr("disabled", true);
                            self.modalDirtyyn = false;
                        });
                    }

                    $($element).modalTask({
                        title: title,
                        dataHtml: partialviewhtmltx,
                        eventsAfterShow: afterShowEventFunc,
                        eventsBtnYes: eventsBtnYes,
                        eventsBtnNo: eventsBtnNo,
                        btnYesHideyn: hidebtnyn,
                        btnNoHideyn: hidebtnyn
                    });
                }).fail(function (err) {
                    Alert(err.responseText);
                });
            }

            var DeleteFunc = function (userid) {
                var deferred = $.Deferred();

                $.when(deferred).done(function (answer) {
                    if (answer == "yes") {
                        $.post("/Home/DeleteClient", { userid: userid }, function (data) {
                            if (data.successyn) {
                                var deferred = $.Deferred();

                                $.when(deferred).done(function () {
                                    location.reload
                                })

                                Alert("Record was successfully deleted", deferred);

                            } else {
                                Alert("Record was not successfully deleted");
                            }
                        }).fail(function (err) {
                            Alert(err.responseText);
                        });
                    }
                });

                Confirmation("Are you sure you want to delete this record?", deferred)
            }

            self.$tblUsers.DataTable({
                "drawCallback": function (settings) {
                    self.$tblUsers.find("button[data-btnedit-yn]").on("click", function () {
                        var userid = $(this).parents("tr:first").data("user-id");
                        AddEditFunc($(this), "edit", userid);
                    });

                    self.$tblUsers.find("button[data-btndelete-yn]").on("click", function () {
                        var userid = $(this).parents("tr:first").data("user-id");
                        DeleteFunc(userid);
                    });
                }
            });

            self.$tblUsers.on('page.dt', function () {
                self.$tblUsers.find("button[data-btnedit-yn]").on("click", function () {
                    var userid = $(this).parents("tr:first").data("user-id");
                    AddEditFunc($(this), "edit", userid);
                });

                self.$tblUsers.find("button[data-btndelete-yn]").on("click", function () {
                    var userid = $(this).parents("tr:first").data("user-id");
                    DeleteFunc(userid);
                });
            });

            self.$btnShowProfile.on("click", function () {
                AddEditFunc($(this), "view", $(this).data("user-id"));
            });

            self.$btnAddClient.on("click", function (e) {
                e.preventDefault();
                var $element = $(this);
                if (!self.modalDirtyyn) {
                    self.modalDirtyyn = true;
                    var taskcd = "add";
                    var userid = 0;
                    AddEditFunc($element, taskcd, userid);
                }                
            });


        }
    }

    var StartHomeTask = function () {
        var homeTaskObj = Object.create(HomeTask);
        homeTaskObj.init();
    }

    StartHomeTask();
})