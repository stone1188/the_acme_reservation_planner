require("dotenv").config();
const express = require("express");
const { client, createTables, seed } = require("./db");
const router = require('express').Router();


const app = express();



const init = async () => {
     await client.connect();
     console.log("connected");
     await createTables();
     console.log("table created");
     await seed();
};

init();
