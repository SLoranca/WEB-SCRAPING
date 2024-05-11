let tools = {
    loading: {
        start: function () {
            let div = document.createElement('div');
            div.id = "preloader";
            div.innerHTML = '<div id="loader" class="spinner-border" role="status">\
                                <span class="sr-only hide">Loading...</span>\
                            </div>\
                            <span id="loaderText">cargando...</span>';
            document.body.appendChild(div);
        },
        stop: function () {
            let divLoading = document.getElementById("preloader");
            document.body.removeChild(divLoading);
        }
    },
    mensajeOK: function (mensaje) {
        swal.fire({
            title: "Aviso",
            text: mensaje,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Cerrar",
            showConfirmButton: true,
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    },
    mensajeInfo: function (mensaje) {
        swal.fire({
            title: "Aviso",
            text: mensaje,
            icon: "info",
            buttonsStyling: false,
            confirmButtonText: "Cerrar",
            showConfirmButton: true,
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    },
    mensajeError: function (mensaje) {
        swal.fire({
            title: "Error",
            text: mensaje,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Cerrar",
            showConfirmButton: true,
            customClass: {
                confirmButton: "btn btn-danger"
            }
        });
    },
    validCurp: function (text) {
        let re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
            validado = text.match(re);

        if (!validado)  //Coincide con el formato general?
            return false;

        //Validar que coincida el dígito verificador
        function digitoVerificador(curp17) {
            //Fuente https://consultas.curp.gob.mx/CurpSP/
            var diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
                lngSuma = 0.0,
                lngDigito = 0.0;
            for (var i = 0; i < 17; i++)
                lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
            lngDigito = 10 - lngSuma % 10;
            if (lngDigito == 10) return 0;
            return lngDigito;
        }

        if (validado[2] != digitoVerificador(validado[1]))
            return false;

        return true; //Validado
    },
    validEmail: function (text) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (text.match(mailformat)) {
            return true;
        }
        else {
            return false;
        }
    },
    validFecha: function (date) {
        return date instanceof Date && !isNaN(date);
    },
    clearInputs: function (content) {
        const inputs = document.getElementById(content).querySelectorAll("input");
        inputs.forEach(input => {
            input.value = '';
        });
    },
    exportar: {
        csv: function (table, nameFile) {
            // Variable to store the final csv data
            var csv_data = [];
            // Get each row data
            var rows = document.getElementById(table).getElementsByTagName('tr');
            for (var i = 0; i < rows.length; i++) {
                // Get each column data
                var cols = rows[i].querySelectorAll('td,th');
                // Stores each csv row data
                var csvrow = [];
                for (var j = 0; j < cols.length; j++) {
                    // Get the text data of each cell
                    // of a row and push it to csvrow
                    csvrow.push(cols[j].innerHTML);
                }
                // Combine each column value with comma
                csv_data.push(csvrow.join(","));
            }
            // Combine each row data with new line character
            csv_data = csv_data.join('\n');
            // Call this function to download csv file 
            this.downloadCSV(csv_data, nameFile);
        },
        pdf: function () {
        },
        downloadCSV: function (data, nameFile) {
            // Create CSV file object and feed
            // our csv_data into it
            CSVFile = new Blob(["\ufeff", data], {
                type: "text/csv"
            });

            // Create to temporary link to initiate
            // download process
            var temp_link = document.createElement('a');

            // Download csv file
            temp_link.download = nameFile + ".csv";
            var url = window.URL.createObjectURL(CSVFile);
            //let url = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSVFile);
            temp_link.href = url;

            // This link should not be displayed
            //temp_link.charset = "utf-8";
            temp_link.style.display = "none";
            document.body.appendChild(temp_link);

            // Automatically click the link to
            // trigger download
            temp_link.click();
            document.body.removeChild(temp_link);
        }
    },
    toUpper: function (e) {
        e.value = e.value.toUpperCase();
    },
    toLower: function (e) { 
        e.value = e.value.toLowerCase();
    },
    logOut: function () {
        localStorage.removeItem("data-apps");
        localStorage.removeItem("data-modules");
        localStorage.removeItem("data-photo");
    }
};

let dataTable = {
    table: "",
    buscador: "",
    targets: [],
    ordering: false,
    order: [0, "desc"],
    paging: true,
    info: true,
    select: false,
    pageLength: 10,
    destroy: function () {
        if ($.fn.DataTable.isDataTable(this.table)) {
            //$(this.table).DataTable().destroy();
            $(this.table).DataTable().clear();
            $(this.table).DataTable().destroy();
        }
    },
    load: function (datos) {
        this.destroy();
        var table = $(this.table).DataTable({
            dom: 'lrtip',
            "bLengthChange": false,
            "autoWidth": false,
            data: datos,
            responsive: true,
            lengthMenu: [5, 10, 25, 50, 100],
            pageLength: this.pageLength,
            order: this.order,
            ordering: this.ordering,
            info: this.info,
            select: this.select,
            paging: this.paging,
            language: {
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ de _END_ de _TOTAL_ registros",
                "infoEmpty": "Mostrando 0 de 0 de 0 registros",
                "infoFiltered": "(filtrado de _MAX_ registros en total)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Ver _MENU_ Registros",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "No se encontraron registros coincidentes",
                "paginate": {
                    "previous": "",
                    "next": "",
                }
            },
            columnDefs: this.targets
        });

        $(this.buscador).on('keyup', function () {
            table.search(this.value).draw();
        });
    }
};

let ajax = {
    tipo: "POST",
    async: false,
    serialize: true,
    token: false,
    parametros: {},
    send: function (url, response) {
        let tokenData = this.token ? 'Bearer ' + localStorage.getItem(app.storage.data_token) : "";
        $.ajax({
            async: this.async,
            type: this.tipo,
            url: url,
            contentType: this.serialize ? 'application/x-www-form-urlencoded; charset=UTF-8' : "application/json; charset=utf-8",
            dataType: "json",
            headers: { 'Authorization': tokenData },
            data: this.serialize ? this.parametros : JSON.stringify(this.parametros),
            beforeSend: function () {
                tools.loading.start();
            },
            success: function (data) {
                if (data.status === "ERROR") { tools.mensajeError(data.message); }
                else { response(data); }
            },
            error: function (_error) {
                if (_error.responseText === "NO_SESSION") { tools.logOut(); }
                else if (_error.responseText.includes("NO_AUTORIZADO;")) { tools.mensajeError("No tiene permiso para ejecutar esta acción (" + _error.responseText.split(";")[1] + "), comuniquese con el administrador."); }
                else {
                    tools.mensajeError(_error.responseText);
                    return null;
                }
            },
            complete: function () {
                tools.loading.stop();
            }
        });
    }
};

//valida numero y letras
$(".letter_and_numbers").keypress(function (key) {
    if (key.key.match(/[a-z0-9ñçáéíóú\s]/i) === null) {
        key.preventDefault();
    }
});

//valida numero y letras
$(".letter_and_numbers_and_guion").keypress(function (key) {
    if (key.key.match(/[a-z0-9ñçáéíóú-\s]/i) === null) {
        key.preventDefault();
    }
});

//valida letras
$(".letter").keypress(function (key) {
    if ((key.charCode < 97 || key.charCode > 122)//letras mayusculas
        && (key.charCode < 65 || key.charCode > 90) //letras minusculas
        && (key.charCode != 45) //retroceso
        && (key.charCode != 44) // ,
        && (key.charCode != 46) // .
        && (key.charCode != 241) //ñ
        && (key.charCode != 209) //Ñ
        && (key.charCode != 32) //espacio
        && (key.charCode != 225) //á
        && (key.charCode != 233) //é
        && (key.charCode != 237) //í
        && (key.charCode != 243) //ó
        && (key.charCode != 250) //ú
        && (key.charCode != 193) //Á
        && (key.charCode != 201) //É
        && (key.charCode != 205) //Í
        && (key.charCode != 211) //Ó
        && (key.charCode != 218) //Ú
    )
        return false;
});

//valida numeros
$(".numbers").keypress(function (e) {
    var key = window.Event ? e.which : e.keyCode
    return (key >= 48 && key <= 57)
});

//valida numeros y caracteres
$(".number_caracter").keypress(function (key) {
    if (key.key.match(/[0-9:]/i) === null) {
        key.preventDefault();
    }
});
