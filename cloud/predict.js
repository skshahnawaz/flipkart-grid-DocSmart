/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const projectId = 'YOUR_PROJECT_ID';
// const location = 'us-central1';
// const modelId = 'YOUR_MODEL_ID';
// const inputUri = 'gs://YOUR_BUCKET_ID/path_to_your_input_csv_or_jsonl';
// const outputUri = 'gs://YOUR_BUCKET_ID/path_to_save_results/';

// Imports the Google Cloud AutoML library
const { PredictionServiceClient } = require("@google-cloud/automl").v1;

// Instantiates a client
const client = new PredictionServiceClient();

async function batchPredict() {
  // Construct request
  const request = {
    name: client.modelPath(projectId, location, modelId),
    inputConfig: {
      gcsSource: {
        inputUris: [inputUri],
      },
    },
    outputConfig: {
      gcsDestination: {
        outputUriPrefix: outputUri,
      },
    },
  };

  const [operation] = await client.batchPredict(request);

  console.log("Waiting for operation to complete...");
  // Wait for operation to complete.
  const [response] = await operation.promise();
  console.log(
    `Batch Prediction results saved to Cloud Storage bucket. ${response}`
  );
}

batchPredict();
