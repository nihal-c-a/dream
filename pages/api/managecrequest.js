// dream/pages/api/managecrequest.js
import { MongoClient } from "mongodb";

const { ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db("dream");
    const requestsCollection = database.collection("requests");
    const clientsCollection = database.collection("client");
    const constructorsCollection = database.collection("constructor");
    const buildRequestCollection = database.collection("buildrequest");
    const sessionsCollection = database.collection("sessions");

    if (req.method === "GET") {
      const sessionId = req.headers.authorization;
      if (!sessionId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });
      const userId = session.userId;

      const requests = await requestsCollection.find({ userId }).toArray();
      const enhancedRequests = await Promise.all(
        requests.map(async (request) => {
          const client = await clientsCollection.findOne({
            _id: new ObjectId(request.userId),
          });
          const constructor = await constructorsCollection.findOne({
            _id: new ObjectId(request.constructorId),
          });
          const buildRequest = await buildRequestCollection.findOne({
            _id: new ObjectId(request.buildRequestId),
          });

          const reqstatus = await requestsCollection.findOne({
            _id: request._id,
          }); //added by me
          return {
            _id: request._id,
            clientName: `${client.firstname} ${client.lastname}`,
            constructorName: `${constructor.firstname} ${constructor.lastname}`,
            buildRequestName: buildRequest.projectName, // Assuming the project name is stored in the build request
            status: reqstatus.status, //added by me
          };
        })
      );

      res.status(200).json({ requests: enhancedRequests });
    } else if (req.method === "DELETE") {
      const { requestId } = req.body;

      const result = await requestsCollection.deleteOne({
        _id: new ObjectId(requestId),
      });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Request deleted successfully" });
      } else {
        res.status(404).json({ message: "Request not found" });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    await client.close();
  }
};
