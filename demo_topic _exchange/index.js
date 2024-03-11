const amqp = require('amqplib')

//rabbitmq connection url
const url ='amqps://lmwdtylk:R0YjXBtnjoAOffoalBvpm0YVJSWIBmzG@fish.rmq.cloudamqp.com/lmwdtylk'

//exchange name
const exchange = 'my_topic_exchange'

//queue names and routing keys
const queue1 = 'my_topic_queue_1'
const queue2 = 'my_topic_queue_2'

const routingKey1 = "topic.a.*"
const routingKey2 = "topic.#"

async function sendMessage(exchange, routingKey, msg){
    try {
    //connect to rabbitmq server
    const connection = await amqp.connect(url)
    const channel = await connection.createChannel()
    
    //declare the exchange to use
    await channel.assertExchange(exchange, 'topic')

    //send the message to the exchange
    await channel.publish(exchange, routingKey, Buffer.from(msg))

    console.log(`Message sent to exchange ${exchange} with routing key ${routingKey}: ${msg}`)

    //close the coonection to the rabbitmq server
    await channel.close()
    await connection.close()
    } catch (error) {
        console.log(error)
    }
}

async function receiveMessage(exchange, queueName, routingKey){
        try {
            //connect to rabbitMQ server
            const connection = await amqp.connect(url)
            const channel = await connection.createChannel()

            //declare the queue to use
            await channel.assertQueue(queueName)

            //bind the queue to the exchange with the given routing key
            await channel.bindQueue(queueName, exchange, routingKey)

            //receive message from the queue
            channel.consume(queueName,(msg)=>{
                console.log(`Received message on queue ${queueName} with ${routingKey}: ${msg.content.toString()}`)

                //acknowledge receipt of the message
                channel.ack(msg)
            })
            console.log(`waiting for message on queue ${queueName} with routing key ${routingKey}`)
        } catch (error) {
            console.log(error)
        }
}

sendMessage(exchange, routingKey1, 'Message 1 with routing key topic.a.b')
sendMessage(exchange, routingKey2, 'Message 2 with routing key topic.x.y.z')

receiveMessage(exchange, queue1, routingKey1)
receiveMessage(exchange, queue2, routingKey2)