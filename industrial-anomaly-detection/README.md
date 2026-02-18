# Industrial Anomaly Detection Pipeline

製造業向けAI外観検査パイプライン — MVTec AD データセットを用いた異常検知システム

## 概要

本プロジェクトは、製造ラインの外観検査をAIで自動化するためのパイプラインです。
**PatchCore / PaDiM / FastFlow** の3手法を比較し、Gradioデモとして公開します。

## 技術スタック

| カテゴリ | ツール |
|----------|--------|
| 言語 | Python 3.11 |
| 画像処理 | OpenCV, Pillow |
| 深層学習 | PyTorch, torchvision |
| 異常検知 | Anomalib (PatchCore / PaDiM / FastFlow) |
| 実験管理 | MLflow |
| デモUI | Gradio |
| 環境 | Docker, CUDA 12.4 |

## ロードマップ

- **Month 1** (2/18〜3/17): 環境構築・PyTorch基礎・MVTec AD EDA
- **Month 2** (3/18〜4/14): 異常検知モデル構築・手法比較
- **Month 3** (4/15〜5/12): Gradioデモ完成・Hugging Face Spacesデプロイ

## 進捗

🚧 構築中（開始日: 2026-02-18）

---

*Author: foru1215*
