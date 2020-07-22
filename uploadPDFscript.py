from google.cloud import storage

### Download test ###

def downloadFile(bucket_name: str='code2xl_bucket', source_blob_name: str='Invoices/1.pdf', destination_file_name: str='test.pdf'):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    blob.download_to_filename(destination_file_name)

    print("Blob {} downloaded to {}.".format(source_blob_name, destination_file_name))


### Upload test ###
def uploadFile(bucket_name: str='code2xl_bucket', source_file_name: str='test.pdf', destination_blob_name: str='Uploading-Testing/test1.pdf'):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(f'File {source_file_name} uploaded to {destination_blob_name}')