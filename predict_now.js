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
          input_uris: process.argv.slice(2)[0],
        },
      },
    },
  },
};

// console.log();
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
    (error, stdout, stderror) => {}
  );

  let prediction = {};
  exec(
    'curl -X POST \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  -H "Content-Type: application/json" \
  https://automl.googleapis.com/v1/projects/570686818487/locations/us-central1/models/TEN3772716864992444416:predict \
  -d @request.json',
    (error, stdout, stderror) => {
      let single = [
        "seller_name",
        "seller_address",
        "buyer_name",
        "seller_gstin",
        "invoice_number",
        "invoice_date",
      ];
      const json = stdout;
      const parsed = parseJson(json).payload;
      // console.log(stdout);
      parsed.forEach((entity) => {
        if (prediction[entity.displayName] == undefined) {
          prediction[entity.displayName] =
            entity.textExtraction.textSegment.content;
        } else {
          if (single.includes(entity.displayName) == false) {
            prediction[entity.displayName] =
              prediction[entity.displayName] +
              "#%#" +
              entity.textExtraction.textSegment.content;
          }
        }
      });
      jsonfile
        .writeFile(file2, prediction)
        .then((res) => {
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
          });
        })
        .catch((error) => console.error(error));
    }
  );
}
