# RTX 5080でPyTorch環境を構築する（初心者の記録）

<!--
  このファイルは作業メモ → Zenn記事への変換用下書きです。
  【】内は「あとで書く」マーク。やったらチェックを埋めてください。
-->

## はじめに

AI外観検査エンジニアを目指して、ゼロから学習を始めた32歳の記録です。
制御盤メーカーで技術営業をしていますが、Pythonはほぼ未経験です。

---

## Day 0：GitHubリポジトリを作った（2026-02-18）

### やったこと

- GitHubに `industrial-anomaly-detection` リポジトリを作成
- ローカルフォルダを作って初回pushした

### 打ったコマンド

```bash
git init
git add .
git commit -m "Initial commit: README and .gitignore"
git branch -M main
git remote add origin https://github.com/foru1215/industrial-anomaly-detection.git
git push -u origin main
```

### 詰まったこと・気づいたこと

【ここに書く：コマンド打って何か起きたこと、わからなかったことなど】

---

## Day 1：自宅PCにPyTorchをインストールした（2026-02-18 夜）

### やったこと

【ここに書く：CUDAインストール、PyTorchインストールの手順】

### 打ったコマンド

```bash
# あとでここに貼る
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124
python -c "import torch; print(torch.cuda.get_device_name(0))"
```

### 出力結果

【ここに貼る：`NVIDIA GeForce RTX 5080` みたいな文字が出るはず】

### 詰まったこと・気づいたこと

【ここに書く】

---

## まとめ

【最後に書く：3行でよい】

---

*このシリーズは「AI外観検査エンジニアへの転職」を目指す実録です。*
