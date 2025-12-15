import mongoose from 'mongoose';

/**
 * Funkcija za vzpostavitev povezave z MongoDB bazo
 */
const connectDB = async () => {
    try {
        // Povezava na MongoDB z uporabo connection stringa iz .env
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Uspešna povezava z bazo
        console.log('MongoDB connected');
    } catch (error) {
        // Izpis napake v primeru neuspešne povezave
        console.error('MongoDB connection error:', error.message);

        // Ustavitev aplikacije ob kritični napaki
        process.exit(1);
    }
};

export default connectDB;