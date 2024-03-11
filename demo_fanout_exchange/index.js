const amqp = require('amqplib')

const url = 'amqps://lmwdtylk:R0YjXBtnjoAOffoalBvpm0YVJSWIBmzG@fish.rmq.cloudamqp.com/lmwdtylk'

//exchange name 
const exchange = "my_fanout_exchange"

//queue names
const queue1 = 'my_fanout_queue_1'
const queue2 = 'my_fanout_queue_2'

async function sendMessage(exchange, msg){
    try {
        //connect to rabbitmq server
        const connection = await amqp.connect(url)
        const channel = await connection.createChannel()

        //declare the exchange to use
        await channel.assertExchange(exchange, 'fanout')

        //send the message to the exchange
        await channel.publish(exchange,'', Buffer.from(msg))
        console.log(`Message sent to exchange ${exchange}: ${msg}`)

        //close the connection to the rabbitmq server
        await channel.close()
        await connection.close()
    } catch (error) {
        
    }
}

async function receiveMessage(queueName, exchange){
    try {
        //connect to rabbitmq server
        const connection  = await amqp.connect(url)
        const channel = await connection.createChannel()

        //declare the queue to use
        await channel.assertQueue(queueName)
        //bind the queue to the exchange
        await channel.bindQueue(queueName, exchange,'')

        channel.consume(queueName,(msg)=>{
            console.log(`Received message on queue ${queueName}: ${msg.content.toString()}`)
            //acknowledge receipt of the message
            channel.ack(msg)
        })
        console.log(`waitting for message on queue ${queueName}...!`)
    } catch (error) {
        console.log(error)
    }
}

sendMessage(exchange, "Hello world")

receiveMessage(queue1, exchange)
receiveMessage(queue2,exchange)