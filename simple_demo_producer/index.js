const amqp = require('amqplib')
//rabbitmq connection url
const url = 'amqps://lmwdtylk:R0YjXBtnjoAOffoalBvpm0YVJSWIBmzG@fish.rmq.cloudamqp.com/lmwdtylk'

//queue name
const queue = 'node001'

async function sendMessage(msg){
        try {
            //connect to rabbitmq server
            const connection = await amqp.connect(url)
            const channel = await connection.createChannel()

            //declare the queue to use
            await channel.assertQueue(queue)
            //send the message to the queue
            await channel.sendToQueue(queue,Buffer.from(msg))

            await channel.close()
            await connection.close()
        } catch (error) {
            console.log(error)
        }
}

sendMessage("Hello rabbitMQ")