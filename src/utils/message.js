const moment = require('moment')

const generateMessage = ({Username,message})=>{
    return {
        message,
        createdAt : moment().format('HH:mm'),
        Username
    }
}

module.exports={
    generateMessage
}