import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / ISP DNS resolvers failing SRV lookups (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore in environments where setting DNS servers is restricted
}

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ip-rbisms';

  // Log which DB we're connecting to (mask password)
  const maskedURI = MONGO_URI.replace(/:([^:@]+)@/, ':****@');
  console.log(`🔌 Connecting to MongoDB: ${maskedURI}`);

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30s for Atlas cold start
      socketTimeoutMS: 60000,          // 60s socket timeout
      connectTimeoutMS: 30000,         // 30s initial connection
      maxPoolSize: 10,                 // Atlas free tier limit
      minPoolSize: 2,
      family: 4,                       // Force IPv4
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (error: any) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.error('💡 Check: 1) MONGO_URI in .env  2) Atlas IP whitelist (add 0.0.0.0/0)  3) DB user credentials');
    process.exit(1); // Exit so the process manager can restart
  }
};

export default connectDB;
