console.log("scraping");
let array_scraping=[];

function scraping() {
    if (!$("#Form").valid()) { tools.mensajeError("Todos los campos son obligatorios."); return false; }
    ajax.async = false;
    ajax.serialize = true;
    ajax.parametros = {
        urlScraping: document.getElementById("txtUrl").value,
        classScraping: document.getElementById("txtClass").value
    };
    ajax.send("/Home/Scraping", function (response) {
        let html="";
        if(response.status==="OK"){
            let data = response.data;
            array_scraping = [];
            if (data != null) {
            data.map(function (item, index) {
                array_scraping.push({
                    items:item
                });

                html += "<li>"+item+"</li>";
            });
            }
            else{
                html = "";
                tools.mensajeError(response.message);
            }
        }

        let arrayString = JSON.stringify(array_scraping);

        if(localStorage.length >= 0)
        {
            localStorage.setItem("scraping-"+localStorage.length.toString(), arrayString);
        }

        document.getElementById("listScraping").innerHTML = html;
    });
}

function clearScraping(){
    document.getElementById("txtUrl").value="";
    document.getElementById("txtClass").value="";
    document.getElementById("listScraping").innerHTML = "";
}

$(function () {
    $("#Form").validate({
        rules: {
            url: { required: true },
            class: { required: true }
        },
        messages: {
            url: { required: "" },
            class: { required: "" }
        }
    });
});