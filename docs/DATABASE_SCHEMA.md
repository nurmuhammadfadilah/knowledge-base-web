# Database Schema

Dokumen ini menjelaskan struktur skema database untuk sistem **Knowledge Base Web**.  
Database menggunakan **PostgreSQL** dengan beberapa tabel utama: `categories`, `articles`, `ratings`, dan `admin_users`.

---

## 1. Tabel `categories`

| Kolom         | Tipe Data    | Keterangan                         |
| ------------- | ------------ | ---------------------------------- |
| `id`          | SERIAL (PK)  | Primary key, auto increment.       |
| `name`        | VARCHAR(255) | Nama kategori.                     |
| `description` | TEXT         | Deskripsi kategori.                |
| `created_at`  | TIMESTAMP    | Waktu pembuatan kategori.          |
| `updated_at`  | TIMESTAMP    | Waktu terakhir pembaruan kategori. |

---

## 2. Tabel `articles`

| Kolom         | Tipe Data    | Keterangan                        |
| ------------- | ------------ | --------------------------------- |
| `id`          | SERIAL (PK)  | Primary key, auto increment.      |
| `title`       | VARCHAR(255) | Judul artikel.                    |
| `content`     | TEXT         | Isi konten artikel.               |
| `image_url`   | TEXT         | URL gambar artikel.               |
| `category_id` | INT (FK)     | Relasi ke `categories.id`.        |
| `created_at`  | TIMESTAMP    | Waktu pembuatan artikel.          |
| `updated_at`  | TIMESTAMP    | Waktu terakhir pembaruan artikel. |

**Relasi:**

- **One-to-Many**: Satu kategori (`categories`) dapat memiliki banyak artikel (`articles`).

---

## 3. Tabel `ratings`

| Kolom        | Tipe Data   | Keterangan                       |
| ------------ | ----------- | -------------------------------- |
| `id`         | SERIAL (PK) | Primary key, auto increment.     |
| `article_id` | INT (FK)    | Relasi ke `articles.id`.         |
| `score`      | INT         | Nilai rating (1-5).              |
| `comment`    | TEXT        | Komentar opsional dari pengguna. |
| `created_at` | TIMESTAMP   | Waktu pembuatan rating.          |

**Relasi:**

- **One-to-Many**: Satu artikel (`articles`) dapat memiliki banyak rating (`ratings`).

---

## 4. Tabel `admin_users`

| Kolom        | Tipe Data    | Keterangan                   |
| ------------ | ------------ | ---------------------------- |
| `id`         | SERIAL (PK)  | Primary key, auto increment. |
| `username`   | VARCHAR(255) | Nama pengguna admin.         |
| `password`   | VARCHAR(255) | Password yang di-hash.       |
| `created_at` | TIMESTAMP    | Waktu pembuatan akun admin.  |

---
