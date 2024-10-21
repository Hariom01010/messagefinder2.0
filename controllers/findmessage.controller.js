import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const findmessage = async (req,res)=>{
    const {channelId, guildId, searchKeyword, limit} = req.body
    let results = []

    // checks if the req type is a slash command; type = 4 in Discord documentation
    if(req.body.type==4){
        try{
            // get all channels from the server
            const channelsResponse = await axios.get(
                `https://discord.com/api/v10/guilds/${guildId}/channels`,
                { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}`}}
            )

            const channels = channelsResponse.data

            for(const channel of channels){
                // checks if channel is a text channel; type = 0 in Discord Documentation
                if(channel.type == 0){
                    // gets all messages from a channel
                    const messageResponse = await axios.get(
                        `https://discord.com/api/v10/channels/${channel.id}/messages`,
                        { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}`}}
                    )

                    const messages = messageResponse.data
                    // console.log(`Available messages from channels ${channel.name}: `, messages)

                    // filter messages based on the search keyword and the limit given
                    const filteredMessages = messages.filter(message => {
                        // checks if the message is default and not a bot or server message; type = 0
                        console.log(message)
                        if(message.type == 0 && (!message.author.bot || message.author.bot== undefined)){
                            //get the word count of each message; /\s+/ is regex expression to split using whtiespace)
                            const wordCount =  message.content.split(/\s+/).length;
                            return message.content.includes(searchKeyword) && wordCount>=limit;
                        }

                    })

                    // console.log(`Filtered Messages for the channel ${channel.name}: \n`, filteredMessages)

                    // if any messages are there there message id and content is passed to the results
                    if(filteredMessages.length > 0){
                        for(let i = 0; i < filteredMessages.length; i++){
                            const messageLink = `https://discord.com/channels/${guildId}/${channel.id}/${filteredMessages[i].id}`
                            results.push({
                                messageId: filteredMessages[i].id,
                                messageContent: filteredMessages[i].content,
                                messageLink: messageLink
                            })
                        }
                    }
                    
 
                }
            }
            // console.log("Result: \n",results)

            if(results.length > 0){

                const resultMessage = results.map(result =>{
                    return `**Message ID**: ${result.messageId} \n**Message Content**: ${result.messageContent} \n**Message Link**: ${result.messageLink}`
                }).join("\n\n")
                
                // console.log("Result Message: \n", resultMessage)
                
                try{
                    await axios.post(
                        `https://discord.com/api/v10/channels/${channelId}/messages`,
                        {content: `${resultMessage}`},
                        {headers: {Authorization: `Bot ${process.env.DISCORD_TOKEN}`}}
                    )
                                    
                    res.json({
                        type: 4,
                        content: `Messages sent to channel ID: ${channelId}`
                    })
                }catch(error){
                    console.error('Error sending message:', error.response ? error.response.data : error.message);
                    res.status(400).send("Invalid Form Body")
                }    
            }
        }catch(error){
            console.error(error)
        }
        
    }
    
}

export default findmessage