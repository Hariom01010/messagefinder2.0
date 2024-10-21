import nacl from "tweetnacl";
import dotenv from "dotenv"

dotenv.config()

export function verifyHeader(req, res, next) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");
    const body = req.rawBody;

    if(!signature || !timestamp || !body){
        res.status(400).send("Bad Request: missing signature, timestamp, or body")
    }

    console.log("Body \n", body)

    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, "hex"),
        Buffer.from(process.env.PUBLIC_KEY, "hex")
    );

    if (!isVerified) {
        return res.status(401).send("invalid request signature");
    }

    next()
}
