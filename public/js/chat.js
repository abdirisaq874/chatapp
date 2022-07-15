const socket = io()
const text = document.querySelector('#message')
const input = document.querySelector('#txt')
const messages =  document.querySelector("#messages")
const message_templete =  document.querySelector("#message-templete").innerHTML
const location_templete =  document.querySelector("#location-templete").innerHTML
const sidebar_templete =  document.querySelector("#sidebar-templete").innerHTML



const {Username,Room} = Qs.parse(location.search,{ignoreQueryPrefix : true})


const AutoScroll=()=>{
    const $newMessage = messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newmessagemargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newmessagemargin

    const visibleHeight  = messages.offsetHeight

    const containerHeight = messages.scrollHeight

    const scrollOfset = messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOfset){
        messages.scrollTop = messages.scrollHeight
    }
}


input.addEventListener('click',()=>{
    input.setAttribute('disabled','disabled')

    socket.emit("message",text.value,(error)=>{
        input.removeAttribute('disabled','disabled')
        text.value = ''
        text.focus()
        if(error) {
            const html1 = Mustache.render(message_templete,{
                message : error.message,
                createdAt : error.createdAt,
                Username : error.Username
            })
            messages.insertAdjacentHTML('beforeend',html1)
            return
        }

    })
})

socket.on('send',(message)=>{
    const html = Mustache.render(message_templete,{
        createdAt :message.createdAt,
        message : message.message,
        Username : message.Username
    })
    messages.insertAdjacentHTML('beforeend',html)
    AutoScroll()
})

socket.on('join-left',(message)=>{
    const html = Mustache.render(message_templete,{
        message : message.message,
        Username : message.Username,
        createdAt : message.createdAt
    })
    messages.insertAdjacentHTML('beforeend',html)
})


socket.on('LocationMessage',(location)=>{
    const html = Mustache.render(location_templete,{
        location : location.message,
        SentAt : location.createdAt,
        Username: location.Username
    })
    messages.insertAdjacentHTML('beforeend',html)
    AutoScroll()
    
})


socket.on("RoomData",({Room,users})=>{
    const html = Mustache.render(sidebar_templete,{
        Room,
        users 
    })
    console.log(Room)
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#location').addEventListener('click',()=>{
    document.querySelector('#location').setAttribute('disabled','disabled')
    if(!navigator.geolocation) return alert("your browser doesn't support Geolocation")
    navigator.geolocation.getCurrentPosition((position)=>{
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        socket.emit("sendLocation",{latitude,longitude},()=>{
            document.querySelector('#location').removeAttribute('disabled','disabled')
            console.log("Location shared")
        })
    })
})



socket.emit('join',{Username,Room},(error)=>{
    if(error){
        location.href='/'
        alert(error)
    }
})

// socket.on('userConnected',()=>{
//     console.log("welcome boddy!!")
// })
// socket.on('CountUpdated',(count)=>{
//     console.log("count has been updated ", count)
// })

// const increment = document.querySelector('#increment');
// increment.addEventListener('click',()=>{
//     console.log("clicked")
//     socket.emit('increment',()=>{

//     })
// })