import mongoose from 'mongoose';

const dbConnect = async () => {
   
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Conexión a atlas db exitosa`);
    } catch (error) {
        console.error(`Error en la conexión a la base de datos ${error}`);
    }
    
}

export default dbConnect;