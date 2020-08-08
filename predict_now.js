const { exec } = require("child_process");
const jsonfile = require("jsonfile");
const parseJson = require("parse-json");

const file = "./request.json";
const file2 = "./predicted.json";

const obj = {
  payload: {
    document: {
      input_config: {
        gcs_source: {
          input_uris: "gs://flipkart-grid/1.pdf",
        },
      },
    },
  },
};

// create request.json
jsonfile
  .writeFile(file, obj)
  .then((res) => {
    console.log("Write complete");
    ocr();
  })
  .catch((error) => console.error(error));

function ocr() {
  exec(
    'export GOOGLE_APPLICATION_CREDENTIALS="key.json"',
    (error, stdout, stderror) => {
      if (error) {
        console.log("error : ", error.message);
        return;
      }
      if (stderror) {
        console.log("stderror : ", stderror);
        return;
      }
    }
  );

  exec(
    "gcloud auth activate-service-account myserviceaccount@prefab-sky-282212.iam.gserviceaccount.com --key-file=key.json --project=prefab-sky-282212",
    (error, stdout, stderror) => {
      //   if (error) {
      //     console.log("error : ", error.message);
      //     return;
      //   }
      //   if (stderror) {
      //     console.log("stderror : ", stderror);
      //     return;
      //   }
    }
  );

  let prediction = {};
  exec(
    'curl -X POST \
    -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
    -H "Content-Type: application/json" \
    https://automl.googleapis.com/v1/projects/570686818487/locations/us-central1/models/TEN1878601377962262528:predict \
    -d @request.json',
    (error, stdout, stderror) => {
      // if (error) {
      //   console.log("error : ", error.message);
      //   return;
      // }
      // if (stderror) {
      //   console.log("stderror : ", stderror);
      //   return;
      // }
      const json = stdout;
      const parsed = parseJson(json).payload;
      parsed.forEach((entity) => {
        //   prediction.push({

        // });
        prediction[entity.displayName] =
          entity.textExtraction.textSegment.content;
        // console.log(prediction);
        // console.log(entity.displayName);
        // console.log(entity.textExtraction.textSegment.content);
      });
      jsonfile
        .writeFile(file2, prediction)
        .then((res) => {
          // console.log("Done");
          // insert into excel
          exec("python3 format.py", (err, stdout, stderror) => {
            if (error) {
              console.log("error : ", error.message);
              return;
            }
            if (stderror) {
              console.log("stderror : ", stderror);
              return;
            }
            console.log(stdout);
            // console.log("Done");
          });
        })
        .catch((error) => console.error(error));
    }
  );
}
