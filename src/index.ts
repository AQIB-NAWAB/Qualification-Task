import express, { Request, Response } from "express";
import CRON_JOBS from "./cron";
import { getAccessToken } from "./utils/generateToken";
import axios from "axios";
import { issueBadge } from "./badgeIssuance";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Server is running");
});

// @ts-ignore
app.post("/assign-badge", async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const access_token = await getAccessToken();

    if (!access_token) {
      return res.status(500).json({
        message: "Failed to get access token",
      });
    }

    const studentData = {
      name: name,
      email: email,
      rowIndex: -99,
      isAssigned: false,
    };

    const response = await issueBadge(studentData, access_token);

    if (response) {
      return res.status(200).json({
        message: "Badge issued successfully",
      });
    } else {
      return res.status(500).json({
        message: "Failed to issue badge",
      });
    }
  } catch (error) {
    console.error("Error issuing badge:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

CRON_JOBS();
