import fs from 'fs';
import path from 'path';
import { Groq } from 'groq-sdk';

// 从环境变量获取 API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is not set');
}

async function translateJSON(sourceJSON: any, targetLang: string) {
  const result = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `你是一个专业翻译器。请将以下JSON内容翻译成${targetLang}。
          重要提示:
          - 只翻译值，不要翻译键
          - 必须保持JSON格式
          - 不要添加任何额外说明
          - 直接返回翻译后的JSON字符串`,
      },
      {
        role: 'user',
        content: JSON.stringify(sourceJSON, null, 2),
      },
    ],
    model: 'llama3-70b-8192',
    temperature: 0.1, // 降低温度以获得更准确的翻译
    max_tokens: 4096,
  });
  if (result.choices[0].message.content) {
    try {
      let { content } = result.choices[0].message;

      // 尝试提取JSON内容
      const [jsonMatch] = content.match(/\{[\s\S]*\}/) || [];
      if (jsonMatch) {
        content = jsonMatch;
      }

      // 解析JSON
      return JSON.parse(content);
    } catch (e) {
      console.error(`解析${targetLang}的JSON失败:`, e);
      console.log('原始响应:', result.choices[0].message.content);
      throw e;
    }
  } else {
    console.error(`No content to parse for ${targetLang}`);
    throw new Error(`No content to parse for ${targetLang}`);
  }
}

async function updateTranslations() {
  try {
    // 读取中文源文件
    const cnJSON = JSON.parse(fs.readFileSync('./messages/cn.json', 'utf8'));

    // 语言映射表
    const langMap = {
      en: 'English',
      de: 'German',
      es: 'Spanish',
      fr: 'French',
      jp: 'Japanese',
      pt: 'Portuguese',
      ru: 'Russian',
      tw: 'Traditional Chinese',
    };

    // 并行处理所有翻译
    const translations = await Promise.all(
      Object.entries(langMap).map(async ([langCode, langName]) => {
        console.log(`Translating to ${langName}...`);
        try {
          const translated = await translateJSON(cnJSON, langName);
          return {
            langCode,
            content: translated,
          };
        } catch (e) {
          console.error(`Failed to translate ${langName}:`, e);
          return null;
        }
      }),
    );

    // 写入翻译文件
    translations.forEach((translation) => {
      if (!translation) return;

      const filePath = path.join('./messages', `${translation.langCode}.json`);
      fs.writeFileSync(filePath, JSON.stringify(translation.content, null, 2));
      console.log(`Updated ${translation.langCode} translation`);
    });

    console.log('All translations completed!');
  } catch (e) {
    console.error('Translation process failed:', e);
  }
}

updateTranslations();
