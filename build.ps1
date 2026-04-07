
param (
    [switch]$BuildProto,
    [switch]$BuildArchive
)

$ErrorActionPreference = "Stop"

# --------------------------------------------------------------------------------
# パス定義
# --------------------------------------------------------------------------------
$RootDir  = Resolve-Path .
$BufExe   = Join-Path $RootDir "third_party/buf/buf.exe"
$BuildDir   = Join-Path $RootDir "build"
$ArchiveDir = Join-Path $RootDir "archive"

# --------------------------------------------------------------------------------
# proto build（オプション）
# --------------------------------------------------------------------------------
if ($BuildProto) {
    if (-not (Test-Path $BufExe)) {
        Write-Error "buf executable not found: $BufExe"
        exit 1
    }

    Write-Host "==> Running buf generate" -ForegroundColor Cyan

    & $BufExe generate `
        --path proto/nact3dcore/v1

    Write-Host "==> buf generate completed" -ForegroundColor Green
}

