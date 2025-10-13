const { Client } = require("@elastic/elasticsearch");
const DataLog = require("../models/DataLog");

const es = new Client({ node: "http://localhost:9200" });

async function setupElasticSync() {
  try {
    await es.indices.create({ index: "iot-data" }, { ignore: [400] });

    DataLog.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const doc = change.fullDocument;
        await es.index({
          index: "iot-data",
          id: doc._id.toString(),
          document: {
            deviceId: doc.deviceId,
            timestamp: doc.timestamp,
            ...doc.payload,
          },
        });
        console.log("Auto-indexed to Elasticsearch:", doc.deviceId);
      }
    });

    console.log("Elasticsearch sync active");
  } catch (err) {
    console.error("Elasticsearch error:", err.message);
  }
}

async function indexSensorData(data) {
  try {
    await es.index({
      index: "iot-data",
      document: data,
    });
    console.log("Manually indexed to Elasticsearch");
  } catch (err) {
    console.error("Elasticsearch indexing error:", err.message);
  }
}

module.exports = { setupElasticSync, indexSensorData };
