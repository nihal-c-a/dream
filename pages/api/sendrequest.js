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
    const sessionsCollection = database.collection("sessions");
    const requestsCollection = database.collection("requests");
    const buildrequestCollection = database.collection("buildrequest");

    if (req.method === "POST") {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (session) {
        const userId = session.userId;
        const { constructorId } = req.body;

        // Fetch the primary build request ObjectId for the user
        const buildRequest = await buildrequestCollection.findOne({
          userId: new ObjectId(userId),
          isPrimary: true,
        });

        // Check if the request already exists
        const existingRequest = await requestsCollection.findOne({
          userId: new ObjectId(userId),
          constructorId: new ObjectId(constructorId),
          buildRequestId: buildRequest._id,
        });

        if (existingRequest) {
          res
            .status(200)
            .json({ message: "Request already sent to this constructor" });
          return;
        }

        if (!buildRequest) {
          res
            .status(200)
            .json({ message: "No primary build request found for the user" });
          return;
        }

        const result = await requestsCollection.insertOne({
          userId: new ObjectId(userId),
          constructorId: new ObjectId(constructorId),
          buildRequestId: buildRequest._id, // Store only the ObjectId
          status: "requested",
          active: true,
        });

        const result1 = await buildrequestCollection.updateOne(
          {
            _id: new ObjectId(buildRequest._id), // Assuming _id is the unique identifier for the buildrequest
          },
          {
            $set: {
              status: "requested", // Set the status to 'requested'
            },
          }
        );

        console.log("Request sent:", result);
        console.log("Request sent:", result1);

        res.status(200).json({ message: "Request sent successfully" });
      } else {
        res.status(401).json({ message: "Unauthorized" });
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
