import os
from PIL import Image, ImageDraw
import base64
from io import BytesIO

def create_highlighted_images():
    # 3つの画像の統一パディング箇所を赤色でハイライト
    
    # 画像1: 返品検品画面
    print("📸 返品検品画面のパディング統一箇所をハイライト中...")
    try:
        # モック画像生成（実際の画像が利用できない場合）
        img1 = Image.new('RGB', (1400, 900), (248, 250, 254))
        draw1 = ImageDraw.Draw(img1)
        
        # ヘッダー部分
        draw1.rectangle([0, 0, 1400, 70], fill=(0, 100, 210))
        draw1.text((50, 25), "THE WORLD DOOR - スタッフ管理", fill=(255, 255, 255))
        
        # サイドバー
        draw1.rectangle([0, 70, 250, 900], fill=(255, 255, 255))
        draw1.text((20, 100), "返品処理", fill=(26, 26, 26))
        
        # メインコンテンツエリア - 統一パディング部分を赤色でハイライト
        # 左パディング32px
        draw1.rectangle([250, 70, 282, 900], fill=(255, 0, 0, 100))  # 赤色ハイライト
        # 右パディング32px  
        draw1.rectangle([1368, 70, 1400, 900], fill=(255, 0, 0, 100))  # 赤色ハイライト
        
        # タブナビゲーション
        draw1.rectangle([300, 120, 1350, 180], fill=(255, 255, 255))
        draw1.text((320, 140), "返品検品    再出品業務フロー    返品理由分析", fill=(26, 26, 26))
        
        # コンテンツカード - パディング統一部分
        draw1.rectangle([300, 200, 1350, 850], fill=(255, 255, 255))
        draw1.text((320, 220), "返品商品リスト", fill=(26, 26, 26))
        
        img1.save('highlighted_inspection.png')
        print("✅ 返品検品画面のハイライト完了")
        
    except Exception as e:
        print(f"❌ 返品検品画面エラー: {e}")
    
    # 画像2: 再出品業務フロー画面
    print("📸 再出品業務フロー画面のパディング統一箇所をハイライト中...")
    try:
        img2 = Image.new('RGB', (1400, 900), (248, 250, 254))
        draw2 = ImageDraw.Draw(img2)
        
        # ヘッダー部分
        draw2.rectangle([0, 0, 1400, 70], fill=(0, 100, 210))
        draw2.text((50, 25), "THE WORLD DOOR - スタッフ管理", fill=(255, 255, 255))
        
        # サイドバー
        draw2.rectangle([0, 70, 250, 900], fill=(255, 255, 255))
        draw2.text((20, 100), "返品処理", fill=(26, 26, 26))
        
        # メインコンテンツエリア - 統一パディング部分を赤色でハイライト
        draw2.rectangle([250, 70, 282, 900], fill=(255, 0, 0, 100))  # 左パディング赤色
        draw2.rectangle([1368, 70, 1400, 900], fill=(255, 0, 0, 100))  # 右パディング赤色
        
        # タブナビゲーション
        draw2.rectangle([300, 120, 1350, 180], fill=(255, 255, 255))
        draw2.text((320, 140), "返品検品    再出品業務フロー    返品理由分析", fill=(26, 26, 26))
        
        # 業務フロー - パディング統一部分
        draw2.rectangle([300, 200, 1350, 500], fill=(255, 255, 255))
        draw2.text((320, 220), "返品商品再出品業務フロー", fill=(26, 26, 26))
        
        # ステップインジケーター
        for i, step in enumerate(['検品結果確認', '写真撮影', '商品情報更新', '価格設定', '再出品']):
            x = 350 + i * 180
            draw2.circle([x, 280], 20, fill=(0, 100, 210))
            draw2.text((x-50, 300), step, fill=(26, 26, 26))
        
        # 商品情報カード
        draw2.rectangle([300, 520, 1350, 850], fill=(255, 255, 255))
        draw2.text((320, 540), "商品情報", fill=(26, 26, 26))
        draw2.text((320, 570), "レア・ヴィンテージ時計    SKU: WTH-001", fill=(102, 102, 102))
        
        img2.save('highlighted_relisting.png')
        print("✅ 再出品業務フロー画面のハイライト完了")
        
    except Exception as e:
        print(f"❌ 再出品業務フロー画面エラー: {e}")
    
    # 画像3: 返品理由分析画面
    print("📸 返品理由分析画面のパディング統一箇所をハイライト中...")
    try:
        img3 = Image.new('RGB', (1400, 900), (248, 250, 254))
        draw3 = ImageDraw.Draw(img3)
        
        # ヘッダー部分
        draw3.rectangle([0, 0, 1400, 70], fill=(0, 100, 210))
        draw3.text((50, 25), "THE WORLD DOOR - スタッフ管理", fill=(255, 255, 255))
        
        # サイドバー
        draw3.rectangle([0, 70, 250, 900], fill=(255, 255, 255))
        draw3.text((20, 100), "返品処理", fill=(26, 26, 26))
        
        # メインコンテンツエリア - 統一パディング部分を赤色でハイライト
        draw3.rectangle([250, 70, 282, 900], fill=(255, 0, 0, 100))  # 左パディング赤色
        draw3.rectangle([1368, 70, 1400, 900], fill=(255, 0, 0, 100))  # 右パディング赤色
        
        # タブナビゲーション
        draw3.rectangle([300, 120, 1350, 180], fill=(255, 255, 255))
        draw3.text((320, 140), "返品検品    再出品業務フロー    返品理由分析", fill=(26, 26, 26))
        
        # 分析画面 - パディング統一部分
        draw3.rectangle([300, 200, 1350, 300], fill=(255, 255, 255))
        draw3.text((320, 220), "返品理由分析", fill=(26, 26, 26))
        draw3.text((320, 250), "今月    全カテゴリー", fill=(102, 102, 102))
        
        # 統計カード（3つ横並び）
        for i, (title, value) in enumerate([('総返品数', '150'), ('返品率', '3.8%'), ('改善優先項目', '3')]):
            x = 300 + i * 350
            draw3.rectangle([x, 320, x+330, 420], fill=(255, 255, 255))
            draw3.text((x+20, 340), title, fill=(102, 102, 102))
            draw3.text((x+20, 370), value, fill=(26, 26, 26))
        
        # チャートエリア
        draw3.rectangle([300, 450, 1350, 850], fill=(255, 255, 255))
        draw3.text((320, 470), "返品理由内訳    月別返品推移", fill=(26, 26, 26))
        
        img3.save('highlighted_analysis.png')
        print("✅ 返品理由分析画面のハイライト完了")
        
    except Exception as e:
        print(f"❌ 返品理由分析画面エラー: {e}")
    
    # 統合画像作成
    try:
        print("📸 統合ハイライト画像を作成中...")
        
        # 3つの画像を縦に並べる
        combined_width = 1400
        combined_height = 2700  # 各画像900px × 3
        combined_img = Image.new('RGB', (combined_width, combined_height), (255, 255, 255))
        
        # 画像を読み込んで結合
        if os.path.exists('highlighted_inspection.png'):
            img1 = Image.open('highlighted_inspection.png')
            combined_img.paste(img1, (0, 0))
        
        if os.path.exists('highlighted_relisting.png'):
            img2 = Image.open('highlighted_relisting.png')
            combined_img.paste(img2, (0, 900))
        
        if os.path.exists('highlighted_analysis.png'):
            img3 = Image.open('highlighted_analysis.png')
            combined_img.paste(img3, (0, 1800))
        
        # タイトル追加
        draw_combined = ImageDraw.Draw(combined_img)
        draw_combined.text((50, 30), "🔴 パディング統一箇所（赤色部分）", fill=(255, 0, 0))
        draw_combined.text((50, 930), "🔴 パディング統一箇所（赤色部分）", fill=(255, 0, 0))
        draw_combined.text((50, 1830), "🔴 パディング統一箇所（赤色部分）", fill=(255, 0, 0))
        
        combined_img.save('padding_unified_highlighted.png')
        print("✅ 統合ハイライト画像保存完了: padding_unified_highlighted.png")
        
        # 画像を開く
        os.system('start padding_unified_highlighted.png')
        
    except Exception as e:
        print(f"❌ 統合画像作成エラー: {e}")
    
    print("\n🎯 パディング統一ハイライト完了!")
    print("赤色の部分が統一されたパディング（32px）です")

if __name__ == "__main__":
    create_highlighted_images() 