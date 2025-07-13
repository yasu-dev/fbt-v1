import os
from PIL import Image, ImageDraw, ImageFont
import base64
from io import BytesIO

def create_relisting_flow_fixed_image():
    """再出品業務フローの修正箇所をハイライトした画像を作成"""
    
    print("🛠️ 再出品業務フロー修正箇所ハイライト画像を作成中...")
    
    try:
        # ベース画像作成（1400x900）
        img = Image.new('RGB', (1400, 900), (248, 250, 254))
        draw = ImageDraw.Draw(img)
        
        # ヘッダー部分
        draw.rectangle([0, 0, 1400, 70], fill=(0, 100, 210))
        draw.text((50, 25), "THE WORLD DOOR - スタッフ管理", fill=(255, 255, 255))
        
        # サイドバー
        draw.rectangle([0, 70, 250, 900], fill=(255, 255, 255))
        draw.text((20, 100), "返品処理", fill=(26, 26, 26))
        
        # メインコンテンツエリア
        draw.rectangle([250, 70, 1400, 900], fill=(248, 250, 254))
        
        # タブナビゲーション
        draw.rectangle([300, 120, 1350, 180], fill=(255, 255, 255))
        draw.text((320, 140), "返品検品    再出品業務フロー    返品理由分析", fill=(26, 26, 26))
        
        # 業務フロータイトル
        draw.rectangle([300, 200, 1350, 250], fill=(255, 255, 255))
        draw.text((320, 220), "返品商品再出品業務フロー", fill=(26, 26, 26))
        
        # ========== 修正1: ステップインジケーター（アイコン変更対応） ==========
        # 修正箇所を赤枠でハイライト
        draw.rectangle([295, 275, 1355, 375], outline=(255, 0, 0), width=3)
        draw.text((300, 258), "🔴 修正1: アイコンステータス動的変更", fill=(255, 0, 0))
        
        # ステップインジケーター背景
        draw.rectangle([300, 280, 1350, 370], fill=(255, 255, 255))
        
        # ステップ円（修正後の状態を表示）
        step_positions = [380, 570, 760, 950, 1140]
        step_titles = ['検品確認', '写真撮影', '商品更新', '価格設定', '再出品']
        step_statuses = ['completed', 'completed', 'in-progress', 'pending', 'pending']
        
        for i, (x, title, status) in enumerate(zip(step_positions, step_titles, step_statuses)):
            # ステップ円の色を状態に応じて変更
            if status == 'completed':
                circle_color = (0, 100, 210)  # 青色（完了）
            elif status == 'in-progress':
                circle_color = (0, 100, 210)  # 青色（進行中）
                # 進行中は点滅効果を表現
                draw.ellipse([x-15, 305, x+15, 335], fill=(100, 150, 255), outline=(0, 100, 210), width=2)
            else:
                circle_color = (200, 200, 200)  # グレー（待機）
            
            draw.ellipse([x-12, 308, x+12, 332], fill=circle_color)
            
            # アイコン（簡易表示）
            if status != 'pending':
                draw.text((x-3, 315), "✓", fill=(255, 255, 255))
            
            # ステップタイトル
            draw.text((x-25, 345), title, fill=(26, 26, 26))
            
            # 連結線
            if i < len(step_positions) - 1:
                next_x = step_positions[i + 1]
                line_color = (0, 100, 210) if status == 'completed' else (200, 200, 200)
                draw.line([x+12, 320, next_x-12, 320], fill=line_color, width=3)
        
        # ========== 修正2: コンテンツエリア（白画面問題修正） ==========
        draw.rectangle([295, 395, 1355, 595], outline=(255, 0, 0), width=3)
        draw.text((300, 378), "🔴 修正2: ステップコンテンツ動的表示（白画面修正）", fill=(255, 0, 0))
        
        # コンテンツカード
        draw.rectangle([300, 400, 1350, 590], fill=(255, 255, 255))
        draw.text((320, 420), "商品情報更新（ステップ3）", fill=(26, 26, 26))
        draw.text((320, 450), "商品説明:", fill=(102, 102, 102))
        draw.rectangle([320, 470, 1330, 520], fill=(248, 250, 254), outline=(200, 200, 200))
        draw.text((330, 480), "返品理由や現在の状態を踏まえた説明を入力...", fill=(102, 102, 102))
        
        # 警告メッセージ
        draw.rectangle([320, 540, 1330, 570], fill=(255, 243, 205), outline=(245, 158, 11))
        draw.text((330, 550), "⚠️ 返品理由を考慮し、より詳細な商品説明を記載することを推奨", fill=(146, 64, 14))
        
        # ========== 修正3: ナビゲーションボタン（状態管理） ==========
        draw.rectangle([295, 615, 1355, 685], outline=(255, 0, 0), width=3)
        draw.text((300, 598), "🔴 修正3: ナビゲーションボタン状態管理", fill=(255, 0, 0))
        
        # ボタンエリア
        draw.rectangle([300, 620, 1350, 680], fill=(255, 255, 255))
        
        # 戻るボタン（有効状態）
        draw.rectangle([320, 640, 390, 670], fill=(255, 255, 255), outline=(200, 200, 200))
        draw.text((340, 650), "戻る", fill=(26, 26, 26))
        
        # 次へボタン（有効状態）
        draw.rectangle([1260, 640, 1330, 670], fill=(0, 100, 210))
        draw.text((1280, 650), "次へ", fill=(255, 255, 255))
        
        # 修正内容説明テキスト
        draw.rectangle([300, 700, 1350, 850], fill=(240, 255, 240), outline=(34, 197, 94))
        draw.text((320, 720), "✅ 修正完了項目:", fill=(21, 128, 61))
        draw.text((320, 750), "• ステップ遷移時の白画面問題解決", fill=(21, 128, 61))
        draw.text((320, 770), "• アイコンステータスの動的変更（完了/進行中/待機）", fill=(21, 128, 61))
        draw.text((320, 790), "• 進行中ステップのアニメーション効果（pulse）", fill=(21, 128, 61))
        draw.text((320, 810), "• 戻る/次へボタンの適切な状態管理", fill=(21, 128, 61))
        draw.text((320, 830), "• 統一アイコンシステムの適用", fill=(21, 128, 61))
        
        # 画像保存
        img.save('highlighted_relisting_flow.png')
        print("✅ 再出品業務フロー修正ハイライト画像保存完了: highlighted_relisting_flow.png")
        
        # 画像を開く
        os.system('start highlighted_relisting_flow.png')
        
    except Exception as e:
        print(f"❌ 画像作成エラー: {e}")
    
    print("\n🎯 再出品業務フロー修正箇所ハイライト完了!")
    print("赤枠の部分が修正された機能です")

if __name__ == "__main__":
    create_relisting_flow_fixed_image() 