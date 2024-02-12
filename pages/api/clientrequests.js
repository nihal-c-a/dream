// dream/pages/api/clientrequestnotifications.js
import { MongoClient, ObjectId } from "mongodb";

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
    const clientCollection = database.collection("client");
    const buildrequestCollection = database.collection("buildrequest");
    const sessionsCollection = database.collection("sessions");

    if (req.method === "GET") {
      const sessionId = req.headers.authorization;
      
      if (!sessionId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const session = await sessionsCollection.findOne({ sessionId });
      const constructorId = session.userId;

      const requestList = await requestsCollection
        .find({
          status: "requested",
          constructorId: constructorId,
          active: true,
        })
        .toArray();
      //idaralli status:requested buildrequest collection inda bark,constructorid request collection inda bark..idreadu true adre matra display

      const enrichedRequestList = await Promise.all(
        requestList.map(async (request) => {
          const client = await clientCollection.findOne({
            _id: request.userId,
          });
          const buildRequest = await buildrequestCollection.findOne({
            _id: request.buildRequestId,
          });

          return {
            ...request,
            clientName: client
              ? `${client.firstname} ${client.lastname}`
              : "Unknown Client",
            ...buildRequest,
          };
        })
      );

      res.status(200).json({ requests: enrichedRequestList });
    } else if (req.method === "POST") {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const session = await sessionsCollection.findOne({
        sessionId: sessionId,
      });
      const userId = session.userId;

      const { requestId, status } = req.body;
      const obj = new ObjectId(requestId);

      let result;
      let result1;

      // Update the status in the database
      if (status === "rejected") {
        // result = await buildrequestCollection.updateOne(
        //   { _id: obj, constructorId: userId },
        //   { $set: { status } },
        // );
        // result1 = await requestsCollection.deleteOne({ constructorId: userId,buildRequestId: obj });
        result = await requestsCollection.updateOne(
          { buildRequestId: obj, constructorId: userId },
          { $set: { status: status, active: false, isread: false } }
        );
      } else {
        result = await buildrequestCollection.updateOne(
          { _id: obj },
          { $set: { status, constructorId: userId } }
        );
        result1 = await requestsCollection.updateOne(
          { buildRequestId: obj, constructorId: userId },
          { $set: { status: status, active: false, isread: false, progress:0 } }
        );
      }

      if (result.modifiedCount > 0) {
        res
          .status(200)
          .json({ message: "Request status updated successfully" });
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
