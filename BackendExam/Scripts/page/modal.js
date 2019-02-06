$(document).ready(function () {
    var ModalTaskObj = {
        init: function (element, options) {
            var self = this;
            self.$elemTrigger = $(element);
            self.options = $.extend({}, $.fn.modalTask.options, options);
            self.declaration();
            self.build();
        },

        declaration: function () {
            var self = this;
            self.$modal = undefined;
        },

        build: function () {
            var self = this;
            var body = "";
            var deferred = $.Deferred();

            $.when(deferred).done(function (body) {
                if (body != false) {
                    self.modalhtmltx = "<div class='modal fade in' id='" + self.options.id + "' tabindex='-1' role='dialog'>" +
                        "<div class='modal-dialog' role='document'>" +
                        "<div class='modal-content'>" +
                        "<div class='modal-header font6'>" +
                        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                        "<h4 class='text-center' style='font-weight:bold'>" + self.options.title + "</h4>" +
                        "</div>" +
                        "<div class='modal-body'>" + body + "</div>" +
                        " <div class='modal-footer'>" +
                        "<button type='button' id='btnYes' class='btn btn-primary btnModalFooter fa fa-floppy-o' >" + self.options.btnYestx + "</button>" +
                        "<button type='button' id='btnNo' class='btn btn-primary btnModalFooter btnOutlinePrimary fa fa-times' >" + self.options.btnNotx + "</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    $('body').append(self.modalhtmltx);

                    self.$modal = $("#" + self.options.id + ".modal");
                    self.modalTitle = self.$modal.find("div.modal-header h4").text();
                    self.$modalDialog = self.$modal.find("div.modal-dialog:first");
                    self.$modalBtnYes = self.$modal.find("div.modal-footer").find("button#btnYes");
                    self.$modalBtnNo = self.$modal.find("div.modal-footer").find("button#btnNo");
                    self.$modalForm = self.$modal.find("form:first");

                    self.modal = self.$modal.modal({ backdrop: "static", show: true }); // DISPLAY THE MODAL

                    //self.$modalDialog.css("width", "");
                    // SET MODAL WIDTH
                    if ((self.options.modalWidthRateno != "") && $.isNumeric(self.options.width))
                        self.$modalDialog.css("width", self.options.width + "%");

                    if (self.options.btnYesHideyn) {
                        //self.$modal.find("div.modal-footer").find("button#btnYes").remove();
                        self.$modalBtnYes.remove();
                    } else {
                        self.$modalBtnYes.text(self.options.btnYestx);
                    }

                    if (self.options.btnNoHideyn) {
                        //self.$modal.find("div.modal-footer").find("button#btnNo").remove();
                        self.$modalBtnNo.remove();
                    } else {
                        self.$modalBtnNo.text(self.options.btnNotx);
                    }

                    self.setEvents();
                } else {
                    if (self.options.eventsFailed.length > 0) {
                        $.each(self.options.eventsFailed, function (ind, failedEvent) {
                            failedEvent();
                        })
                    }
                }
            });

            if (self.options.dataText != undefined && self.options.dataText.trim().length > 0) {
                body = "<p>" + self.options.dataText.trim() + "</p>";
                deferred.resolve(body);
            } else if (self.options.dataHtml != undefined && self.options.dataHtml.trim().length > 0) {
                body = self.options.dataHtml;
                deferred.resolve(body);
            } else if (self.options.dataUrl != undefined && self.options.dataUrl.trim().length > 0) {
                body = dataHtml;

                $.get(self.options.dataUrl, function (returnData) {
                    body = returnData;
                    deferred.resolve(body);
                }).fail(function (error) {
                    deferred.resolve(false);
                });
            }
            else {
                deferred.resolve(false);
            }

        },

        setEvents: function () {
            var self = this;



            self.modal.on("shown.bs.modal", function () {
                if (self.options.eventsAfterShow.length > 0) {
                    $.each(self.options.eventsAfterShow, function (ind, afterShowFunc) {
                        afterShowFunc(self);
                    });
                }

                if (self.options.eventsBtnYes.length > 0) {
                    self.$modalBtnYes.on("click", function () {
                        $.each(self.options.eventsBtnYes, function (ind, btnYesFunc) {
                            btnYesFunc(self);
                        });
                    });
                }

                if (self.options.eventsBtnNo.length > 0) {
                    self.$modalBtnNo.on("click", function () {
                        $.each(self.options.eventsBtnNo, function (ind, btnNoFunc) {
                            btnNoFunc(self);
                        });
                    });
                } else {
                    self.$modalBtnNo.on("click", function () {
                        self.$modal.modal('toggle');
                    });
                }
            });

            if (self.options.eventsCloseModal.length > 0) {
                self.modal.on("hidden.bs.modal", function () {

                    $.each(self.options.eventsCloseModal, function (ind, closeModalFunc) {
                        closeModalFunc(self);
                    })

                    $(this).data('bs.modal', null);
                    self.$modal.remove();
                });
            } else {
                self.modal.on("hidden.bs.modal", function () {
                    $(this).data('bs.modal', null);
                    self.$modal.remove();
                });
            }

            setTimeout(function () {
                //self.modal.show();
            }, 1000);
        }
    }

    $.fn.modalTask = function (options) {
        var element = this;
        var modalTaskObj = Object.create(ModalTaskObj);
        modalTaskObj.init(element, options);
    }

    $.fn.modalTask.options = {
        id: "modal", // STRING || MODAL ID
        title: "Confirmation", // STRING || MODAL TITLE
        dataText: "", // STRING || TEXT CONTENT OF THE MODAL'S BODY
        dataHtml: "", // STRING || HTML CONTENT OF THE MODAL'S BODY
        dataUrl: "",
        btnYestx: " Save", // STRING || TEXT FOR THE YES BUTTON
        btnNotx: " Cancel", // STRING || TEXT FOR THE NO BUTTON
        btnYesHideyn: false, // BOOLEAN || HIDE YES BUTTON
        btnNoHideyn: false, // BOOLEAN || HIDE NO BUTTON
        width: undefined, // NUMERIC || WIDTH PERCENTAGE OF THE MODAL
        eventsBtnYes: [], // ARRAY || COLLECTION OF FUNCTIONS THAT WILL BE EXECUTED WHEN CLICKING THE YES BUTTON
        eventsBtnNo: [], // ARRAY || COLLECTION OF FUNCTIONS THAT WILL BE EXECUTED WHEN CLICKING THE NO BUTTON
        eventsAfterShow: [], // ARRAY || COLLECTION OF FUNCTIONS THAT WILL BE EXECUTED AFTER THE MODAL WAS SHOWN
        eventsCloseModal: [], // ARRAY ||COLLECTION OF FUNCTIONS THAT WILL BE EXECUTED AFTER THE MODAL WAS HIDDEN
        eventsFailed: [], // ARRAY || COLLECTION OF FUNCTIONS THAT WILL BE EXECUTED IF THE CREATION OF MODAL WAS UNSUCCESSFUL 
    }
});

