#!/usr/bin/env pwsh

# buf version
# https://github.com/bufbuild/buf/releases
$buf_version = "1.67.0"
$buf_url = "https://github.com/bufbuild/buf/releases/download/v$buf_version/buf-Windows-x86_64.exe"

# 作業フォルダ
$targetDir = "./buf"

Push-Location $PSScriptRoot
try {
    # ディレクトリの再作成
    if (Test-Path $targetDir) {
        Remove-Item $targetDir -Recurse -Force
    }
    New-Item $targetDir -ItemType Directory | Out-Null

    # ダウンロード先パス
    $downloadPath = "$targetDir/buf.exe"

    # バイナリをダウンロード
    Invoke-WebRequest -Uri $buf_url -OutFile $downloadPath

    Write-Host "buf.exe を $targetDir にダウンロードしました。"
    Write-Host "必要に応じて PATH に $targetDir を追加してください。"
} finally {
    Pop-Location
}