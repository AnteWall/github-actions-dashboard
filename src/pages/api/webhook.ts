import { NextApiRequest } from "next"
import { NextApiResponseServerIO } from "./socket"

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method === 'POST') {

        const action = (req.headers["x-github-event"] || 'unknown-event') as string
        res?.socket?.server?.io?.emit(action, req.body);

        res.status(200).json({ name: 'John Doe' })
    } else {
        console.log("HELLO GET")
        res.status(400).json({ error: 'not found' })
    }
}
