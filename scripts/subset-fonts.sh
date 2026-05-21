#!/bin/bash
# 字体子集化脚本
# 为每种字体生成两个文件：
#   - 字体名-subset.woff2  = 全站精确用字 + ASCII（~100KB，首屏加载）
#   - 字体名.woff2         = GB2312 一级常用字 + ASCII（~1.5MB，后台补充）
#
# 用法:
#   bash scripts/subset-fonts.sh
#
# 添加新字体:
#   1. 将 .ttf 文件放入 scripts/fonts-source/
#   2. 运行 bash scripts/subset-fonts.sh
#   3. 在 src/data/config/fonts.ts 中注册新字体

set -e

FONTS_SOURCE="scripts/fonts-source"
FONTS_OUTPUT="public/fonts"
SUBSET_CHARS="/tmp/font_subset_chars.txt"
FULL_CHARS="/tmp/font_full_chars.txt"

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

if [ ! -d "$FONTS_SOURCE" ]; then
    echo "错误: 源文件目录不存在: $FONTS_SOURCE"
    exit 1
fi

FONT_COUNT=$(find "$FONTS_SOURCE" -name "*.ttf" | wc -l)
if [ "$FONT_COUNT" -eq 0 ]; then
    echo "错误: $FONTS_SOURCE/ 下没有找到 .ttf 文件"
    exit 1
fi

# 生成两个字符集
echo "[1/2] 生成字符集..."
python3 << 'PYEOF'
import subprocess
import string

def get_gb2312_level1():
    """GB2312 一级常用字（3755字）"""
    chars = []
    for high in range(0xB0, 0xD8):
        for low in range(0xA1, 0xFF):
            if high == 0xD7 and low > 0xF9:
                break
            try:
                chars.append(bytes([high, low]).decode('gb2312'))
            except:
                pass
    return chars

def get_gb2312_level2():
    """GB2312 二级汉字（3008字）"""
    chars = []
    for high in range(0xD8, 0xF8):
        for low in range(0xA1, 0xFF):
            try:
                chars.append(bytes([high, low]).decode('gb2312'))
            except:
                pass
    return chars

# 全站用字（所有字符）
result = subprocess.run(
    ['grep', '-orh', '.', 'src/content/', 'public/'],
    capture_output=True, text=True
)
site_chars = set()
for c in result.stdout:
    code = ord(c)
    if 0x20 <= code <= 0x10FFFF and code not in (0x0A, 0x0D, 0x09):
        site_chars.add(c)

# ASCII
ascii_chars = set(string.ascii_letters + string.digits + string.punctuation + string.whitespace)

# GB2312 一级
level1 = set(get_gb2312_level1())

# 子集字符集 = 全站用字 + ASCII
subset_chars = site_chars | ascii_chars

# 完整字符集 = 子集 + GB2312 一级
full_chars = subset_chars | level1

# 输出统计
subset_han = len([c for c in subset_chars if '\u4e00' <= c <= '\u9fff'])
full_han = len([c for c in full_chars if '\u4e00' <= c <= '\u9fff'])

print(f'  全站用字:     {subset_han} 汉字')
print(f'  ASCII字符:    {len(subset_chars & ascii_chars)}')
print(f'  子集总计:     {len(subset_chars)}')
print(f'  完整总计:     {len(full_chars)}（含 GB2312 一级 {len(level1)} 字）')

with open('/tmp/font_subset_chars.txt', 'w', encoding='utf-8') as f:
    f.write(''.join(sorted(subset_chars)))

with open('/tmp/font_full_chars.txt', 'w', encoding='utf-8') as f:
    f.write(''.join(sorted(full_chars)))
PYEOF

# 子集化
echo ""
echo "[2/2] 子集化字体..."

mkdir -p "$FONTS_OUTPUT"

for font in "$FONTS_SOURCE"/*.ttf; do
    [ -f "$font" ] || continue

    filename=$(basename "$font" .ttf)
    subset_output="$FONTS_OUTPUT/${filename}-subset.woff2"
    full_output="$FONTS_OUTPUT/${filename}.woff2"

    echo "  $filename.ttf"

    # Subset 文件（全站用字 + ASCII）
    echo "    → ${filename}-subset.woff2"
    python3 -m fontTools.subset "$font" \
        --text-file="$SUBSET_CHARS" \
        --output-file="$subset_output" \
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

    # Full 文件（GB2312 一级 + ASCII）
    echo "    → ${filename}.woff2"
    python3 -m fontTools.subset "$font" \
        --text-file="$FULL_CHARS" \
        --output-file="$full_output" \
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

    subset_size=$(du -h "$subset_output" | cut -f1 | tr -d ' ')
    full_size=$(du -h "$full_output" | cut -f1 | tr -d ' ')
    echo "      subset: $subset_size | full: $full_size"
done

echo ""
echo "=== 完成 ==="
echo "输出目录: $FONTS_OUTPUT/"
ls -lh "$FONTS_OUTPUT"/
echo ""
echo "使用说明:"
echo "  1. 在 src/data/config/fonts.ts 中注册字体（如未注册）"
echo "  2. 构建后 subset 文件会自动 preload，full 文件后台加载"
