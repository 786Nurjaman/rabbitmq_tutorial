const amqp = require('amqplib')
//rabbitmq connection url
const url = 'amqps://lmwdtylk:R0YjXBtnjoAOffoalBvpm0YVJSWIBmzG@fish.rmq.cloudamqp.com/lmwdtylk'

//queue name
const queue = 'node001'

async function receiveMessage(){
        try {
            //connect to rabbitmq server
            const connection = await amqp.connect(url)
            const channel = await connection.createChannel()

            //declare the queue to use
            await channel.assertQueue(queue)
            
            //receive message from the queue
            channel.consume(queue,(msg)=>{
                console.log(`Received message: ${msg.content.toString()}`)
                //acknowledge receipt of the message
                channel.ack(msg)

                console.log(`waiting for message....!!`)
            })

            // await channel.close()
            // await connection.close()
        } catch (error) {
            console.log(error)
        }
}

receiveMessage()