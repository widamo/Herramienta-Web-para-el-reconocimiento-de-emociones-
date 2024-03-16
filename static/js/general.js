
function take_image(){
    var image = document.getElementById('input_image');
    image.style.display = "none";
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const snap = document.getElementById("startStop");
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 300, 200);
    var imgURL = canvas.toDataURL();
    image = imgURL.replace('data:image/png;base64,', '');
    dialog = bootbox.dialog({
        message: '<p class="text-center mb-0"><i class="fas fa-spin fa-cog"></i> Cargando y Prediciendo...</p>',
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
            var msg_pre_list = ""
            var count = 0
            if (response[0]["label"] != "nothing"){
                for (var i = 0; i < response.length; i++) {
                    $(table).append("<tr><th scope='row'>" + response[i]["filename"] + "</th><td>" + response[i]["label"] + "</td></tr>");
                    msg_pre_list += "<li>" + String(count) + ": " + response[i]["label"]
                    count += 1
                  }
    
                  var image_pro = document.getElementById('input_image_processed');
                  image_pro.src = response[0]["image_url"];
                  image_pro.setAttribute( "onClick", 'window.open("'+response[0]['image_url']+'", "_blank");');
    
                bootbox.alert({
                size: "small",
                title: "<b><h3>Predicción</h3></b>",
                message: "Emoción: " + msg_pre_list,
                callback: function(){
                    dialog.modal("hide");
                }
                });
            }
            else {
                bootbox.alert({
                    size: "small",
                    title: "<b><h3>Lo siento!</h3></b>",
                    message: "No se reconoció ningún rostro en la imagen, por lo que no es posible predecir una emoción.",
                    callback: function(){
                        dialog.modal("hide");
                    }
                    });
            }
            
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
        title: 'Información de Uso:',
        message: 'Herramienta Web para el reconocimiento de emociones humanas a partir de imagenes. A continuación, se detalla la función de cada uno de los íconos.<lu><li><img src="../static/folder.png" style="width:8%;" alt="Informacion"> Cargar un archivo de Imagen. Se activará automaticamente la función de segmentación de rostros en la imagen, seguida del reconocimiento de emociones. </li><li><img src="../static/camera.png" style="width:8%;" alt="Informacion"> Activar camara del dispositivo. </li><li><button class="btn btn-info" style="background-color: #21b817;font-size: 80%;">Capturar foto </button> Capturar una foto en tiempo real. La función de segmentación de rostros en la imagen se activará automáticamente, seguida del reconocimiento de emociones. </li><li> <button class="btn btn-danger" style="font-size: 80%;">Descargar</button> Descargar un archivo CSV que contiene el informe completo de las predicciones realizadas.</li><li>Finalmente, al hacer clic sobre la imagen que se encuentra en el panel izquierdo en la parte inferior, se ampliará automaticamente en una nueva pestaña donde se mostrara la detección y segmentación de los rostros realizada. </li></lu>',
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
        message: '<p class="text-center mb-0"><i class="fas fa-spin fa-cog"></i> Cargando y Prediciendo...</p>',
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
            msg_pre_list = ""
            if (response[0]["label"] != "nothing"){
                var count = 0
                for (var i = 0; i < response.length; i++) {
                    $(table).append("<tr><th scope='row'>" + response[i]["filename"] + "</th><td>" + response[i]["label"] + "</td></tr>");
                    msg_pre_list += "<li>" + String(count) + ": " + response[i]["label"]
                    count += 1
                }
                var image_pro = document.getElementById('input_image_processed');
                image_pro.src = response[0]["image_url"];
                image_pro.setAttribute( "onClick", 'window.open("'+response[0]['image_url']+'", "_blank");');

                bootbox.alert({
                size: "small",
                title: "<b><h3>Predicción</h3></b>",
                message: "Emoción(es): " + msg_pre_list,
                callback: function(){
                    dialog.modal("hide");
                }
                });
            }
            else{
                bootbox.alert({
                    size: "small",
                    title: "<b><h3>Lo siento!</h3></b>",
                    message: "No se reconoció ningún rostro en la imagen, por lo que no es posible predecir una emoción.",
                    callback: function(){
                        dialog.modal("hide");
                    }
                    });
            }
            
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
    temp_link.download = "Informe.csv";
    let url = window.URL.createObjectURL(csv_file);
    temp_link.href = url;
    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    // Automatically click the link to trigger download 
    temp_link.click();
    document.body.removeChild(temp_link);
}