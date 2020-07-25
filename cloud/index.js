const http = require("http");

function authenticate(fileName) {
  return new Promise((resolve, reject) => {
    let data = {
      payload: {
        document: {
          input_config: {
            gcs_source: {
              input_uris: `gs://code2xl_bucket/Check/${fileName}`,
            },
          },
        },
      },
    };
    let dataEncoded = JSON.stringify(data);
    let req = http.request(
      {
        host: "https://automl.googleapis.com",
        path:
          "/v1/projects/570686818487/locations/us-central1/models/TEN1878601377962262528:predict",
        method: "POST",
        headers: {
          Authorization:
            "Bearer $(gcloud auth application-default print-access-token)",
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let buffers = [];
        res.on("error", reject);
        res.on("data", (buffer) => buffers.push(buffer));
        res.on("end", () => {
          res.statusCode === 200
            ? resolve(Buffer.concat(buffers))
            : reject(Buffer.concat(buffers));
          console.log(Buffer.concat(buffers));
        });
      }
    );
    req.write(dataEncoded);
    req.end();
  });
}

authenticate();
