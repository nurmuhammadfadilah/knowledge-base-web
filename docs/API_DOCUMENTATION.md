# API Documentation

Dokumentasi ini mencakup semua endpoint yang tersedia pada backend sistem Knowledge Base Web.

---

## Articles Routes (`articles.js`)

### `GET /api/articles`

- **Description:** Mengambil daftar semua artikel.
- **Parameters:** Opsional: `search` (string), `category` (string), `page` (number)
- **Request Body:** None
- **Response:** JSON daftar artikel.

### `GET /api/articles/:id`

- **Description:** Mengambil detail artikel berdasarkan ID.
- **Parameters:** `id` (path, number)
- **Request Body:** None
- **Response:** JSON detail artikel.

### `POST /api/articles`

- **Description:** Menambahkan artikel baru.
- **Parameters:** None
- **Request Body:** `{ title, content, category_id, image_url }`
- **Response:** JSON artikel yang berhasil dibuat.

### `PUT /api/articles/:id`

- **Description:** Memperbarui artikel berdasarkan ID.
- **Parameters:** `id` (path, number)
- **Request Body:** `{ title?, content?, category_id?, image_url? }`
- **Response:** JSON artikel yang diperbarui.

### `DELETE /api/articles/:id`

- **Description:** Menghapus artikel berdasarkan ID.
- **Parameters:** `id` (path, number)
- **Request Body:** None
- **Response:** Pesan konfirmasi penghapusan.

---

## Auth Routes (`auth.js`)

### `POST /api/auth/login`

- **Description:** Login admin dan menghasilkan token autentikasi.
- **Parameters:** None
- **Request Body:** `{ username, password }`
- **Response:** JSON token autentikasi.

### `POST /api/auth/register`

- **Description:** Mendaftarkan admin baru.
- **Parameters:** None
- **Request Body:** `{ username, password }`
- **Response:** JSON data admin baru.

---

## Categories Routes (`categories.js`)

### `GET /api/categories`

- **Description:** Mengambil daftar semua kategori.
- **Parameters:** None
- **Request Body:** None
- **Response:** JSON daftar kategori.

### `POST /api/categories`

- **Description:** Menambahkan kategori baru.
- **Parameters:** None
- **Request Body:** `{ name, description }`
- **Response:** JSON kategori yang berhasil dibuat.

### `PUT /api/categories/:id`

- **Description:** Memperbarui kategori berdasarkan ID.
- **Parameters:** `id` (path, number)
- **Request Body:** `{ name?, description? }`
- **Response:** JSON kategori yang diperbarui.

### `DELETE /api/categories/:id`

- **Description:** Menghapus kategori berdasarkan ID.
- **Parameters:** `id` (path, number)
- **Request Body:** None
- **Response:** Pesan konfirmasi penghapusan.

---

## Ratings Routes (`ratings.js`)

### `GET /api/ratings/:articleId`

- **Description:** Mengambil semua rating untuk artikel tertentu.
- **Parameters:** `articleId` (path, number)
- **Request Body:** None
- **Response:** JSON daftar rating.

### `POST /api/ratings/:articleId`

- **Description:** Memberikan rating untuk artikel.
- **Parameters:** `articleId` (path, number)
- **Request Body:** `{ score, comment? }`
- **Response:** JSON rating yang berhasil ditambahkan.

---

## Upload Routes (`upload.js`)

### `POST /api/upload`

- **Description:** Mengunggah file gambar untuk artikel.
- **Parameters:** None
- **Request Body:** Form-data `{ image: file }`
- **Response:** JSON URL gambar yang berhasil diunggah.
