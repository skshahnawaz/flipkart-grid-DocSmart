from google.cloud import storage

### Download test ###

storage_client = storage.Client()

bucket_name = 'code2xl_bucket'
source_blob_name = 'Invoices/1.pdf'
destination_file_name = 'test.pdf'

bucket = storage_client.bucket(bucket_name)
blob = bucket.blob(source_blob_name)
blob.download_to_filename(destination_file_name)

print(
    "Blob {} downloaded to {}.".format(
        source_blob_name, destination_file_name
    )
)