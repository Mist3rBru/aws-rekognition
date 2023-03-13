import { APIGatewayEvent } from 'aws-lambda'
import { Rekognition, Translate } from 'aws-sdk'
import axios from 'axios'

export class Handler {
  constructor(
    private readonly recognition: Rekognition,
    private readonly translator: Translate
  ) {}

  async getImageBuffer(imageUrl: string) {
    const response = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data)
    return buffer
  }

  async detectImageLabels(buffer: Buffer) {
    const result = await this.recognition
      .detectLabels({
        Image: {
          Bytes: buffer
        }
      })
      .promise()
    const workingItems = result!.Labels!.filter(
      ({ Confidence }) => Confidence && Confidence > 80
    )

    const names = workingItems.map(({ Name }) => Name).join(' and ')
    return {
      names,
      workingItems
    }
  }

  async translateText(text: string) {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    }
    const { TranslatedText } = await this.translator
      .translateText(params)
      .promise()
    return TranslatedText.split(' e ')
  }

  formatTextResults(texts: string[], workingItems: Rekognition.Label[]) {
    const finalText = []
    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText]
      const confidence = workingItems[indexText].Confidence!
      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      )
    }

    return finalText.join('\n')
  }

  async main(event: APIGatewayEvent) {
    console.log('event', event)
    try {
      const imageUrl = event.queryStringParameters?.imageUrl
      if (!imageUrl) {
        return {
          statusCode: 400,
          body: 'an IMG is required!'
        }
      }
      console.log('downloading image...')
      const buffer = await this.getImageBuffer(imageUrl)
      console.log('detecting labels...')
      const { names, workingItems } = await this.detectImageLabels(buffer)

      console.log('translating to Portuguese...')
      const texts = await this.translateText(names)
      const finalText = this.formatTextResults(texts, workingItems)
      console.log('finishing...')

      return {
        statusCode: 200,
        body: `A imagem tem\n`.concat(finalText)
      }
    } catch (error) {
      console.error('DEU RUIM***', error.stack)
      return {
        statusCode: 500,
        body: 'Internal Server Error!'
      }
    }
  }
}
