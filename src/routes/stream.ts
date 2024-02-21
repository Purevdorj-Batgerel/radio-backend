import { FastifyInstance } from 'fastify'
import Radio from '../radio'

async function streamRouter(fastify: FastifyInstance) {
  fastify.get('/stream', function handler(request, reply) {
    request.raw.on('close', () => {
      // @ts-ignore
      Radio.removeResponseSink(request.sinkID)
    })
    const { id, responseSink } = Radio.makeResponseSink()
    // @ts-ignore
    request.sinkID = id
    reply.code(200).type('audio/mpeg').send(responseSink)
  })
}

export default streamRouter
