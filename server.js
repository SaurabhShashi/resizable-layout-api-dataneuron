const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Data = require('./models/ProductModel'); // Update this to the correct path and model name
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get(("/", (req, res) => {
  res.json({ message: "Server is running" });
}))

app.listen(4000, () => console.log(`Server running on port 4000`));

// Add new data
app.post('/data/add/:type', async (req, res) => {
  const { type } = req.params;
  const { content } = req.body;
  try {
      const existingData = await Data.findOne({ type });
      if (existingData) {
          existingData.operationCount.adds += 1;  // Manually increment adds
          await existingData.save();
          return res.status(200).json({ message: 'Existing data incremented', data: existingData });
      } else {
          const newData = new Data({
              type,
              content,
              operationCount: { adds: 1, updates: 0 }
          });
          await newData.save();
          res.status(201).json({ message: 'New data added', data: newData });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
});


// Update existing data
// Update existing data
// app.put('/data/update/:type', async (req, res) => {
//   const { type } = req.params;
//   const { currentContent, updatedContent } = req.body;
//   try {
//       const data = await Data.findOne({ type, content: currentContent });
//       if (!data) {
//           return res.status(404).json({ message: 'Data not found' });
//       }
//       data.content = updatedContent;
//       data.operationCount.updates++;
//       await data.save();
//       res.status(200).json({ message: 'Data updated', data });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: error.message });
//   }
// });

// Update existing data
// Update existing data
app.put('/data/update/:type', async (req, res) => {
  const { type } = req.params;
  const { currentContent, updatedContent } = req.body;
  try {
      const data = await Data.findOneAndUpdate(
          { type, content: currentContent },
          { $set: { content: updatedContent }, $inc: { 'operationCount.updates': 1 } },
          { new: true }
      );
      if (!data) {
          return res.status(404).json({ message: 'Data not found' });
      }
      res.status(200).json({ message: 'Data updated', data });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
});




// Get count of operations
app.get('/data/count', async (req, res) => {
    try {
        const counts = await Data.find({}, 'type operationCount -_id');
        res.status(200).json(counts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://saurabhshashi54:Shashi2580@cluster0.wmocqch.mongodb.net/resizable-backend?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('connected to MongoDB')
    app.listen(3000, ()=> {
        console.log(`Node API app is running on port 3000`)
    });
}).catch((error) => {
    console.log(error)
})