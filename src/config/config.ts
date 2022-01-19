import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const CORS_CONFIG = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

const MONGO_OPTIONS = {
  useUnifiedTopology: true,
  wtimeoutMS: 30000,
  keepAlive: true,
  maxPoolSize: 50,
  autoIndex: false,
  retryWrites: false,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "tomereyal";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "tomereyal12345";
const MONGO_HOST =
  process.env.MONGO_HOST ||
  "cluster0.fkqbf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const MONGO = {
  host: MONGO_HOST,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  options: MONGO_OPTIONS,
  url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
};

const SERVER_HOSTNAME = process.env.HOSTNAME || "localhost";
const SERVER_PORT = process.env.PORT || 4000;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const CLOUDINARY_PRODUCTION_CONFIG = {
  cloud_name: "hx76lkdc6",
  api_key: "518448317563994",
  api_secret: "FayiwwH3fb8OlqWdnut7j3nzYM8",
};
const CLOUDINARY_DEVELOPMENT_CONFIG = {
  cloud_name: "dgt2lqdp3",
  api_key: "769883272961718",
  api_secret: "QHPDPLmNRYeIWIgjYBs5Si4iYrA",
};

const config = {
  cors: CORS_CONFIG,
  jwtSecret: JWT_SECRET,
  mongo: MONGO,
  server: SERVER,
  cloudinary:
    process.env.NODE_ENV === "production"
      ? CLOUDINARY_PRODUCTION_CONFIG
      : CLOUDINARY_DEVELOPMENT_CONFIG,
};

export default config;
