# Vercelデプロイ手順

このプロジェクトをVercelにデプロイする方法を説明します。

## 手順

1. [Vercel](https://vercel.com/)にアクセスし、アカウントを作成またはログインします。

2. ダッシュボードから「New Project」ボタンをクリックします。

3. 「Import Git Repository」セクションで、GitHubアカウントと連携し、`tsubouchi/telop` リポジトリを選択します。

4. プロジェクト設定画面で以下の設定を確認します：
   - Framework Preset: `Other`
   - Build and Output Settings: デフォルト設定で問題ありません
   - Environment Variables: 必要に応じて設定（このプロジェクトでは特に必要ありません）

5. 「Deploy」ボタンをクリックしてデプロイを開始します。

## 自動デプロイ

GitHubリポジトリへのプッシュ時に自動的にデプロイが行われます。これはVercelのデフォルト設定です。

## カスタムドメインの設定（オプション）

1. デプロイ完了後、プロジェクト設定画面から「Domains」タブを選択します。

2. 「Add」ボタンをクリックし、使用したいドメインを入力します。

3. 画面の指示に従ってDNS設定を行います。 