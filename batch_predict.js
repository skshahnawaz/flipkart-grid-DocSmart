/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
process.env.GOOGLE_APPLICATION_CREDENTIALS = "key.json";

const projectId = "prefab-sky-282212";
const location = "us-central1";
const modelId = "TEN1878601377962262528";
const inputUri = "gs://flipkart-grid/batch_predict.jsonl";
const outputUri = "gs://flipkart-grid/prediction_results/";

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
