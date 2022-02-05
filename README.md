
![image](https://miro.medium.com/max/1400/1*nYSReF3qcIeCno65XFiTaA.png)
# 音檔作業上傳及點評平台
使用 Node.js + Express 打造的音檔上傳和討論的平台，方便學員上傳作業，教學同仁管理、點評作業。

1. 作業音檔上傳平台，將音檔統一上傳至 google drive 
2. 能夠幫助教和老師快速點評作業，不須再多平台切換
3. 瀏覽所有學員，方便老師從中尋找案例
4. 幫助學員回顧過去音檔，發現自己的進步
5. 幫助檔案的管理，以利未來使用

## 專案相關資料
![image](https://miro.medium.com/max/3000/1*C9mKVeVBLKPaQliLQGg9dg.png)
1. 專案介紹 https://dream-45047.medium.com/%E6%BE%84%E6%84%8F%E8%81%B2%E9%9F%B3%E5%B9%B3%E5%8F%B0-%E5%B0%88%E6%A1%88%E4%BB%8B%E7%B4%B9-1e97b3957b77
2. 操作流程 https://dream-45047.medium.com/%E8%81%B2%E9%9F%B3%E5%B9%B3%E5%8F%B0%E6%93%8D%E4%BD%9C%E6%B5%81%E7%A8%8B-8da987a3c27c?p=8da987a3c27c
3. ER圖 https://cacoo.com/diagrams/ZvuhghjmUgdvtDXD/C3C7C
4. 線繪稿 https://cacoo.com/diagrams/nenU4sSgi7f8zyUl/978A7
## 產品功能
![image](https://miro.medium.com/max/1400/1*OzOVhZgj2F8w-PcPEfF8Mw.png)
### 音檔上傳
1. **使用者可以在首頁看到所有班級：**
    - 班級圖片、班級名稱
2. **使用者可以再點進去看每周指定作業：**
    - 作業圖片、作業名稱
3. **使用者可以在點擊作業來進入上傳音作業區，並查看作業詳細資訊：**
    - 作業名稱、作業描述、作業提交、已上傳的作業音檔
4. **使用者可以在上傳(必須為該班級成員及上傳截止日前)、收聽、刪除自己的音檔**

5. **使用者可以將已上傳音檔收聽、按讚、加入收藏清單、給予回饋**

### 使用者認證
1. **使用者可以註冊帳號，註冊的資料包括：名字、email、密碼、確認密碼**

2. **使用者也可以透過 Facebook Login 或 Google Login 直接登入**

3. **使用者的密碼經加密存入資料庫**

4. **使用者必須登入才能使用平台**

5. **使用者登出、註冊失敗、或登入失敗時，使用者都會在畫面上看到正確而清楚的系統訊息**

6. **使用者可以提交忘記密碼，輸入 Email 後，就能在信箱收到密碼重置信件，在 5 分鐘內提交新密碼即可重置**

### 個人檔案管理
1. **使用者在個人檔案頁面可以看到自已所有的資料、上傳過的音檔和參與的課程**
    - 名字、暱稱、大頭照、參與課程、自我介紹、所有音檔
2. **使用者可以點選編輯個人檔案，即可修改個人資料、帳戶資訊(Email、passwrod)**

3. **使用者可以在收藏清單看到自己收藏的音檔**

### 後台管理
1. **使用者權限為 mentor 或 admin 才能進入後台**

2. **使用者為 mentor，可以進入 瀏覽所有音檔頁面 和 未點評音檔頁面**

3. **使用者為 admin，可以進入 瀏覽所有音檔頁面 、 未點評音檔頁面 、管理所有班級、管理使用者權限**

4. **使用者在 瀏覽所有音檔頁面，可以查看音檔相關訊息、評論以及給予點評，也可以用模糊搜尋尋找特定的音檔**
    - 作業名稱、日期、群組、發布人、評論
5. **使用者在 未點評音檔作業，可以查看尚未被 mentor 或 admin 評論的作業，可以查看音檔相關訊息、評論以及給予點評**
    - 作業名稱、日期、群組、發布人、評論
6. **使用者在 管理所有班級，可以查看班級資訊，新增、編輯和刪除班級**
    - 班級名稱、班級狀態、作業管理
7. **使用者在 管理所有班級，可以點選管理作業，即可看到班級下所有的作業，並可查看作業資訊，新增、編輯和刪除作業**
    - 作業名稱、作業狀態、作業管理、上傳截止日、是否公開
8. **使用者在 管理使用者權限，可以查看所有使用者的資訊，也可用模糊搜尋找到尋找特定使用者**
    - 使用者名稱、暱稱、Email、權限
9. **使用者在 管理使用者權限，按下編輯按鈕，可以讓使用者加入或退出班級**

10. **使用者在 管理使用者權限，按下編輯按鈕，更改使用者權限**
    - user、admin、mentor
## 環境建置與需求
*   Node.js、MySQL、Redis

## 安裝與執行步驟 (installation and execution)
### 環境變數
```
SESSION_SECRET=SKIP // 隨意輸入英文數字
IMGUR_CLIENT_ID=SKIP // 須至 imgur 圖片上傳空間申請帳號

SENDGRID_USER=SKIP // 須至 sendgrid SMTP 申請帳號
SENDGRID_PASSWORD=SKIP // sendgrid SMTP 密碼

FACEBOOK_CLIENTID=SKIP // 須至 facebook 第三方登入申請帳號
FACEBOOK_CLIENTSECRET=SKIP // facebook 密碼
FACEBOOK_CALLBACK=SKIP // facebook callback 的網址

GOOGLE_CLIENT_ID=SKIP // 須至 google 第三方登入申請帳號
GOOGLE_CLIENT_SECRET=SKIP // google 密碼
GOOGLE_CALLBACK=SKIP // goggle callback 的網址

GOOGLE_API_PROJECT_ID=SKIP // 須向 google 申請專案服務型帳戶(service account)，下載 JSON 私鑰後將值依序填入
GOOGLE_API_PRIVATE_KEY_ID=SKIP
GOOGLE_API_CLIENT_EMAIL=SKIP
GOOGLE_API_CLIENT_ID=SKIP
GOOGLE_API_CERT_URL=SKIP
GOOGLE_API_PRIVATE_KEY=SKIP

GOOGLE_ROOT_FOLDER_ID=SKIP // 在 google drive 創建一個資料夾，選擇與 service account 帳號共用，將該資料夾 ID 填入
```
### 執行步驟
1. 打開你的 terminal，Clone 此專案至本機電腦
`git clone git@github.com:dream184/cmcc_forum.git`
2. 開啟終端機(Terminal)，進入存放此專案的資料夾
`cd cmcc_forum`
3. 安裝 npm 套件
`在 Terminal 輸入 npm install 指令`
4. 完成建立資料庫，並完成資料庫遷移
`在 Terminal 輸入 npx sequelize db:create`
`接著輸入 npx sequelize db:migrate`
5. 設定環境變數
`將根目錄的.env.example改成.env，並填入環境變數`
6. 建立種子資料
`npm run seed`
7. 安裝 Redis 後，並啟動 Redis Server
`在 Terminal 輸入 npm install redis 指令，接著輸入 redis-server 啟動 redis`
8. 啟動伺服器，執行 app.js 檔案
`在 Terminal 輸入 npm run dev 指令`
9. 當 terminal 出現以下字樣，表示伺服器與資料庫已啟動並成功連結
`Express is listening on http://localhost:3000`
10. 輸入 SEED_USER 帳號密碼即可登入
```
    name: 'admin'
    email: 'admin@cmcc-forum.com'
    password: '12345678'

    name: 'student'
    email: 'student@cmcc-forum.com'
    password: '12345678'

    name: 'mentor'
    email: 'mentor@cmcc-forum.com'
    password: '12345678'
```
## Contributor - 專案開發人員
* [李仕堡](https://github.com/dream184)
