// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");
// Imports the Google Cloud AutoML library
const { PredictionServiceClient } = require("@google-cloud/automl").v1;

const projectId = "prefab-sky-282212";
const location = "us-central1";
const modelId = "TEN1878601377962262528";
// const content = "text to predict";

// Instantiates a client
const client = new PredictionServiceClient();

// Creates a client
const storage = new Storage();
// Creates a client from a Google service account key.
// const storage = new Storage({keyFilename: "key.json"});

const bucketName = "flipkart-grid-bucket";

async function createBucket() {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
}

// createBucket().catch(console.error);

async function uploadFile() {
  // Uploads a local file to the bucket
  const filename = "invoice.pdf";

  await storage.bucket(bucketName).upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: "public, max-age=31536000",
    },
  });

  console.log(`${filename} uploaded to ${bucketName}.`);
}

// uploadFile().catch(console.error);

async function predict() {
  // Construct request
  const request = {
    name: client.modelPath(projectId, location, modelId),
    payload: {
      document: {
        input_config: {
          gcs_source: {
            input_uris: "gs://code2xl_bucket/Check/1.pdf",
          },
        },
      },
    },
  };

  const [response] = await client.predict(request);

  //   for (const annotationPayload of response.payload) {
  //     console.log(`Text Extract Entity Types: ${annotationPayload.displayName}`);
  //     console.log(`Text Score: ${annotationPayload.textExtraction.score}`);
  //     const textSegment = annotationPayload.textExtraction.textSegment;
  //     console.log(`Text Extract Entity Content: ${textSegment.content}`);
  //     console.log(`Text Start Offset: ${textSegment.startOffset}`);
  //     console.log(`Text End Offset: ${textSegment.endOffset}`);
  //   }
}

predict();
