import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import Message from "../models/message.js";
import User from "../models/user.js";

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) return;

        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies.token;

        if (!token) return;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            socket.join(userId);

            socket.on('joinConversation', (conversationId) => {
                socket.join(conversationId);
            });

            socket.on('sendMessage', async ({ conversationId, content }) => {
                const message = new Message({ conversation: conversationId, sender: userId, content });
                await message.save();

                const user = await User.findById(userId);

                io.to(conversationId).emit('receiveMessage', {
                    sender: user.username, 
                    content,
                    conversationId
                });
            });
        } catch (error) {
            console.error('Invalid token:', error);
        }

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
