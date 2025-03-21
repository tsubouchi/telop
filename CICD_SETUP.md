# CI/CD設定手順

このプロジェクトでは、GitHubのmainブランチにプッシュすると自動的にVercelにデプロイされるCI/CD設定を導入しています。

## 設定手順

### 1. Vercelトークンの取得

1. [Vercel](https://vercel.com/)にログインします。
2. 右上のプロフィールアイコンをクリックし、「Settings」を選択します。
3. 左側のメニューから「Tokens」を選択します。
4. 「Create Token」ボタンをクリックします。
5. トークン名を入力し（例：「GitHub CI/CD」）、必要なスコープを選択し、「Create」をクリックします。
6. 生成されたトークンをコピーします（この画面を閉じると二度と見られないので注意してください）。

### 2. プロジェクトIDとOrg IDの取得

1. Vercelダッシュボードでプロジェクトを選択します。
2. 「Settings」タブを選択します。
3. 「General」セクションで「Project ID」をコピーします。
4. 同じページ内で「Org ID」もコピーします。

### 3. GitHubのシークレット設定

1. GitHubリポジトリのページに移動します。
2. 「Settings」タブを選択します。
3. 左側のメニューから「Secrets and variables」→「Actions」を選択します。
4. 「New repository secret」ボタンをクリックし、以下のシークレットを追加します：
   - `VERCEL_TOKEN`: 先ほどコピーしたVercelトークン
   - `VERCEL_PROJECT_ID`: プロジェクトID
   - `VERCEL_ORG_ID`: Org ID

### 4. 動作確認

1. リポジトリに変更をプッシュします。
2. GitHubの「Actions」タブで、ワークフローが正常に実行されていることを確認します。
3. デプロイが完了したら、Vercelのダッシュボードでデプロイが成功したことを確認します。

## 注意事項

- このCI/CD設定は、mainブランチへのプッシュ時にのみ実行されます。
- 他のブランチにも同様の設定を適用したい場合は、`.github/workflows/vercel-deploy.yml`ファイルの`branches`セクションを編集してください。 