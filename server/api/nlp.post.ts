import { NlpManager } from 'node-nlp';
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event)
    
    // Khởi tạo NLP Manager
    const manager = new NlpManager({ languages: ['ja'] })

    // Thêm một số câu mẫu để training
    manager.addDocument('ja', '今日はとても楽しい日でした。', 'positive')
    manager.addDocument('ja', '明日は雨が降るかもしれません。', 'weather')
    manager.addDocument('ja', '私は日本語を勉強しています。', 'study')

    // Training model
    await manager.train()

    // Phân tích văn bản
    const result = await manager.process('ja', text)
    console.log(result, text, "manager")

    return {
      tokens: result.tokens || [],
      keywords: result.keywords || [],
      sentiment: result.sentiment || {}
    }
  } catch (error) {
    console.error('NLP.js error:', error)
    throw createError({
      statusCode: 500,
      message: 'Error processing text with NLP.js'
    })
  }
}) 