#!/bin/bash
# 字体子集化脚本（方案A：全站用字 + ASCII + GB2312 一级常用字）
#
# 说明：
#   - 源文件放在 scripts/fonts-source/（.ttf 格式）
#   - 输出到 public/fonts/（.woff2 格式）
#   - 字符集覆盖：全站用字 + ASCII + GB2312 一级常用字 3755 字
#   - 二级汉字自动回退到系统字体
#
# 用法:
#   bash scripts/subset-fonts.sh

set -e

FONTS_SOURCE="scripts/fonts-source"
FONTS_OUTPUT="public/fonts"
CHARS_FILE="/tmp/font_subset_chars.txt"

echo "=== 字体子集化 ==="
echo ""

# 检查依赖
if ! python3 -c "import fontTools" 2>/dev/null; then
    echo "错误: 缺少 fontTools，请先安装:"
    echo "  pip3 install fonttools brotli"
    exit 1
fi

if ! python3 -c "import brotli" 2>/dev/null; then
    echo "错误: 缺少 brotli，请先安装:"
    echo "  pip3 install brotli"
    exit 1
fi

# 检查源文件目录
if [ ! -d "$FONTS_SOURCE" ]; then
    echo "错误: 源文件目录不存在: $FONTS_SOURCE"
    echo "请将 .ttf 字体文件放入该目录"
    exit 1
fi

FONT_COUNT=$(find "$FONTS_SOURCE" -name "*.ttf" | wc -l)
if [ "$FONT_COUNT" -eq 0 ]; then
    echo "错误: $FONTS_SOURCE/ 下没有找到 .ttf 文件"
    exit 1
fi

# 生成字符集
echo "[1/2] 生成字符集..."
python3 << 'PYEOF'
import subprocess
import string

chars = set()

# 1. 全站实际用字（包括汉字、英文、数字等所有字符）
result = subprocess.run(
    ['grep', '-orh', '.', 'src/content/', 'public/'],
    capture_output=True, text=True
)
for c in result.stdout:
    code = ord(c)
    if 0x20 <= code <= 0x10FFFF and code not in (0x0A, 0x0D, 0x09):
        chars.add(c)

# 2. ASCII 全字符集（英文、数字、标点等）
for c in string.ascii_letters + string.digits + string.punctuation + string.whitespace:
    chars.add(c)

# 3. GB2312 一级常用字（3755字）
for high in range(0xB0, 0xD8):
    for low in range(0xA1, 0xFF):
        if high == 0xD7 and low > 0xF9:
            break
        try:
            chars.add(bytes([high, low]).decode('gb2312'))
        except:
            pass

result = ''.join(sorted(chars))
han_count = len(set(c for c in chars if '\u4e00' <= c <= '\u9fff'))
ascii_count = len(set(c for c in chars if ord(c) < 128))
print(f'  全站用字:     ~{han_count} 汉字')
print(f'  ASCII字符:    {ascii_count}')
print(f'  GB2312一级:   3755')
print(f'  合并去重后:   {len(chars)}')

with open('/tmp/font_subset_chars.txt', 'w', encoding='utf-8') as f:
    f.write(result)
PYEOF

# 子集化
echo ""
echo "[2/2] 子集化字体..."

mkdir -p "$FONTS_OUTPUT"

for font in "$FONTS_SOURCE"/*.ttf; do
    [ -f "$font" ] || continue

    filename=$(basename "$font" .ttf)
    output="$FONTS_OUTPUT/${filename}.woff2"

    echo "  $filename.ttf → ${filename}.woff2"

    python3 -m fontTools.subset "$font" \
        --text-file="$CHARS_FILE" \
        --output-file="$output" \
        --flavor=woff2 \
        --layout-features='*' \
        --glyph-names \
        --symbol-cmap \
        --legacy-cmap \
        --notdef-glyph \
        --notdef-outline \
        --recommended-glyphs \
        --name-IDs='*' \
        2>/dev/null

    orig_size=$(du -h "$font" | cut -f1 | tr -d ' ')
    new_size=$(du -h "$output" | cut -f1 | tr -d ' ')
    echo "    $orig_size → $new_size"
done

echo ""
echo "=== 完成 ==="
echo "输出目录: $FONTS_OUTPUT/"
ls -lh "$FONTS_OUTPUT"/
