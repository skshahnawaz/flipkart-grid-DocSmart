from flask import Flask, render_template, request, send_file
from uploadDownloadHandler import uploadFile, downloadFile
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

bucket = os.environ['CLOUD_STORAGE_BUCKET']

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/download')
def downloadFile():
    path = "output.xlsx"
    return send_file(path, as_attachment=True, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml')

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