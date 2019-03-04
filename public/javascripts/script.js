// Management - Start

function newKey() {
    $.get("/management/newkey", function (data) {
        $("#btnNewKey").after("<div class='alert alert-primary' role='alert'>Nouvelle clef : " + data.key1 + "-" + data.key2 + "-" + data.key3 + "</div>");
    });
}

function removeKeys() {
    $.get("/management/removekeys", function (data) {
        $("#btnRemoveKeys").after("<div class='alert alert-secondary' role='alert'>"+data.affectedRows+" clef(s) supprimée(s)</div>");
    });
}

// Management - End




// Signup - Start

function verifyMatricule(matricule) {
    $.get("/signup/checkmatricule/"+matricule, function (data) {
        if(data.result){
            $("#disponibilite").html("Ce matricule est disponible !");
            $("#disponibilite").addClass("alert-primary");
            $("#disponibilite").removeClass("alert-warning");
        }
        else {
            $("#disponibilite").html("Ce matricule est indisponible !");
            $("#disponibilite").removeClass("alert-primary");
            $("#disponibilite").addClass("alert-warning");
        }

        $("#disponibilite").fadeIn();
    });
}

// Signup - End


