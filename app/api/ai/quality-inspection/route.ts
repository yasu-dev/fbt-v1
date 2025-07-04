import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

/**
 * AI画像品質判定
 */
export async function POST(request: NextRequest) {
  try {
    const user = await AuthService.getUserFromRequest(request)
    if (!user || user.role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const images = formData.getAll('images') as File[]
    const productId = formData.get('productId') as string
    const category = formData.get('category') as string

    if (!images.length || !productId || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 画像をBase64に変換（実際の実装ではS3にアップロード後、URLを使用）
    const imageDataPromises = images.map(async (image) => {
      const buffer = await image.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      return {
        name: image.name,
        mimeType: image.type,
        data: base64
      }
    })

    const imageData = await Promise.all(imageDataPromises)

    // AI品質判定の実行（実際の実装では外部AIサービスを使用）
    const qualityResults = await analyzeProductQuality(imageData, category)

    // 総合評価の計算
    const overallScore = calculateOverallScore(qualityResults)
    const qualityGrade = getQualityGrade(overallScore)
    const recommendation = getRecommendation(qualityGrade, qualityResults)

    // 判定結果
    const inspectionResult = {
      productId,
      timestamp: new Date().toISOString(),
      overallScore,
      qualityGrade,
      recommendation,
      details: qualityResults,
      aiConfidence: 0.95, // AI判定の信頼度
      requiresManualReview: overallScore < 70 || qualityResults.some(r => r.issues.length > 0)
    }

    return NextResponse.json({
      success: true,
      result: inspectionResult
    })

  } catch (error) {
    console.error('AI quality inspection error:', error)
    return NextResponse.json(
      { error: 'Failed to perform quality inspection' },
      { status: 500 }
    )
  }
}

/**
 * AI画像分析（モック実装）
 */
async function analyzeProductQuality(images: any[], category: string) {
  // 実際の実装では、OpenAI Vision API、Google Cloud Vision API、
  // Amazon Rekognition、またはカスタムモデルを使用
  
  // カテゴリ別の検査項目
  const inspectionItems = getInspectionItems(category)
  
  // 各画像の分析結果（モック）
  return images.map((image, index) => ({
    imageIndex: index,
    imageName: image.name,
    inspectedItems: inspectionItems.map(item => ({
      name: item,
      score: Math.random() * 30 + 70, // 70-100のランダムスコア
      status: Math.random() > 0.8 ? 'warning' : 'pass',
      confidence: Math.random() * 0.2 + 0.8 // 0.8-1.0の信頼度
    })),
    issues: Math.random() > 0.7 ? [
      {
        type: 'scratch',
        severity: 'minor',
        location: { x: 120, y: 200 },
        description: '軽微な擦り傷を検出'
      }
    ] : [],
    overallImageScore: Math.random() * 20 + 80
  }))
}

/**
 * カテゴリ別検査項目
 */
function getInspectionItems(category: string): string[] {
  const items: Record<string, string[]> = {
    camera_body: [
      '外装の傷・凹み',
      'レンズマウントの状態',
      'ボタン・ダイヤルの状態',
      'センサーの汚れ',
      'ファインダーの状態',
      'バッテリー室の状態'
    ],
    lens: [
      'レンズの傷・カビ',
      '絞り羽根の状態',
      'フォーカスリングの動作',
      'ズームリングの動作',
      'マウント部の状態',
      '前玉・後玉の状態'
    ],
    watch: [
      'ケースの傷・凹み',
      '文字盤の状態',
      'ガラスの傷',
      'ベルト・ブレスの状態',
      'リューズの動作',
      '裏蓋の状態'
    ],
    accessory: [
      '外観の傷・汚れ',
      '動作部分の状態',
      '付属品の完備性',
      '接続部の状態'
    ]
  }
  
  return items[category] || items.accessory
}

/**
 * 総合スコア計算
 */
function calculateOverallScore(results: any[]): number {
  const scores = results.flatMap(r => r.inspectedItems.map((i: any) => i.score))
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

/**
 * 品質グレード判定
 */
function getQualityGrade(score: number): string {
  if (score >= 95) return 'S' // 新品同様
  if (score >= 90) return 'A' // 極美品
  if (score >= 80) return 'B' // 美品
  if (score >= 70) return 'C' // 良品
  if (score >= 60) return 'D' // 並品
  return 'F' // 要確認
}

/**
 * 推奨アクション
 */
function getRecommendation(grade: string, results: any[]): {
  action: string
  reason: string
  suggestedPrice?: string
} {
  const hasIssues = results.some(r => r.issues.length > 0)
  
  switch (grade) {
    case 'S':
    case 'A':
      return {
        action: 'approve',
        reason: '優良品質のため、高価格での出品を推奨',
        suggestedPrice: 'premium'
      }
    case 'B':
      return {
        action: 'approve',
        reason: hasIssues ? '軽微な問題あり。詳細記載の上、出品可能' : '標準的な品質',
        suggestedPrice: 'standard'
      }
    case 'C':
      return {
        action: 'review',
        reason: '品質に懸念あり。追加確認を推奨',
        suggestedPrice: 'discount'
      }
    default:
      return {
        action: 'reject',
        reason: '品質基準を満たさない。再検品または返品を検討'
      }
  }
} 