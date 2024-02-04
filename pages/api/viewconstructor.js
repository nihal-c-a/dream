// dream/pages/api/viewconstructor.js
import { MongoClient } from 'mongodb';

const { ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async (req, res) => {
  try {
    await client.connect();
    const database = client.db('dream');
    const constructorCollection = database.collection('constructor');
    const clientFeedbackCollection = database.collection('clientfeedback');

    if (req.method === 'GET') {
      const constructors = await constructorCollection.find().toArray();
      res.status(200).json({ constructors });
    } else if (req.method === 'POST') {
      const { constructorId } = req.body;

      const constructor = await constructorCollection.findOne({ _id: new ObjectId(constructorId) });

      if (constructor) {
        const feedback = await clientFeedbackCollection.find({ constructorId: new ObjectId(constructorId) }).toArray();
        console.log('Feedback data:', feedback);
        res.status(200).json({ constructor, feedback });
      } else {
        res.status(404).json({ message: 'Constructor not found' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await client.close();
  }
};
