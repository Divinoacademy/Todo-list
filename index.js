const express = require("express");
const fs = require('node:fs/promises');
const Joi = require("joi");
const cors = require("cors")
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());

//Cors Option for activating cors
const corsOption = {
    origin: "*" 
};

app.use(cors(corsOption));

app.use( express.static('Frontend/Public'))

app.get('/', (req, res) => {
    res.redirect("http://localhost:8080/todo.html")
})
app.get('/api/tasks', async (req, res) => {
    try {
        
     const completedData = await readFile('./database/completed.json');
     const uncompletedData = await readFile('./database/uncompleted.json')
    let task = [...completedData, ...uncompletedData];
        
    await res.json(task);
    
    } catch( error ){
        throw error;
    }
    await res.end();
});

app.post('/api/tasks/createTask', async (req, res) => {
    try {
     const { error } = validateData(req.body);
     
     if(error) {
         
       return res.status(400).json(error.details[0].message)
       
     } else {
      
      let uncompletedData = await readFile('./database/uncompleted.json');
      let completedData = await readFile('./database/completed.json');
      const totalArr = [...uncompletedData, ...completedData];
      if (req.body.completed !== false) {
      
         return res.status(405).json("Failed request - response")
         
      } else {
          const newTask = {
              id: totalArr.length + 1,
              text: req.body.text,
              completed: req.body.completed
          }
          
          if (uncompletedData == '') {
            uncompletedData = [newTask]
          } else {
            uncompletedData.push(newTask);
          }
          
          await writeFile('./database/uncompleted.json', uncompletedData)
          
           await res.json(newTask)
      }
       }
    } catch (error) {
        throw error;
    }
    await res.end();
});

//For updating a task status, either true or false
app.put('/api/tasks/changeStatus/:id', async (req, res) => {
    if (req.body.id != req.params.id) {
        return res.json("Error: Invalid task id")
    } else {
        const { error } = validateData(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        } else {      
      let uncompletedData = await readFile('./database/uncompleted.json');
      let completedData = await readFile('./database/completed.json');
      
      const totalArr = [...uncompletedData, ...completedData];
      
      const task = totalArr.find(t => t.id == parseInt(req.body.id));
      
      if (!task) {
          return res.status(404).json("Task not Found");
      } else {
          await changeStatus(task);
          let index = totalArr.findIndex(t => t.id == task.id);
          if (index <= -1) {
              res.json("Error, task not found")
          } else {
              
          totalArr[index] = task;
          await updateDatabase(totalArr)
          
         /* let response = {
              uncompletedData: await readFile('./database/uncompleted.json'),
              completedData: await readFile('./database/completed.json'),
              totalArray: totalArr
          } */
          await res.json(task);
          
          }
      } 
        }
    }
    await res.end();
})

//For updating a task name/text
app.put('/api/tasks/changeText/:id', async (req, res) => {
    if (req.body.id != req.params.id) {
        return res.json("Error: Invalid task id")
    } else {
        const { error } = validateData(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        } else {      
      let uncompletedData = await readFile('./database/uncompleted.json');
      let completedData = await readFile('./database/completed.json');
      
      const totalArr = [...uncompletedData, ...completedData];
      
      const task = totalArr.find(t => t.id == parseInt(req.body.id));
      
      if (!task) {
          return res.status(404).json("Task not Found");
      } else {
          task.text = req.body.text;
          let index = totalArr.findIndex(t => t.id == task.id);
          if (index <= -1) {
              res.json("Error, task not found")
          } else {
              
          totalArr[index] = task;
          await updateDatabase(totalArr)
          
          /*let response = {
              uncompletedData: await readFile('./database/uncompleted.json'),
              completedData: await readFile('./database/completed.json'),
              totalArray: totalArr
          } */
          await res.json(task);
          
          }
      } 
        }
    }
    await res.end();
})

//For delete a category of status
app.delete('/api/tasks/deleteStatus/:status', async (req, res) => {
    
    if (req.body.completed != JSON.parse(req.params.status)) {
        return res.json("Error: Invalid task status")
    } else {
        const { error } = validateData(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        } else {      
      let uncompletedData = await readFile('./database/uncompleted.json');
      let completedData = await readFile('./database/completed.json');
      
      const totalArr = [...uncompletedData, ...completedData];
      
     /* const task = [];
      totalArr.forEach(obj => {
          if (obj.completed == req.body.completed) {
              task.push(obj);
          }
      });
      console.log(task)
      
      if (!task) {
          return res.status(404).send("Task not Found");
      } else {
          let index = totalArr.findIndex(t => t.id == task.id);
          if (index <= -1) {
              res.send("Error, task not found")
          } else {
              
          totalArr[index] = task;
          await updateDatabase(totalArr)
          
          await res.json(task);
          
          }
      } */
      const emptyData = '';
      if (req.body.completed == true) {
          //write an empty data into completed.json
          res.json(completedData);
          await writeFile('./database/completed.json', emptyData)
          
      } else if (req.body.completed == false) {
          // write an empty data into uncompleted.json
          res.json(uncompletedData)
         await writeFile('./database/uncompleted.json', emptyData)
      }
     await res.end();
        }
    }
})

//Function for updating the database
 async function updateDatabase (totalArray) {
      try {
          let completed = [];
          let uncompleted = [];
          
    totalArray.forEach(obj => {
        if (obj.completed == true) {
            //write it into completed.json file 
            completed.push(obj);
        } else if (obj.completed == false) {
            //write it into uncompleted.json file 
             uncompleted.push(obj);
        }
    })
    
    await writeFile('./database/completed.json', completed);
    //console.log(`completed: ${completed}`)
    await writeFile('./database/uncompleted.json', uncompleted);
    //console.log(`Uncompleted: ${uncompleted}`)
    
      } catch (error) {
          throw error;
      }
}


//Function for writing into a file
async function  writeFile(filePath, data) {
    try {
    //let arrayData = [data]
    await fs.writeFile(filePath, JSON.stringify(data))
   // await console.log('Successfully updated into the file')
    } catch (error) {
        throw error;
    }
}



//Function for changing task status
function changeStatus(task) {
    if (task.completed == true) {
       return task.completed = false
    } else if (task.completed == false) {
      return  task.completed = true
    }
}



// Function for validating a data with Joi
function validateData(data) {

    const joiSchema = {
        id: Joi.number().integer(). optional(),
        text: Joi.string().min(1).optional(),
        completed: Joi.boolean().optional()
    }
    return Joi.validate(data,
        joiSchema)
} 

// Function for reading and return data of a given file path
async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
       if (data == '') {
        return data;
       } else {
        return JSON.parse(data);
       }
    } catch ( error ) {
        throw error
    }
}

app.listen(PORT, () => console.log(`Server running on ${PORT}..`))


