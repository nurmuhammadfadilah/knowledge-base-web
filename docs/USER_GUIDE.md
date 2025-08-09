# User Guide

Panduan ini menjelaskan cara menggunakan aplikasi **Knowledge Base Web** baik untuk pengguna umum maupun admin.

---

## 1. Pendahuluan

**Knowledge Base Web** adalah sistem dokumentasi solusi masalah IT yang memungkinkan pengguna mencari, membaca, dan memberikan rating pada artikel solusi. Admin dapat mengelola artikel, kategori, dan mengunggah gambar.

---

## 2. Akses Sistem

- **URL Aplikasi:** _(sesuaikan dengan alamat deployment, misalnya `http://localhost:3000` atau domain online)_
- **Pengguna Umum (User):** Tidak perlu login, dapat mencari dan membaca artikel.
- **Admin:** Harus login menggunakan akun admin untuk mengakses dashboard dan fitur manajemen.

---

## 3. Fitur untuk Pengguna Umum

### 3.1 Mencari Artikel

1. Gunakan kolom pencarian di halaman utama.
2. Ketik kata kunci (judul atau isi artikel).
3. Tekan **Enter** atau klik tombol pencarian.
4. Hasil akan menampilkan artikel yang relevan.

### 3.2 Memfilter Artikel Berdasarkan Kategori

1. Klik menu **Kategori** atau gunakan filter kategori di halaman artikel.
2. Pilih kategori yang diinginkan.
3. Artikel akan difilter sesuai kategori tersebut.

### 3.3 Membaca Artikel

1. Klik judul artikel dari daftar artikel.
2. Halaman detail artikel akan menampilkan:
   - Judul dan isi artikel
   - Gambar pendukung (jika ada)
   - Kategori artikel
   - Rating dan komentar

### 3.4 Memberikan Rating

1. Gulir ke bagian rating di halaman artikel.
2. Pilih skor (1–5 bintang).
3. Opsional: Tambahkan komentar.
4. Klik **Submit** untuk mengirim rating.

---

## 4. Fitur untuk Admin

### 4.1 Login Admin

1. Akses halaman login admin (`/login`).
2. Masukkan **username** dan **password**.
3. Klik **Login**.
4. Jika berhasil, akan diarahkan ke **Admin Dashboard**.

### 4.2 Dashboard Admin

Tampilan dashboard menampilkan ringkasan:

- Jumlah artikel
- Jumlah kategori
- Statistik rating terbaru

### 4.3 Mengelola Artikel

- **Membuat Artikel Baru**

  1. Klik menu **Manage Articles** → **Create Article**.
  2. Isi judul, isi artikel, pilih kategori, dan unggah gambar (opsional).
  3. Klik **Save**.

- **Mengedit Artikel**

  1. Klik ikon **Edit** pada artikel yang ingin diubah.
  2. Perbarui informasi yang diperlukan.
  3. Klik **Save Changes**.

- **Menghapus Artikel**
  1. Klik ikon **Delete** pada artikel yang ingin dihapus.
  2. Konfirmasi penghapusan.

### 4.4 Mengelola Kategori

- **Membuat Kategori Baru**

  1. Klik menu **Manage Categories** → **Create Category**.
  2. Isi nama kategori dan deskripsi.
  3. Klik **Save**.

- **Mengedit Kategori**

  1. Klik ikon **Edit** pada kategori.
  2. Perbarui data kategori.
  3. Klik **Save Changes**.

- **Menghapus Kategori**
  1. Klik ikon **Delete** pada kategori.
  2. Konfirmasi penghapusan.

### 4.5 Mengunggah Gambar

1. Pada form artikel, klik tombol **Upload Image**.
2. Pilih file gambar dari perangkat.
3. Tunggu hingga proses unggah selesai.
4. URL gambar akan otomatis terisi.

---
