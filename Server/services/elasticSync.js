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
          document: doc,
        });
        console.log("📡 Indexed to Elasticsearch:", doc.deviceId);
      }
    });

    console.log("✅ Elasticsearch sync active");
  } catch (err) {
    console.error("❌ Elasticsearch error:", err.message);
  }
}

module.exports = { setupElasticSync };
