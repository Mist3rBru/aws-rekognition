const { describe, it, expect } = require('@jest/globals')
jest.setTimeout(1e4) // 10 secs

const aws = require('aws-sdk')
aws.config.update({
  region: 'us-east-1'
})

const requestMock = require('./../mocks/request.json')
const { main } = require('../../src')

describe('Image analyser', () => {
  it('should analyze successfully the image returning the results', async () => {
    const result = await main(requestMock)

    const finalText = [
      '99.68% de ser do tipo Golden Retriever',
      '99.68% de ser do tipo cão',
      '99.68% de ser do tipo animal de estimação',
      '99.68% de ser do tipo animal',
      '99.68% de ser do tipo canino',
      '99.68% de ser do tipo mamífero'
    ].join('\n')
    const expected = {
      statusCode: 200,
      body: `A imagem tem\n`.concat(finalText)
    }
    expect(result).toStrictEqual(expected)
  })

  it('should return status 400 on empty queryString', async () => {
    const result = await main({
      queryStringParameters: {}
    })
    const expected = {
      statusCode: 400,
      body: 'an IMG is required!'
    }

    expect(result).toStrictEqual(expected)
  })

  it('should return 500 on invalid ImageURL', async () => {
    const result = await main({
      queryStringParameters: {
        imageUrl: 'invalid'
      }
    })
    const expected = {
      statusCode: 500,
      body: 'Internal Server Error!'
    }

    expect(result).toStrictEqual(expected)
  })
})

