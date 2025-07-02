# Aplikasi Manajemen Relawan

Proyek ini adalah Aplikasi Manajemen Relawan yang memungkinkan administrator untuk mengelola relawan secara efektif. Aplikasi ini dibangun menggunakan TypeScript dan Express.js, memberikan cara terstruktur untuk menangani fungsi admin dan relawan.

## Fitur

- Manajemen admin: Membuat, membaca, memperbarui, dan menghapus pengguna admin.
- Manajemen relawan: Membuat, membaca, memperbarui, dan menghapus pengguna relawan.
- Endpoint API RESTful untuk operasi admin dan relawan.

## Struktur Proyek

```
volunteer-management-app
├── src
│   ├── app.ts                  # Titik masuk aplikasi
│   ├── controllers             # Berisi controller untuk menangani request
│   │   ├── adminController.ts   # Controller admin untuk mengelola pengguna admin
│   │   └── volunteerController.ts # Controller relawan untuk mengelola pengguna relawan
│   ├── models                  # Berisi model data
│   │   ├── admin.ts            # Model admin yang mendefinisikan struktur objek admin
│   │   └── volunteer.ts        # Model relawan yang mendefinisikan struktur objek relawan
│   ├── routes                  # Berisi definisi rute
│   │   ├── adminRoutes.ts      # Rute untuk operasi terkait admin
│   │   └── volunteerRoutes.ts   # Rute untuk operasi terkait relawan
│   └── types                   # Berisi tipe TypeScript
│       └── index.ts            # Definisi tipe untuk Admin dan Relawan
├── package.json                # File konfigurasi NPM
├── tsconfig.json               # File konfigurasi TypeScript
└── README.md                   # Dokumentasi proyek
```

## Instalasi

1. Clone repository:
   ```
   git clone https://github.com/yourusername/volunteer-management-app.git
   ```

2. Masuk ke direktori proyek:
   ```
   cd volunteer-management-app
   ```

3. Install dependensi:
   ```
   npm install
   ```

## Penggunaan

1. Jalankan aplikasi:
   ```
   npm start
   ```

2. Aplikasi akan berjalan di `http://localhost:3000`.

## Endpoint API

### Rute Admin

- `POST /admin` - Membuat admin baru
- `GET /admin/:id` - Mendapatkan admin berdasarkan ID
- `PUT /admin/:id` - Memperbarui admin berdasarkan ID
- `DELETE /admin/:id` - Menghapus admin berdasarkan ID

### Rute Relawan

- `POST /volunteer` - Membuat relawan baru
- `GET /volunteer/:id` - Mendapatkan relawan berdasarkan ID
- `PUT /volunteer/:id` - Memperbarui relawan berdasarkan ID
- `DELETE /volunteer/:id` - Menghapus relawan berdasarkan ID

## Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau submit pull request untuk perbaikan atau fitur baru.

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.