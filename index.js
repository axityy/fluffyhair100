const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

app.post("/verify", (req, res) => {
    const { key, hwid } = req.body;

    let data = JSON.parse(fs.readFileSync("keys.json"));

    // CHECK: key exists?
    if (!data[key]) {
        return res.json({
            success: false,
            message: "Invalid key"
        });
    }

    // If key exists but has NO HWID stored → bind it to this hwid
    if (data[key].hwid === null) {
        data[key].hwid = hwid;

        fs.writeFileSync("keys.json", JSON.stringify(data, null, 4));

        return res.json({
            success: true,
            message: "Key activated",
            hwidLocked: true
        });
    }

    // If key already has HWID stored → check if same device
    if (data[key].hwid !== hwid) {
        return res.json({
            success: false,
            message: "HWID mismatch"
        });
    }

    // HWID matches → valid
    return res.json({
        success: true,
        message: "Key valid",
        hwidLocked: true
    });
});

app.listen(10000, () => {
    console.log("License API running on port 10000");
});
