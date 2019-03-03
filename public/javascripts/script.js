// Management - Start

function newKey () {
    $.get("/management/newkey", function (data) {
        $("#btn").after("<div class='alert alert-primary' role='alert'>Nouvelle clef : " + data.key1 + "-" + data.key2 + "-" + data.key3 + "</div>");
    });
}

// Management - End



