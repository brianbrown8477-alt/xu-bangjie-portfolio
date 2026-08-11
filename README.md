# 徐邦杰 · 2026 视觉作品集

响应式静态作品集，包含 AIGC、三维动态、电商与品牌视觉三大内容板块。

## 本地生成媒体

```powershell
& 'C:\Users\徐邦杰\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\build_media.py
```

## 本地预览

```powershell
& 'C:\Users\徐邦杰\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4173 --directory site
```

然后访问 `http://127.0.0.1:4173`。
