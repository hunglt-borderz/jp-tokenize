import kuromoji from 'kuromoji'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event)
    
    // Khởi tạo Kuromoji tokenizer
    const tokenizer = await new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict/' }).build((err, tokenizer) => {
        if (err) reject(err)
        resolve(tokenizer)
      })
    })

    // Tokenize text
    const tokens = tokenizer.tokenize(text)
    return {
      tokens: tokens.map(t => t.surface_form)
    }
  } catch (error) {
    console.error('Kuromoji error:', error)
    throw createError({
      statusCode: 500,
      message: 'Error processing text with Kuromoji'
    })
  }
}) 