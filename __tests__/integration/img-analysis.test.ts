import aws from 'aws-sdk'
import { fromPartial } from '@total-typescript/mock-utils'
import router from '@/router'

const requestMock = {
  queryStringParameters: {
    imageUrl: 'https://www.doglife.com.br/site/assets/images/cao.png'
  }
}
jest.setTimeout(1e4) // 10 secs

aws.config.update({
  region: 'us-east-1'
})

describe('Image analyser', () => {
  it('should analyze successfully the image returning the results', async () => {
    const result = await router.main(fromPartial(requestMock))

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
    const result = await router.main(
      fromPartial({
        queryStringParameters: {}
      })
    )
    const expected = {
      statusCode: 400,
      body: 'an IMG is required!'
    }

    expect(result).toStrictEqual(expected)
  })

  it('should return 500 on invalid ImageURL', async () => {
    const result = await router.main(
      fromPartial({
        queryStringParameters: {
          imageUrl: 'invalid'
        }
      })
    )
    const expected = {
      statusCode: 500,
      body: 'Internal Server Error!'
    }

    expect(result).toStrictEqual(expected)
  })
})
