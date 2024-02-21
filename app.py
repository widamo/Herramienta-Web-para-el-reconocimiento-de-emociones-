from flask import Flask, render_template, request, redirect, session, url_for, jsonify, json
import numpy as np
import base64
import tensorflow as tf
import string
from PIL import Image, ImageOps
import cv2
import io

#secret = 'K17IuiZKHk6BKhzVO5nsbAlTHEqsbKov8jPUDQwOZes'

app = Flask(__name__)
#app.secret_key = secret

#ruta = "/home/ubuntu/flaskproject/static/"
ruta = "/home/edwin/Documentos/proyectos_ai/emotion_recognition/static/"

class emotion_class:
    
    def __init__(self, ruta):
        """
        se carga el modelo en memoria
        """
        self.categories = {
            0 : "Angry",
            1 : "Disgust",
            2 : "Fear",
            3 : "Happy",
            4 : "Sad",
            5 : "Surprise",
            6 : "Neutral"
        }
        self.model = tf.keras.models.load_model(ruta + "FER2013_model_V2.h5")
        self.faces_model = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def process_image(self, image, width):
        """
        Función que se encarga de procesar la imagen que recibe el modelo
        """
        return np.mean(np.asanyarray(image), axis=2).reshape((1,width,width,1))
    
    def get_detected_faces(self, input_image):
        """
        función para detectar rostros dentro de una imagen
        """
        faces = self.faces_model.detectMultiScale(input_image, scaleFactor=1.4, minNeighbors=2
                                                  ,flags=cv2.CASCADE_SCALE_IMAGE)
        list_faces = []
        if len(faces) != 0:
            #Pintar rectangulos encontrados
            for (x, y, w, h) in faces:
                input_image=cv2.rectangle(input_image, (x, y), (x+w, y+h), (255, 0, 0), 2)
                reg = input_image[y:(y+h),x:(x+w)]
                reg_Scala = cv2.resize(reg,(48,48), interpolation=cv2.INTER_CUBIC)
                list_faces.append(reg_Scala)

        return input_image, list_faces
    
    def predict_class(self, input_image):
        prediction = np.argmax(self.model.predict(input_image))
        return self.categories[prediction]

ec_model = emotion_class(ruta)

##### fin de la implementación 

@app.route('/')
def index():
    return render_template("index.html") 

#------------------------------------------------
#--------------- Predict function ---------------
#------------------------------------------------
@app.route("/predict_function", methods=['POST'])
def predict_function():
    file = request.files['file'].read() ## byte file
    file_name = request.files["file"].filename
    npimg = np.frombuffer(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.COLOR_BGR2GRAY)
    result = []
    faces, input_images = ec_model.get_detected_faces(img)
    index = 0
    if len(input_images) > 0:
        for img in input_images:
            pro_img = ec_model.process_image(img, 48)
            prediction = ec_model.predict_class(pro_img)
            name_split = file_name.split(".")
            result.append(
                {"label": prediction,
                "filename": name_split[0] + "_" + str(index) + "."+ name_split[1] ,
                "image_url": "../static/predictions/" + file_name}
            )
            index += 1
    else:
        pro_img = ec_model.process_image(cv2.resize(img,(48,48), 
                                                    interpolation=cv2.INTER_CUBIC), 48)
        prediction = ec_model.predict_class(pro_img)
        name_split = file_name.split(".")
        result.append(
            {"label": prediction,
            "filename": name_split[0] + "_" + str(index) + "."+ name_split[1] ,
            "image_url": "../static/predictions/" + file_name}
        )
    
    cv2.imwrite(ruta + "/predictions/" + file_name,  faces) 
    return result


@app.route("/predict_canvas_function", methods=['POST'])
def predict_canvas_function():
    data = request.data
    imgdata = base64.b64decode(str(data.decode("utf-8")))
    img = Image.open(io.BytesIO(imgdata))
    opencv_img = cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)
    file_name = f"frame_{np.random.randint(0,100)}.png"
    result = []
    faces, input_images = ec_model.get_detected_faces(opencv_img)
    index = 0
    if len(input_images) > 0:
        for img in input_images:
            pro_img = ec_model.process_image(img, 48)
            prediction = ec_model.predict_class(pro_img)
            name_split = file_name.split(".")
            result.append(
                {"label": prediction,
                "filename": name_split[0] + "_" + str(index) + "."+ name_split[1] ,
                "image_url": "../static/predictions/" + file_name}
            )
            index += 1
    else:
        pro_img = ec_model.process_image(cv2.resize(opencv_img,(48,48), 
                                                    interpolation=cv2.INTER_CUBIC), 48)
        prediction = ec_model.predict_class(pro_img)
        name_split = file_name.split(".")
        result.append(
            {"label": prediction,
            "filename": name_split[0] + "_" + str(index) + "."+ name_split[1] ,
            "image_url": "../static/predictions/" + file_name}
        )
    cv2.imwrite(ruta + "/predictions/" + file_name,  faces) 
    return result

@app.route("/health", methods=['GET'])
def health():
    return {"text": "ALIVE!"}

if __name__ == "__main__":
    app.run(debug=True)
