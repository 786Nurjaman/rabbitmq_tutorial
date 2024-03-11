const amqp = require('amqplib')

//rabbitmq connection url
const url = 'amqps://lmwdtylk:R0YjXBtnjoAOffoalBvpm0YVJSWIBmzG@fish.rmq.cloudamqp.com/lmwdtylk'

//exchange name
const exchange = 'my_direct_exchange'

//queue names
const queue1 = 'my_direct_queue_1'
const queue2 = 'my_direct_queue_2'

//routing keys
const routingKey1 = 'info'
const routingKey2 = 'error'

async function sendMessage(exchange, routingKey, msg){
        try {
            const connection = await amqp.connect(url)
            const channel = await connection.createChannel()
            //declare the exchange to use 
            await channel.assertExchange(exchange, 'direct')
            //send the message to the exchange with the given routing key
            await channel.publish(exchange, routingKey, Buffer.from(msg))

            //close the connection to rabbitmq server
            await channel.close()
            await connection.close()

        } catch (error) {
            console.error(error)
        }
}

async function receiveMessage(queueName, exchange, routingKey){
        try {
            //connect to rabbitmq server
            const connection = await amqp.connect(url)
            const channel = await connection.createChannel()

            //declare the queue to use
            await channel.assertQueue(queueName)
            //bind the queue to the exchange with the given routing key
            await channel.bindQueue(queueName, exchange, routingKey)
            //receive message from the queue
            channel.consume(queueName,(msg)=>{
                console.log(`Received message on queue ${queueName} with routing  key ${routingKey}: ${msg.content.toString()}`)
                //acknowledge receipt of the message
                channel.ack(msg)
            })
        } catch (error) {
            console.log(error)
        }
}

sendMessage(exchange, routingKey1, 'Info message 1')
sendMessage(exchange, routingKey1, 'Info message 2')
sendMessage(exchange, routingKey2, 'Error message 1')

receiveMessage(queue1, exchange, routingKey1)
receiveMessage(queue2, exchange, routingKey2)