var Confirmation = function (text, deferred) {

    var eventsBtnYes = [],
        eventsBtnNo = [],
        eventsCloseModal = [];

    eventsBtnYes.push(function (modalObj) {
        modalObj.answer = "yes";
        modalObj.$modal.modal('hide');
    });

    eventsBtnNo.push(function (modalObj) {
        modalObj.answer = "no";
        modalObj.$modal.modal('hide');
    });

    if (deferred != undefined) {
        eventsCloseModal.push(function (modalObj) {
            deferred.resolve(modalObj.answer);
        });
    }

    $("body").modalTask({
        id: "confirmation",
        dataText: text,
        eventsBtnYes: eventsBtnYes,
        eventsBtnNo: eventsBtnNo,
        eventsCloseModal: eventsCloseModal,
        btnYestx: "Yes",
        btnNotx: "No",
    });
}

var Alert = function (text, deferred, title, timeout) {
    var eventsCloseModal = [];

    if (timeout == undefined) timeout = 5000;
    if (title == undefined || title.length == 0) title = "Information";
    if (text == undefined || text.length == 0) text = "Success!";

    if (deferred != undefined) {
        eventsCloseModal.push(function (modalObj) {
            deferred.resolve(modalObj);
        });
    }

    $("body").modalTask({
        id: "alert",
        title: title,
        dataText: "<h4 style='text-align:center'>" + text + "</h4>" + "<style>.modal-footer{display:none}</style>",
        btnYesHideyn: true,
        btnNoHideyn: true,
        eventsCloseModal: eventsCloseModal
    });

    setTimeout(function () {
        $("#alert").modal("toggle");
    }, timeout);
}