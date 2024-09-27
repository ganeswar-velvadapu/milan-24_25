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

    const recipient = await User.findById(userId);

    const messages = await Message.find({ conversation: conversation._id })
        .populate('sender', 'username')
        .sort({ createdAt: 1 });
        
    res.render('../views/chat/chat.ejs', { 
        conversation, 
        currentUser: req.user, 
        recipient, 
        messages 
    });
};
