
function take_image(){
    var image = document.getElementById('input_image');
    image.style.display = "none";
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const snap = document.getElementById("startStop");
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 300, 200);
    //var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    //var image_array = imgData.data;
    var imgURL = canvas.toDataURL();
    image = imgURL.replace('data:image/png;base64,', '');
    dialog = bootbox.dialog({
        message: '<p class="text-center mb-0"><i class="fas fa-spin fa-cog"></i> Uploading and Predicting...</p>',
        closeButton: false
        });
    $.ajax({
        url: '/predict_canvas_function',
        type: 'post',
        data: image,
        contentType: "application/json",
        processData: false,
        dataType: 'json',
        success: function(response){
            dialog.modal("hide");
            table = document.getElementById('report_table').getElementsByTagName('tbody')
            for (var i = 0; i < response.length; i++) {
                $(table).append("<tr><th scope='row'>" + response[i]["filename"] + "</th><td>" + response[i]["label"] + "</td></tr>");
              }

              var image_pro = document.getElementById('input_image_processed');
              image_pro.src = response[0]["image_url"];
              image_pro.setAttribute( "onClick", 'window.open("'+response[0]['image_url']+'", "_blank");');

            bootbox.alert({
            size: "small",
            title: "<b><h3>Prediction</h3></b>",
            message: "Emoción: " + response[0]["label"],
            callback: function(){
                dialog.modal("hide");
            }
            });
        },
        error: function(response){
            bootbox.alert({
                size: "small",
                title: "<b><h3>Error</h3></b>",
                message: "Presentamos problemas, intentalo de nuevo.",
                callback: function(){
                    dialog.modal("hide");
                }
                });
         }
      });

}

function open_information (){
    bootbox.alert({
        title: 'Información de uso:',
        message: 'Listamos la funcionalidad de los iconos: <lu> <li>Con <img src="../static/folder.png" style="width:7%;" alt="Informacion"> podrás cargar una foto, lo que desencadenara la segmentación del/los rostros en la imágen y el reconocimiento de la/las emociones.</li> <li>Con <img src="../static/camera.png" style="width:7%;" alt="Informacion"> activarás la cámara. Permitiendote tomar fotos en las cuales se detectarán los rostros y sus emociones.</li> <li>Con el botón <button class="btn btn-danger">Descargar</button> podrás obtener un archivo .csv el cual contendrá las predicciones realizadas.</li> <li>Con el botón <button class="btn btn-info" style="background-color: #21b817;">Capturar foto </button> podrás capturar una foto en tiempo real y observar la predicción.</li> <li> Finalmente, si das click sobre la imágen inferior izquierda podrás verla apliada en una nueva pestaña. Esto te permitirá observar mejor la detección de rostros realizada.</li></lu>',
        buttons: {
        }
        });
}

// función para dibujar la imágen de entrada
function pictureSelected(){
    obj = document.getElementById('image_in')
    var image = document.getElementById('input_image');
    image.style.display = "block";
    image.src = URL.createObjectURL(obj.files[0]);

    var data = new FormData();
    var files = $('#image_in')[0].files;
    data.append('file',files[0]);

    dialog = bootbox.dialog({
        message: '<p class="text-center mb-0"><i class="fas fa-spin fa-cog"></i> Uploading and Predicting...</p>',
        closeButton: false
        });
    $.ajax({
        url: '/predict_function',
        type: 'post',
        data: data,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(response){
            dialog.modal("hide");
            table = document.getElementById('report_table').getElementsByTagName('tbody')
            for (var i = 0; i < response.length; i++) {
                $(table).append("<tr><th scope='row'>" + response[i]["filename"] + "</th><td>" + response[i]["label"] + "</td></tr>");
              }

            var image_pro = document.getElementById('input_image_processed');
            image_pro.src = response[0]["image_url"];
            image_pro.setAttribute( "onClick", 'window.open("'+response[0]['image_url']+'", "_blank");');

            bootbox.alert({
            size: "small",
            title: "<b><h3>Prediction</h3></b>",
            message: "Emoción: " + response[0]["label"],
            callback: function(){
                dialog.modal("hide");
            }
            });
        },
        error: function(response){
            bootbox.alert({
                size: "small",
                title: "<b><h3>Error</h3></b>",
                message: "Presentamos problemas, intentalo de nuevo.",
                callback: function(){
                    dialog.modal("hide");
                }
                });
         }
      });
  }

function activeVideoCam(){
    'use strict';

    const video = document.getElementById('video');
    const errorMsgElement = document.querySelector('span#errorMsg');
    const constraints = {
    audio: false,
    video: {
        width: 1280, height: 720
    }
    };
    // Access webcam
    async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
    }
    // Success
    function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
    }
    const tomar_foto_btn = document.getElementById('startStop');
    tomar_foto_btn.style.display="initial"
    // Load init
    init();

}

function take_photo(){
    //funcion para capturar un frame del video
    const canvas = document.getElementById('input_image');
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 320, 320);
}

function download_report(){
    csv = []
    rows = $('#report_table tr');
    for(i =0;i < rows.length;i++) {
        cells = $(rows[i]).find('td,th');
        csv_row = [];
        for (j=0;j<cells.length;j++) {
            txt = cells[j].innerText;
            csv_row.push(txt.replace(",", "-"));
        }
        csv.push(csv_row.join(","));
    }
    data_out = csv.join("\n")
    csv_file = new Blob([data_out], { type: "text/csv"});
    // Create to temporary link to initiate
    // download process
    let temp_link = document.createElement('a');
    // Download csv file
    temp_link.download = "reporte.csv";
    let url = window.URL.createObjectURL(csv_file);
    temp_link.href = url;
    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    // Automatically click the link to trigger download 
    temp_link.click();
    document.body.removeChild(temp_link);
}