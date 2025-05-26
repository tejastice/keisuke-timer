# GitHub CLI コマンド集

## 認証
```bash
# GitHubにログイン
gh auth login

# 認証状態を確認
gh auth status
```

## リポジトリ作成
```bash
# 現在のディレクトリでリポジトリを作成
gh repo create keisuke-timer --public --source=. --remote=origin --push

# オプション説明：
# --public: 公開リポジトリ（--privateで非公開）
# --source=.: 現在のディレクトリをソースとして使用
# --remote=origin: リモート名をoriginに設定
# --push: 作成後に自動的にプッシュ
```

## その他の便利なコマンド
```bash
# リポジトリ一覧
gh repo list

# リポジトリをブラウザで開く
gh repo view --web

# Issue作成
gh issue create

# Pull Request作成
gh pr create

# リポジトリのクローン
gh repo clone owner/repo
```

## 今回のタイマーアプリ用コマンド
```bash
cd /Users/keisukeohno/Dropbox/xPersonal/project/mp0059_program/20250527_keisuke_sample/timer_app
gh repo create keisuke-timer --public --source=. --remote=origin --push --description "けいすけと一緒に時間管理！かわいいタイマーアプリ"
```