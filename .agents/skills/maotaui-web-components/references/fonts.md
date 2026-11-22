# Noto Sans SC Font Pipeline

The repository stores subsetted WOFF2 files, not the full static fonts.

## Files

- `src/fonts/NotoSansSC-{Weight}.subset.woff2`
- Weights: `Thin`, `ExtraLight`, `Light`, `Regular`, `Medium`, `SemiBold`, `Bold`, `ExtraBold`, `Black`
- `src/fonts/OFL.txt`

The subset covers ASCII, GB2312 common Simplified Chinese, punctuation, and characters currently present under MaoTaUI `website/src` and forwhis-new `src`.

## Generate the character file

```powershell
$chars = [System.Collections.Generic.HashSet[char]]::new()
for ($i = 32; $i -le 126; $i++) { [void]$chars.Add([char]$i) }

$enc = [Text.Encoding]::GetEncoding(936)
for ($lead = 0xA1; $lead -le 0xF7; $lead++) {
  for ($trail = 0xA1; $trail -le 0xFE; $trail++) {
    $char = $enc.GetString([byte[]]@($lead, $trail))
    if ($char.Length -eq 1 -and $char[0] -ne [char]0xFFFD) { [void]$chars.Add($char[0]) }
  }
}

$sources = @(
  "E:\SystemShare\Documents\MaoTaUI\website\src",
  "E:\SystemShare\Documents\forwhis-new\src"
)
foreach ($dir in $sources) {
  Get-ChildItem $dir -Recurse -File -Include *.ts,*.tsx,*.vue,*.scss,*.css | ForEach-Object {
    foreach ($ch in [IO.File]::ReadAllText($_.FullName).ToCharArray()) {
      if (-not [char]::IsControl($ch)) { [void]$chars.Add($ch) }
    }
  }
}

$ordered = [char[]]@($chars)
[Array]::Sort($ordered)
[IO.File]::WriteAllText("$env:TEMP\maotaui-chars.txt", (-join $ordered), [Text.UTF8Encoding]::new($false))
```

## Subset every weight

```powershell
$source = "E:\SystemShare\Downloads\Noto_Sans_SC\static"
$output = "E:\SystemShare\Documents\MaoTaUI\src\fonts"
$chars = "$env:TEMP\maotaui-chars.txt"
$weights = "Thin","ExtraLight","Light","Regular","Medium","SemiBold","Bold","ExtraBold","Black"

foreach ($weight in $weights) {
  uvx --from fonttools --with brotli pyftsubset `
    "$source\NotoSansSC-$weight.ttf" `
    "--output-file=$output\NotoSansSC-$weight.subset.woff2" `
    --flavor=woff2 `
    "--text-file=$chars" `
    "--layout-features=*" `
    "--name-IDs=*" `
    --name-legacy `
    "--name-languages=*" `
    --no-hinting `
    --recommended-glyphs `
    --drop-tables+=DSIG
}
```

## Validate

- Each WOFF2 should be approximately 0.9–1.1MB with this character set.
- `src/styles.css` must declare weights 100 through 900.
- `pnpm build:lib` must emit all nine WOFF2 files under `dist/fonts`.
- In a browser, confirm the `@font-face` URLs resolve to `.woff2` and all weights are available.
- Keep `OFL.txt` beside the font files.
