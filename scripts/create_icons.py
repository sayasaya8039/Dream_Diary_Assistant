"""
Dream Diary Assistant アイコン生成スクリプト
月と星をモチーフにしたパステル水色系のアイコン
"""

from PIL import Image, ImageDraw
import math
import os

def create_dream_icon(size: int) -> Image.Image:
    """夢日記アイコンを生成"""
    # キャンバス作成（透明背景）
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # サイズに応じたスケール
    scale = size / 128

    # 背景の円（グラデーション風）
    center = size // 2
    radius = int(58 * scale)

    # 外側の円（濃い水色）
    draw.ellipse(
        [center - radius, center - radius, center + radius, center + radius],
        fill=(56, 189, 248, 255)  # #38BDF8
    )

    # 内側の円（明るい水色グラデーション効果）
    inner_radius = int(50 * scale)
    draw.ellipse(
        [center - inner_radius, center - inner_radius,
         center + inner_radius, center + inner_radius],
        fill=(125, 211, 252, 255)  # #7DD3FC
    )

    # 月を描く（三日月）
    moon_center_x = center - int(5 * scale)
    moon_center_y = center
    moon_radius = int(35 * scale)

    # 月の本体（白）
    draw.ellipse(
        [moon_center_x - moon_radius, moon_center_y - moon_radius,
         moon_center_x + moon_radius, moon_center_y + moon_radius],
        fill=(240, 249, 255, 255)  # #F0F9FF
    )

    # 三日月の影（水色で削る）
    shadow_offset_x = int(15 * scale)
    shadow_radius = int(30 * scale)
    draw.ellipse(
        [moon_center_x + shadow_offset_x - shadow_radius,
         moon_center_y - shadow_radius,
         moon_center_x + shadow_offset_x + shadow_radius,
         moon_center_y + shadow_radius],
        fill=(125, 211, 252, 255)  # #7DD3FC
    )

    # 星を描く
    def draw_star(x: int, y: int, star_size: int, color: tuple):
        """小さな星を描く"""
        points = []
        for i in range(5):
            # 外側の頂点
            angle = math.radians(i * 72 - 90)
            px = x + int(star_size * math.cos(angle))
            py = y + int(star_size * math.sin(angle))
            points.append((px, py))
            # 内側の頂点
            angle = math.radians(i * 72 - 90 + 36)
            px = x + int(star_size * 0.4 * math.cos(angle))
            py = y + int(star_size * 0.4 * math.sin(angle))
            points.append((px, py))
        draw.polygon(points, fill=color)

    # 星を配置
    star_color = (255, 255, 255, 255)  # 白

    if size >= 48:
        # 大きな星
        draw_star(
            center + int(25 * scale),
            center - int(30 * scale),
            int(8 * scale),
            star_color
        )
        # 小さな星
        draw_star(
            center + int(35 * scale),
            center - int(10 * scale),
            int(5 * scale),
            star_color
        )
        # もう一つ小さな星
        draw_star(
            center + int(20 * scale),
            center + int(25 * scale),
            int(4 * scale),
            star_color
        )

    if size >= 128:
        # 追加の小さな星（大きいサイズのみ）
        draw_star(
            center + int(40 * scale),
            center + int(15 * scale),
            int(3 * scale),
            star_color
        )

    return img


def main():
    # 出力ディレクトリ
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
    os.makedirs(output_dir, exist_ok=True)

    # 各サイズのアイコンを生成
    sizes = [16, 48, 128]

    for size in sizes:
        icon = create_dream_icon(size)
        output_path = os.path.join(output_dir, f'icon{size}.png')
        icon.save(output_path, 'PNG')
        print(f'Created: icon{size}.png')

    print(f'\nIcons saved to: {os.path.abspath(output_dir)}')


if __name__ == '__main__':
    main()
