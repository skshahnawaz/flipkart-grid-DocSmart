const axios = require("axios");

axios
  .post(
    "https://automl.googleapis.com/v1/projects/570686818487/locations/us-central1/models/TEN1878601377962262528:predict",
    {
      payload: {
        document: {
          input_config: {
            gcs_source: {
              input_uris: "gs://code2xl_bucket/Check/inv.pdf",
            },
          },
        },
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer ya29.c.Ko8B1Aevo2DUBIcLCLch1QPQwSLjMqQdwd7QwyuSpMke5x2F2BHOZQRrJuT6MQIXnwc_M16L1vwrkr5Xur2yoKAnZDPnK11jR_6JcWIrA3lZ5QYuEUQHO0KO3AqnIw38IAGFoQ9H_c_D0mZfS8HksmO2XAqTEOW7je7jTleLHwYCOfuD5N-d8MuFdqEqNQwDkLY",
      },
    }
  )
  .then((res) => {
    // console.log(`statusCode: ${res.statusCode}`);
    console.log(
      res.data.payload[0].displayName +
        " : " +
        res.data.payload[0].textExtraction.textSegment.content
    );
  })
  .catch((error) => {
    console.error(error);
  });
