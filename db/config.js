const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbConnection = async () => {

    try {
        // Esperará hasta que resuelva
        await mongoose.connect(process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB Online');

    } catch (error) {
        // Si da un error mostrará lo de debajo
        console.log(error);
        throw new Error('Error a la hora de inicializar la DB');
    }
}

module.exports = {
    dbConnection
}