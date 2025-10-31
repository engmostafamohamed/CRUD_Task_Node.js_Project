import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import i18nMiddleware from "./middleware/i18n";
import morgan from "morgan";

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(cors());
app.use(helmet());
app.use(express.json());


app.use(i18nMiddleware);

if (!isProduction) {
  app.use(morgan("dev"));
}

app.use("/api", routes);

export default app;
