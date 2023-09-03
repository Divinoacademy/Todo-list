const express = require("express");
const fs = require('node:fs/promises');
const Joi = require("joi");
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());


app.get('/api/tasks', async (req, res) => {
    try {
        
     const completedData = await readFile('./database/completed.json');
     const uncompletedData = await readFile('./database/uncompleted.json')
    let task = [...completedData, ...uncompletedData];
        
    await res.json(task);
    
    } catch( error ){
        throw error;
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
     const { error } = validateData(req.body);
     
     if(error) {
         
       return res.status(400).send(error.details[0].message)
       
     } else {
      
      let uncompletedData = await readFile('./database/uncompleted.json');
      let completedData = await readFile('./database/completed.json');
      const totalArr = [...uncompletedData, ...completedData];
     
      if (req.body.completed !== false) {
      
         return res.status(405).send("Failed request - response")
         
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
          
          await fs.writeFile('./database/uncompleted.json', JSON.stringify(uncompletedData), (err) => {
              if (err) console.log("Error in overwiting file", err)
              return console.log("Successfully written into the file")
          })
          
           await res.json(uncompletedData)
      }
       }
    } catch (error) {
        throw error;
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    
})

// Function for validating a data with Joi
function validateData(data) {

    const joiSchema = {
        id: Joi.number().integer(). optional(),
        text: Joi.string().min(3).required(),
        completed: Joi.boolean().required()
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


