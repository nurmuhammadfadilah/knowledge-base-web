-- Seed data untuk sample articles
INSERT INTO articles (title, content, category_id, tags, view_count, average_rating, total_ratings) VALUES

('Cara Mengatasi Komputer Tidak Bisa Menyala', 
'Jika komputer tidak bisa menyala, ikuti langkah berikut:

1. Periksa kabel power apakah sudah terpasang dengan benar
2. Pastikan switch power supply dalam posisi ON  
3. Coba lepas dan pasang kembali RAM
4. Periksa apakah ada komponen yang longgar
5. Jika masih tidak bisa, coba reset CMOS battery

Jika semua langkah sudah dicoba namun masih bermasalah, kemungkinan ada kerusakan pada motherboard atau power supply.', 
1, ARRAY['hardware', 'troubleshooting', 'komputer'], 124, 4.2, 15),

('Mengatasi WiFi Lambat di Kantor', 
'Beberapa cara untuk mengatasi koneksi WiFi yang lambat:

1. Restart router dengan menekan tombol power selama 10 detik
2. Pindahkan posisi router ke tempat yang lebih terbuka
3. Ganti channel WiFi ke channel 1, 6, atau 11
4. Update firmware router ke versi terbaru
5. Bersihkan cache DNS dengan perintah ipconfig /flushdns

Jika masih lambat, coba hubungi provider internet untuk mengecek kecepatan dari sisi mereka.', 
3, ARRAY['wifi', 'network', 'internet'], 89, 4.0, 12),

('Setup Email Baru di Outlook', 
'Langkah mudah setup email di Microsoft Outlook:

1. Buka Outlook dan pilih File > Add Account
2. Masukkan alamat email Anda dan klik Connect
3. Masukkan password email
4. Outlook akan otomatis detect pengaturan server
5. Klik Done jika berhasil

Jika gagal otomatis, pilih manual setup dan masukkan:
- Server IMAP: imap.gmail.com (port 993)
- Server SMTP: smtp.gmail.com (port 587)
- Aktifkan SSL/TLS untuk keamanan

Untuk Gmail, pastikan sudah aktifkan "App Passwords" jika menggunakan 2FA.', 
4, ARRAY['email', 'outlook', 'setup'], 67, 4.3, 8);