# 別PCでの設定手順（リポジトリ名変更後）

GitHubのリポジトリ名が `shared` → `shared-auto-sync` に変更されました。  
別PCでも以下の手順でURLを更新してください。

## 手順

### 1. sharedフォルダに移動する

```powershell
cd C:\Users\【ユーザー名】\shared
```

> `【ユーザー名】` は自分のWindowsアカウント名に置き換えてください。

### 2. remote URLを更新する

```powershell
git remote set-url origin https://github.com/foru1215/shared-auto-sync.git
```

### 3. 確認する

```powershell
git remote -v
```

以下のように表示されれば成功です：

```
origin  https://github.com/foru1215/shared-auto-sync.git (fetch)
origin  https://github.com/foru1215/shared-auto-sync.git (push)
```

## 注意

- `C:\WINDOWS\system32` などのフォルダで実行すると `fatal: not a git repository` エラーが出ます
- 必ず `shared` フォルダ内で実行すること
