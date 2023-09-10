from flask import Flask, flash, request, redirect, url_for, render_template, jsonify
from werkzeug.utils import secure_filename
import tensorflow
from tensorflow import keras
import numpy as np
from PIL import Image

MODEL_NAME = 'mnist_v2.keras'
model = keras.models.load_model(MODEL_NAME, compile = False)
model.compile(
	loss = 'sparse_categorical_crossentropy',
	optimizer = 'adam',
	metrics = ['accurary'])

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('index.html')

@app.route('/predict', methods = ['POST'])
def predict():
	if request.method == 'POST':
		content = request.json
		image_array = np.array(content['image']).astype(np.uint8)
		image_array_reshaped = np.reshape(image_array, (256, 256, 4))[:, :, :1]
		image_array_reshaped = np.reshape(image_array_reshaped, (256, 256))
		image = Image.fromarray(image_array_reshaped)
		image_resized = image.resize((28, 28))
		image_reshaped = np.reshape(
			np.asarray(image_resized),
			(1, 28, 28, 1))
		inference = model(image_reshaped, training = False).numpy()
		return jsonify(inference = inference.tolist())

if __name__ == '__main__':
	app.run(debug = True)