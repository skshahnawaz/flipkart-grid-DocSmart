from google.cloud import storage
from flask import render_template
import requests
import json
import os

### Download test ###

def downloadFile(bucket_name: str='code2xl_bucket', source_blob_name: str='Invoices/1.pdf', destination_file_name: str='test.pdf'):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    blob.download_to_filename(destination_file_name)

    print("Blob {} downloaded to {}.".format(source_blob_name, destination_file_name))


### Upload test ###
def uploadFile(bucket_name, source_file):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    destination_blob_name = source_file.filename
    blob = bucket.blob(destination_blob_name)

    # blob.upload_from_filename(source_file_name)
    blob.upload_from_string(
        source_file.read(),
        content_type=source_file.content_type
    )

    os.system('node predict_now.js gs://flipkart-grid/'+source_file.filename)

    # data = {'invoicePath': 'code2xl_bucket/Upload-Testing/Invoice.pdf'}
    # url = 'https://us-central1-shopsafe-ju.cloudfunctions.net/api/extract'

    # x = requests.post(url, data)
    # x = json.loads(x.text)
    return render_template('upload.html', filename=source_file.filename, destination=destination_blob_name)
    # return json.dumps(x, indent=4, sort_keys=True)

