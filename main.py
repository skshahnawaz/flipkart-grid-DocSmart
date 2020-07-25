from flask import Flask, render_template, request
from uploadDownloadHandler import uploadFile, downloadFile
import os

app = Flask(__name__)

bucket = os.environ['CLOUD_STORAGE_BUCKET']

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'GET':
        return 'error get request'
    else:
        uploaded_file = request.files.get('file')

        if not uploaded_file:
            return 'No file uploaded', 400

    return uploadFile(bucket, uploaded_file)

if __name__ == '__main__':
    app.run(debug=True, port='9000', host='localhost')