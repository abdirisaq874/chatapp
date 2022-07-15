const users=[]

const addUser=({id,Username,Room})=>{
    Username = Username.trim().toLowerCase()
    Room = Room.trim().toLowerCase()

    if(!Username || !Room) return {error: "Username and Room are required"}

    const ExistingUser = users.find((user)=>{
        return user.Room === Room && user.Username === Username
    })

    if(ExistingUser) return {error : "Username is in Use"}

    const user = {id,Username,Room}
    users.push(user)
    return {user}
}

const RemoveUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index !== -1){
        user =  users.splice(index,1)[0]
        return user
    }   
}

const getUser=(id)=>{
    return users.find((user)=> user.id === id)
}

const getUsersInRoom=(Room)=>{
    return users.filter((user)=> user.Room === Room.trim().toLowerCase())
}

module.exports={
    addUser,
    RemoveUser,
    getUser,
    getUsersInRoom
}