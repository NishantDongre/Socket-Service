const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Redis = require('ioredis');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const httpServer = createServer(app); // http-server using express app

const redisCache = new Redis(); //redis-client

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}); // Create socket.io server

io.on("connection", (socket) => {
    socket.on("client-connected-event", async ({ userIdPlusProblemId }) => {
        const clientUniqueUserIDForProblem = userIdPlusProblemId;
        const connectionId = socket.id;
        console.log("A New Client Connected: clientUniqueUserIDForProblem =", clientUniqueUserIDForProblem, " ConnectionId =", connectionId);
        redisCache.set(clientUniqueUserIDForProblem, connectionId);
    });


    socket.on('getConnectionId', async (userId) => {
        const connId = await redisCache.get(userId);
        console.log("Getting connection id for user id", userId, connId);
        socket.emit('connectionId', connId);
        const everything = await redisCache.keys('*');
        // console.log(everything)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.post('/sendCodeSubmissionResponsePayload', async (req, res) => {
    console.log("req.body: ", req.body);
    const { userId, problemId, payload } = req.body;
    if (!userId || !payload) {
        return res.status(400).json({
                success: false,
                message: "Either UserId or ProblemId is EMPTY",
                error: {},
                data: {},
            }
        );
    }
    const socketConnectionId = await redisCache.get(userId + "," + problemId);

    if (socketConnectionId) {
        io.to(socketConnectionId).emit('code-submission-response', payload);
        return res.status(200).json({
            success: true,
            message: "Code Submission Response Payload Sent Successfully",
            error: {},
            data: {},
        }
    );
    } else {
        return res.status(404).json({
            success: false,
            message: "Error while Sending the Code Submission Response Payload as socketConnectionId is EMPTY",
            error: {},
            data: {},
        }
    );
    }
})


httpServer.listen(3001, () => {
    console.log("Socket-Server is running on port 3001");
});





