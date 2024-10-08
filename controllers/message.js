import Conversation from "../models/conversation.js";
import User from "../models/user.js";
import Message from "../models/message.js";

export const getChatPage = async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    let conversation = await Conversation.findOne({
        participants: { $all: [currentUserId, userId] }
    });

    if (!conversation) {
        conversation = new Conversation({ participants: [currentUserId, userId] });
        await conversation.save();
    }
    const recipientUser = await User.findById(userId);
    if (!recipientUser) {
        return res.status(404).send("Recipient user not found.");
    }
    let messages = [];
    if (conversation) {
        messages = await Message.find({ conversation: conversation._id })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });
    }
    
    const token = req.cookies.token;
    res.render('../views/chat/chat.ejs', { 
        conversation, 
        currentUser: req.user, 
        recipient: recipientUser, 
        messages,
        token,
        message: null
    });
};

