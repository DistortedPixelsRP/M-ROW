// Socket IO  - Start

const socket = io('http://localhost:8000')

$("#alert_red").on('click', function () {
    socket.emit("alert-level", "red");
});
$("#alert_orange").on('click', function () {
    socket.emit("alert-level", "orange");
});
$("#alert_green").on('click', function () {
    socket.emit("alert-level", "green");
});

socket.on('alert-level', function (data) {
    if (data == "green") {
        $("#alert-level").html("Verte");
        $("#alert-level").css("color", "green");

    }
    if (data == "orange") {
        $("#alert-level").html("Orange");
        $("#alert-level").css("color", "orange");
    }
    if (data == "red") {
        $("#alert-level").html("Rouge");
        $("#alert-level").css("color", "red");
    }
});

$("#ordersModify").on('click', function () {
    const ordersTxt = $("#ordersTextIn").val();
    socket.emit("orders", ordersTxt);
});

socket.on('orders', function (data) {
    $("#ordersText").html(data);
});


$("#startServiceBtn").on('click', function () {
    socket.emit("service", "En service");
});

$("#civilServiceBtn").on('click', function () {
    socket.emit("service", "Service civil");
});

$("#stopServiceBtn").on('click', function () {
    socket.emit("service", "Hors-service");
});


// Socket IO - End




// Management - Start

function newKey() {
    $.get("/management/newkey", function (data) {
        $("#btnNewKey").after("<div class='alert alert-primary' role='alert'>Nouvelle clef : " + data.key1 + "-" + data.key2 + "-" + data.key3 + "</div>");
    });
}

function removeKeys() {
    $.get("/management/removekeys", function (data) {
        $("#btnRemoveKeys").after("<div class='alert alert-secondary' role='alert'>" + data.affectedRows + " clef(s) supprimée(s)</div>");
    });
}

function rankModify(rank, matricule) {
    $.get("/management/changerank/" + rank + "/" + matricule, function (data) {
        if (data.result) {
            $("#rnkModifyMsg").html("Rang modifé.");
            $("#rnkModifyMsg").addClass("alert-primary");
            $("#rnkModifyMsg").removeClass("alert-warning");
        }
        else {
            $("#rnkModifyMsg").html("Le matricule n'est pas utilisé.");
            $("#rnkModifyMsg").removeClass("alert-primary");
            $("#rnkModifyMsg").addClass("alert-warning");
        }
        $("#rnkModifyMsg").fadeIn();
    });
}

// Management - End




// Signup - Start

function verifyMatricule(matricule) {

    if (matricule.length == 2 && !isNaN(matricule)) {
        $.get("/signup/checkmatricule/" + matricule, function (data) {
            if (data.result) {
                $("#alert").html("Ce matricule est disponible !");
                $("#alert").addClass("alert-primary");
                $("#alert").removeClass("alert-warning");
            }
            else {
                $("#alert").html("Ce matricule est indisponible !");
                $("#alert").removeClass("alert-primary");
                $("#alert").addClass("alert-warning");
            }

            $("#alert").fadeIn();
        });
    }
    else {
        $("#alert").html("Veuillez entrer une valeur correcte.");
        $("#alert").removeClass("alert-primary");
        $("#alert").addClass("alert-warning");
    }


}

// Signup - End


