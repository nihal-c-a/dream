// dream/pages/api/clientnotifications.js
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
    const sessionsCollection = database.collection("sessions");
    const requestsCollection = database.collection("requests");
    const buildrequestCollection = database.collection("buildrequest");
    const clientCollection = database.collection("constructor");

    if (req.method === "GET") {
      const sessionId = req.headers.authorization;
      if (!sessionId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });
     

      if (!session) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const userId = session.userId;
      const notificationList = await requestsCollection
        .find({ userId: userId, isread: false, active: false })
        .toArray();

      const enrichedNotificationList = await Promise.all(
        notificationList.map(async (notification) => {
          const constructor = await clientCollection.findOne({
            _id: notification.constructorId,
          });
          const buildRequest = await buildrequestCollection.findOne({
            _id: notification.buildRequestId,
          });

          return {
            ...notification,
            constructorName: constructor
              ? `${constructor.firstname} ${constructor.lastname}`
              : "Unknown Constructor",
            buildRequestName: buildRequest
              ? buildRequest.projectName
              : "Unknown BuildRequest",
          };
        })
      );

      res.status(200).json({ notifications: enrichedNotificationList });
    } else if (req.method === "POST") {
      const sessionId = req.headers.authorization;

      if (!sessionId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const session = await sessionsCollection.findOne({ sessionId });

      if (!session) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const userId = session.userId;
      const { notificationId } = req.body;

      // Update isRead field in the database
      const result = await requestsCollection.updateOne(
        { _id: new ObjectId(notificationId), userId },
        { $set: { isread: true } }
      );

      if (result.modifiedCount > 0) {
        res
          .status(200)
          .json({ message: "Notification marked as read successfully" });
      } else {
        res.status(404).json({ message: "Notification not found" });
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
