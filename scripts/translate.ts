import fs from 'fs';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';
import { Groq } from 'groq-sdk';

dotenv.config();

// 添加一行调试代码
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);

// 从环境变量获取 API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is not set');
}

// 查找新增的词条
function findNewEntries(source: any, existing: any, prefix = ''): any {
  const newEntries: any = {};

  Object.keys(source).forEach((key) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (!(key in existing)) {
      // 如果键不存在于目标文件中，添加整个子树
      newEntries[key] = source[key];
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      // 如果是对象，递归检查
      const subEntries = findNewEntries(source[key], existing[key], currentPath);
      if (Object.keys(subEntries).length > 0) {
        newEntries[key] = subEntries;
      }
    }
  });

  return newEntries;
}

// 合并翻译结果
function mergeTranslations(existing: any, newTranslations: any): any {
  const merged = { ...existing };

  Object.keys(newTranslations).forEach((key) => {
    if (typeof newTranslations[key] === 'object' && newTranslations[key] !== null) {
      merged[key] = merged[key] || {};
      merged[key] = mergeTranslations(merged[key], newTranslations[key]);
    } else {
      merged[key] = newTranslations[key];
    }
  });

  return merged;
}

async function translateJSON(sourceJSON: any, existingJSON: any, targetLang: string) {
  // 找出需要翻译的新键
  const newEntries = findNewEntries(sourceJSON, existingJSON);

  if (Object.keys(newEntries).length === 0) {
    console.log(`No new entries to translate for ${targetLang}`);
    return existingJSON;
  }

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
        content: JSON.stringify(newEntries, null, 2),
      },
    ],
    model: 'llama3-70b-8192',
    temperature: 0.1,
    max_tokens: 4096,
  });

  if (result.choices[0].message.content) {
    try {
      const { content } = result.choices[0].message;
      // 确保 JSON 格式完整
      let jsonString = content.match(/\{[\s\S]*\}/)?.[0] ?? content;
      // 检查并修复不完整的 JSON
      if (jsonString.split('{').length > jsonString.split('}').length) {
        jsonString += '}';
      }
      const translatedNewEntries = JSON.parse(jsonString);
      return mergeTranslations(existingJSON, translatedNewEntries);
    } catch (e) {
      console.error(`解析${targetLang}的JSON失败:`, e);
      console.log('原始响应:', result.choices[0].message.content);
      throw e;
    }
  } else {
    throw new Error(`No content to parse for ${targetLang}`);
  }
}

async function updateTranslations() {
  try {
    // 读取中文源文件
    const cnJSON = JSON.parse(fs.readFileSync('./messages/cn.json', 'utf8'));

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
        console.log(`检查 ${langName} 的新词条...`);
        try {
          // 读取现有翻译文件（如果存在）
          let existingTranslation = {};
          const filePath = path.join('./messages', `${langCode}.json`);

          if (fs.existsSync(filePath)) {
            existingTranslation = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          }

          // 执行增量翻译
          const translated = await translateJSON(cnJSON, existingTranslation, langName);
          return {
            langCode,
            content: translated,
          };
        } catch (e) {
          console.error(`翻译 ${langName} 失败:`, e);
          return null;
        }
      }),
    );

    // 写入翻译文件
    translations.forEach((translation) => {
      if (!translation) return;

      const filePath = path.join('./messages', `${translation.langCode}.json`);
      fs.writeFileSync(filePath, JSON.stringify(translation.content, null, 2));
      console.log(`更新了 ${translation.langCode} 翻译`);
    });

    console.log('所有翻译完成！');
  } catch (e) {
    console.error('翻译过程失败:', e);
  }
}

updateTranslations();
