<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Japanese Text Tokenizer Comparison</h1>
        <UBadge color="primary" variant="soft">Demo</UBadge>
      </div>
    </template>

    <div class="space-y-4">
      <UTextarea
        v-model="inputText"
        placeholder="Nhập văn bản tiếng Nhật vào đây..."
        :rows="4"
        class="w-full"
        size="lg"
      />

      <UButton
        @click="analyzeText"
        color="primary"
        size="lg"
        :loading="isLoading"
        :disabled="!inputText"
        block
      >
        Phân tích văn bản
      </UButton>

      <div v-if="error" class="mt-4">
        <UAlert
          title="Lỗi"
          :description="error"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
        />
      </div>

      <div v-if="results.length > 0" class="mt-8 space-y-6">
        <div v-for="(result, index) in results" :key="index">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon :name="getLibraryIcon(result.name)" class="text-xl" />
                <h2 class="text-xl font-semibold">{{ result.name }}</h2>
              </div>
            </template>

            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="(token, tokenIndex) in result.tokens"
                :key="tokenIndex"
                color="gray"
                variant="soft"
                size="lg"
                class="text-base"
              >
                {{ token }}
              </UBadge>
            </div>

            <template #footer>
              <div class="text-sm text-gray-500">
                Số từ: {{ result.tokens.length }}
                <template v-if="result.keywords">
                  <div class="mt-2">
                    <strong>Từ khóa:</strong>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <UBadge
                        v-for="(keyword, index) in result.keywords"
                        :key="index"
                        color="blue"
                        variant="soft"
                      >
                        {{ keyword }}
                      </UBadge>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { ref } from 'vue'
import TinySegmenter from 'tiny-segmenter'
import nlp from 'compromise'
import { LangJa } from '@nlpjs/lang-ja';

const inputText = ref('')
const results = ref([])
const isLoading = ref(false)
const error = ref('')

const getLibraryIcon = (name) => {
  const icons = {
    'Kuromoji': 'i-heroicons-code-bracket',
    'TinySegmenter': 'i-heroicons-cube',
    'Compromise': 'i-heroicons-cpu-chip',
    'NLP.js': 'i-heroicons-command-line'
  }
  return icons[name] || 'i-heroicons-document-text'
}

const analyzeText = async () => {
  if (!inputText.value) return

  isLoading.value = true
  error.value = ''
  results.value = []

  try {
    // Kuromoji (Server-side)
    try {
      const { data } = await useFetch('/api/tokenize', {
        method: 'POST',
        body: { text: inputText.value }
      })
      if (data.value) {
        results.value.push({
          name: 'Kuromoji',
          tokens: data.value.tokens
        })
      }
    } catch (error) {
      console.error('Kuromoji error:', error)
    }

    // TinySegmenter
    try {
      const segmenter = new TinySegmenter()
      const tokens = segmenter.segment(inputText.value)
      results.value.push({
        name: 'TinySegmenter',
        tokens: tokens
      })
    } catch (error) {
      console.error('TinySegmenter error:', error)
    }

    // Compromise
    try {
      const doc = nlp(inputText.value)
      const tokens = doc.terms().out('array')
      results.value.push({
        name: 'Compromise',
        tokens: tokens
      })
    } catch (error) {
      console.error('Compromise error:', error)
    }
  } catch (error) {
    error.value = 'Có lỗi xảy ra trong quá trình phân tích văn bản'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style> 