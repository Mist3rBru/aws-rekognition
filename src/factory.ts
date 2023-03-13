import { Rekognition, Translate } from 'aws-sdk'
import { Handler } from './handler'

export function makeHandler() {
  const rekognition = new Rekognition()
  const translator = new Translate()

  const handler = new Handler(rekognition, translator)

  // o bind serve para assegurar que o contexto this é a instancia de handler
  return handler.main.bind(handler)
}
