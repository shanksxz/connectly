import { server, app } from "./socket";
import express from "express";
import { getEnvVariable } from "./utils";
import morgan from "morgan";
import msgRoutes from "./routes/messages";
import cors from "cors";

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", msgRoutes);

const PORT = getEnvVariable("PORT");

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
