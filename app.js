const express = require('express');

require('dotenv').config();
const cors = require('cors');
const { checkDatabaseConnection } = require('./config/db');
const userRoutes = require('./routes/userRoute')
const courrierRoutes = require('./routes/courrierRoute')
const employeeRoutes = require('./routes/employeeRoute')
const traitementRoutes = require('./routes/traitementRoute')





const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET, POST, PUT, DELETE,PATCH"],
    allowedHeaders:["content-type", "Authorization","auth-token"]
}));

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", courrierRoutes);
app.use("/api", employeeRoutes);
app.use("/api", traitementRoutes);


checkDatabaseConnection().then(() => { 

    app.listen(process.env.PORT, () => { 
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})


