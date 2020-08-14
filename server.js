//DEPENDENCIES
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require("./config/connectDB.js");
const db = require("./models");

//EXPRESS APP
let app = express();

//POST REQUESTS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Host Static Files so css and js files can be retrieved
app.use(express.static(path.join(__dirname, '/public')));

//PORT
let PORT = process.env.PORT || 9090;


//==============================================ROUTES========================================================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercise.html'));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.get("/api/workouts", (req, res) => {
  db.Workout.find({}).sort({ day: -1 }).limit(1)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});



//PUT REQUESTS

app.put("/api/workouts/:id", (req, res) => {

  let urlData = req.params;
  let data = req.body;
  db.Workout.updateOne({ _id: urlData.id }, {
    $push: {
      exercises: [
        {
          "type": data.type,
          "name": data.name,
          "duration": data.duration,
          "distance": data.distance,
          "weight": data.weight,
          "reps": data.reps,
          "sets": data.sets
        }
      ]
    }
  }).then(dbUpdate => {
    res.json(dbUpdate);
  })
    .catch(err => {
      res.json(err);
    });

});


//POST REQUESTS

app.post("/api/workouts", (req, res) => {

  let data = req.body;

  db.Workout.create({
    day: new Date().setDate(new Date().getDate())
  }).then(dbUpdate => {
    res.json(dbUpdate);
  })
    .catch(err => {
      res.json(err);
    });
});




/******************************* Connect to db  ****************************/
connectDB()

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});