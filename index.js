require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const { application, request, response } = require("express");
const app = express();
app.use(express.json());

const {
    DB_USERNAME, 
    DB_PASSWORD,
    DB_HOST,
    DB_NAME
} = process.env;

/**
 * Schemas de mongo
 */
const koderSchema = new mongoose.Schema({
    name :{
        type: String,
        minlegnht: 3,
        maxlenght: 20,
        required: true
    },
    modulo :{
        type: String
    },
    edad :{
        type: Number,
        min: 18,
        max: 150
    },
    generacion :{
        type: String,
        required: true
    },
    sexo: {
        type: String,
        enum: ["f", "m", "o"]
    }

});

/**
 * Modelo 
 */
const Koder = mongoose.model("koders", koderSchema);

const URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}${DB_NAME}`;

mongoose.connect(URL)
.then(() => {
    console.log("Conectado a MongoDB");
    app.listen(8080, () => {
        console.log("Server listening...");
    });    
})
.catch((error) => {
    console.log("Error", error);
});

app.post("/koders", async (request, response) => {
    const { body } = request;
    try{
        //acceder a la DB -> Promesa
        const koder = await Koder.create(body);
        response.status(201)
        response.json({
            success: true,
            data: {
                koder
            }
        });
    }
    catch(error){
        console.log("Error", error);
        response.status(400)
        response.json({
            success: false,
            data: {
                error
            }
        });
    }    

});

/**
 * Endpoint de encontrar un koder por su ID 
 * Model.findById
 */

app.get("/koders/:id", async (request, response) => {
    const { params } = request;
    try{
        //acceder a la DB -> Promesa
        const koder = await Koder.findById(params.id);
        let data = {
            success: true,
            data: {
                koder
            }
        }
        response.status(200);
        if(!koder){
            response.status(404); 
            data.success = false;
        }        
        response.json(data);
    }
    catch(error){
        response.status(400);
        response.json({
            success: false,
            data: {
                error
            }
        });
    }   
});

app.get("/koders", async (request, response) => {
    const { query } = request;
    try{
        //acceder a la DB -> Promesa
        const koder = await Koder.find(query);
        console.log("koder", koder);
        response.status(200)
        response.json({
            success: true,
            data: {
                koder
            }
        });
    }
    catch(error){
        console.log("Error", error);    
        response.status(400);
        response.json({
            success: false,
            message: {
                error
            }
        });  
    }   
});