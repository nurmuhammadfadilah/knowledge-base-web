# Knowledge Base Web

Sebuah aplikasi **web portal** berbasis Express.js, React.js, Node.js yang digunakan untuk menyimpan dan mengelola kumpulan artikel solusi IT. Tujuannya adalah agar pengguna dapat mencari solusi secara mandiri sebelum menghubungi tim support.

## 🧩 Fitur Utama

- 🔍 Pencarian artikel berdasarkan judul dan isi
- 🗂️ Kategori masalah
- ⭐ Penilaian solusi (Rating)
- 📝 Upload artikel oleh admin

## ⚙️ Teknologi yang Digunakan

- **Frontend**: React.js (Create React App)
- **Backend**: Express.js (Node.js)
- **Database**: Supabase PostgreSQL
- **API Testing**: Postman
- **Style**: Global CSS

## 📁 Struktur Proyek

```
knowledge-base-web/
├── backend/               # Server Express.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── utils/
├── frontend/              # Frontend React.js
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── App.js
├── database/              # SQL schema dan seed
├── docs/                  # Dokumentasi teknis proyek
└── .gitignore
```

## 🚀 Cara Menjalankan Proyek

### 1. Clone Repository

```bash
git clone https://github.com/nurmuhammadfadilah/knowledge-base-web.git
cd knowledge-base-web
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

### 4. Konfigurasi

- Buat file `.env` di folder `backend/` dan isi dengan:
  ```env
  SUPABASE_URL=your_supabase_url
  SUPABASE_ANON_KEY=your_supabase_anon_key
  SUPABASE_SERVICE_KEY=your_supabase_service_key
  JWT_SECRET=your_super_secret_jwt_key
  JWT_EXPIRE=7d
  ```

## 🖼️ Fitur Tambahan

- Upload gambar ke artikel menggunakan Cloudinary
- Error handling pada proses rating
- Artikel bisa difilter berdasarkan kategori

## Status

- ✅ CRUD Artikel
- ✅ CRUD Kategori
- ✅ Submit Rating
- ✅ Upload Gambar
- ✅ Fitur Search dan Filter
