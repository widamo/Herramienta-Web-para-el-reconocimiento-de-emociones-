### Bienvenido a la herramienta Web para el reconocimiento de emociones humanas a partir de imágenes

- Esta herramienta permite el reconocimiento de emociones humanas a partir de imágenes de entrada, mediante el siguiente flujo:
    - A partir de la imágen de entrada se dectectan los rostros que hay en ella.
    - Se pasa como entrada a la red neuronal el o los rostros detectados. Si no se detectan rostros, se envía la imágen completa.

#### Requisitos para ejecutar en local

- Para poder ejecutar la aplicación en local es necesario instalar los requerimientos indicados en el archivo de <b>requirements.txt</b>. Esto se puede hacer mediante el comando:
    - pip install -r requirements.txt
- Una vez instalados los requisitos, se puede levantar la aplicación mediante el comando <i>python app.py</i>
    