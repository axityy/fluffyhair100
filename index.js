import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// TEMPORARY in-memory license store
// You will later replace this with PostgreSQL
let licenses = {
    "ABCD-1234-TEST": { hwid: null }
};

app.post("/verify", (req, res) => {
    const { key, hwid } = req.body;

    if (!licenses[key]) {
        return res.json({ success: false, message: "Invalid key" });
    }

    // First-time activation → bind HWID
    if (licenses[key].hwid === null) {
        licenses[key].hwid = hwid;
        return res.json({ success: true, message: "Key activated" });
    }

    // If HWID does not match
    if (licenses[key].hwid !== hwid) {
        return res.json({ success: false, message: "HWID mismatch" });
    }

    // All good
    return res.json({ success: true, message: "Key valid" });
});

app.listen(10000, () => {
    console.log("License API running on port 10000");
});
