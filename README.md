# Vivien's Store — Website Katalog Pakaian

Website katalog untuk UMKM toko pakaian **Vivien's Store**. Website ini memiliki dua tampilan (view):

- **User** — melihat daftar pakaian (katalog) dan mendapatkan kontak person penjual.
- **Admin** — melakukan CRUD (Create, Read, Update, Delete) data pakaian yang ditampilkan di view user.

## Tech Stack

| Layer       | Teknologi          |
|-------------|---------------------|
| Backend     | Node.js (Express)   |
| Frontend    | Next.js (React)     |
| Database    | MongoDB Atlas       |
| Deployment  | Google Cloud Platform (GCP) |

---

## 1. Struktur Folder

Project ini menggunakan struktur **monorepo** dengan folder `backend` dan `frontend` terpisah.

```
vivien-store/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Koneksi ke MongoDB Atlas
│   │   ├── controllers/
│   │   │   ├── authController.js   # Login admin
│   │   │   └── productController.js# CRUD produk
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js   # Verifikasi JWT admin
│   │   │   └── uploadMiddleware.js # Upload gambar produk
│   │   ├── models/
│   │   │   ├── Product.js          # Schema produk
│   │   │   └── Admin.js            # Schema admin
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── productRoutes.js
│   │   ├── utils/
│   │   │   └── response.js         # Helper format response API
│   │   └── app.js                  # Setup express app
│   ├── uploads/                    # Penyimpanan gambar produk (lokal/dev)
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Entry point
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (user)/
│   │   │   │   ├── page.jsx            # Halaman katalog (home)
│   │   │   │   └── produk/[id]/page.jsx# Detail produk
│   │   │   ├── admin/
│   │   │   │   ├── login/page.jsx
│   │   │   │   ├── dashboard/page.jsx
│   │   │   │   ├── products.jsx     # List produk (admin)
│   │   │   │   ├── createProduct.jsx
│   │   │   │   └── updateProduct.jsx
│   │   │   └── layout.jsx
│   │   ├── components/
│   │   │   ├── user/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── ContactButton.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── ProductTable.jsx
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # State login admin
│   │   ├── lib/
│   │   │   └── axios.js            # Instance axios ke backend
│   │   ├── hooks/
│   │   │   └── useProducts.js
│   │   └── styles/
│   │       └── globals.css
│   ├── .env.local.example
│   ├── next.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 2. Langkah-Langkah Instalasi

### 2.1 Prasyarat

Pastikan sudah terinstall di komputer:

- [Node.js](https://nodejs.org/) versi 18 LTS atau lebih baru (termasuk npm)
- [Git](https://git-scm.com/)
- Akun [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Akun [Google Cloud Platform](https://cloud.google.com/) (untuk deployment)

Cek instalasi Node.js:

```bash
node -v
npm -v
```

### 2.2 Clone Repository

```bash
git clone https://github.com/username/vivien-store.git
cd vivien-store
```

### 2.3 Setup Database — MongoDB Atlas

1. Buat akun/login di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Buat **Cluster** baru (pilih tier gratis M0 untuk development).
3. Pada **Database Access**, buat user database baru (username & password).
4. Pada **Network Access**, tambahkan IP `0.0.0.0/0` (untuk development) agar bisa diakses dari mana saja.
5. Klik **Connect** → **Drivers** → pilih Node.js, salin **connection string**, contoh:

```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/vivien_store?retryWrites=true&w=majority
```

### 2.4 Setup Backend (Node.js + Express)

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend` berdasarkan `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vivien_store
JWT_SECRET=isi_dengan_string_rahasia
CORS_ORIGIN=http://localhost:3000
```

Install dependency utama yang dibutuhkan (jika belum ada di `package.json`):

```bash
npm install express mongoose dotenv cors jsonwebtoken bcryptjs multer
npm install --save-dev nodemon
```

Jalankan server backend (mode development):

```bash
npm run dev
```

Backend akan berjalan di `http://localhost:5000`.

### 2.5 Setup Frontend (Next.js)

Buka terminal baru, masuk ke folder frontend:

```bash
cd frontend
npm install
```

Jika folder frontend belum dibuat, inisialisasi project Next.js baru:

```bash
npx create-next-app@latest frontend
```

Buat file `.env.local` di folder `frontend` berdasarkan `.env.local.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Install dependency tambahan yang umum dipakai:

```bash
npm install axios react-hook-form zustand
```

Jalankan frontend (mode development):

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`.

### 2.6 Menjalankan Kedua Server Sekaligus

Buka dua terminal terpisah:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Akses:
- Katalog (User): `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`
- API Backend: `http://localhost:5000/api`

---

## 3. Deployment ke Google Cloud Platform (GCP)

### 3.1 Persiapan

1. Install [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install).
2. Login dan buat project baru:

```bash
gcloud auth login
gcloud projects create vivien-store-app
gcloud config set project vivien-store-app
```

3. Aktifkan billing pada project di GCP Console.

### 3.2 Deploy Backend (Cloud Run)

Aktifkan layanan yang dibutuhkan:

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

Dari folder `backend`, buat `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

Deploy ke Cloud Run:

```bash
cd backend
gcloud run deploy vivien-store-backend \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="<connection_string>",JWT_SECRET="<secret>"
```

Catat URL backend yang dihasilkan, contoh: `https://vivien-store-backend-xxxx.run.app`

### 3.3 Deploy Frontend (Cloud Run atau Firebase Hosting)

Update `NEXT_PUBLIC_API_URL` di `.env.local` frontend dengan URL backend Cloud Run di atas, lalu build:

```bash
cd frontend
npm run build
```

Deploy dengan Cloud Run (opsi termudah untuk Next.js SSR):

```bash
gcloud run deploy vivien-store-frontend \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated
```

### 3.4 Verifikasi

Buka URL frontend yang diberikan Cloud Run setelah deploy selesai, pastikan katalog produk tampil dan fitur admin (login, CRUD) berjalan normal dengan koneksi ke MongoDB Atlas.

---

## 4. Ringkasan Fitur

**View User**
- Melihat daftar/katalog pakaian
- Melihat detail produk
- Melihat kontak person penjual (WhatsApp/Instagram)

**View Admin**
- Login admin (JWT)
- Tambah produk (Create)
- Lihat daftar produk (Read)
- Edit produk (Update)
- Hapus produk (Delete)

---

## 5. Lisensi

Project ini dibuat untuk keperluan internal UMKM Vivien's Store.
