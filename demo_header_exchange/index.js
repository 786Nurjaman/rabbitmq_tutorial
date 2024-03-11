const amqp = require('amqplib')
//rabbitmq connection url
const url = 'amqps://lmwdtylk:R0YjXBtnjoAOffoalBvpm0YVJSWIBmzG@fish.rmq.cloudamqp.com/lmwdtylk'

// exchange name
const exchange = 'my_header_exchange'

//queue name
const queue = 'my_header_queue'

//message properties
const messageProp1 = {headers: {'x-match': 'all', 'color':'red', 'size': 'small'}}
const messageProp2 = {headers :{'x-match':'any', 'color':'blue', 'size':'large'}}

async function sendMessage(exchange, msg, messageProp){
    try {
        //connect to rabbitMQ server
        const connection = await amqp.connect(url)
        const channel = await connection.createChannel()

        //declare the exchange to use
        await channel.assertExchange(exchange, 'headers')

        //send the message to the exchange with the given message properties
        await channel.publish(exchange,'',Buffer.from(msg), messageProp)

        console.log(`Message sent to the exchange ${exchange}: ${msg}`)

        //close the connection to rabbitMq server
        await channel.close()
        await connection.close()
    } catch (error) {
        console.log(error)
    }
}
async function receiveMessage(exchange, queueName, headers){
        try {
            //connect to the rabbitmq server
            const connection = await amqp.connect(url)
            const channel = await connection.createChannel()

            //declare the queue to use
            await channel.assertQueue(queueName)

            //bind the queue to the exchange with the given headers
            await channel.bindQueue(queueName, exchange, '', headers)

            //receive messages from the queue
            channel.consume(queueName,(msg)=>{
                console.log(`Received message on queue ${queueName}: ${msg.content.toString()}`)

                //acknowledge receipt of the message
                channel.ack(msg)
            })
            console.log(`Waiting for messages on queue ${queueName} with headers:`, headers)
        } catch (error) {
            console.log(error)
        }
}

sendMessage(exchange, 'Message 1 with headers {color: red, size: small}', messageProp1)
sendMessage(exchange, 'Message 2 with headers {color: blue, size: large}', messageProp2)


receiveMessage(exchange, queue, messageProp1)
receiveMessage(exchange, queue, messageProp2)

