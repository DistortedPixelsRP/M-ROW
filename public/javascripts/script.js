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
        if(data){
            $('#matriculeButton').after('<div class="alert alert-primary" role="alert">Ce matricule est disponible !</div>');
        }
        else {
            $('#matriculeButton').after('<div class="alert alert-warning" role="alert">Ce matricule est indisponible !</div>');
        }
    });
}

// Signup - End


