# Volunteer Management App

Aplikasi manajemen volunteer untuk Pengajian Akbar Poliwangi 2024.

## Fitur Utama
- Pendaftaran volunteer secara online
- Manajemen divisi volunteer (admin)
- Dashboard admin
- Pengaturan acara
- Export data volunteer/divisi
- Responsive design (mobile friendly)

## Login Admin
- **Username:** `admin_volunteer`
- **Password:** `adminimam2025`

## Struktur Project
```
volunteer-management-app/
├── public/           # Semua file frontend (HTML, CSS, JS)
├── src/              # Source code backend (Node.js/Express)
├── package.json      # Dependency
├── firebase-key.json # (JANGAN diupload ke repo!)
├── .gitignore        # File/folder yang diabaikan git
└── ...
```

## Cara Menjalankan Lokal
1. **Install dependency:**
   ```sh
   npm install
   ```
2. **Jalankan server:**
   ```sh
   npm start
   ```
3. Buka `http://localhost:3000` di browser.

## Deploy ke Firebase Hosting
1. **Install Firebase CLI:**
   ```sh
   npm install -g firebase-tools
   ```
2. **Login Firebase:**
   ```sh
   firebase login
   ```
3. **Inisialisasi hosting (sekali saja):**
   ```sh
   firebase init hosting
   # Pilih folder: public
   # Jangan overwrite index.html
   ```
4. **Deploy:**
   ```sh
   firebase deploy
   ```

## CI/CD Otomatis (Opsional)
- Sudah terhubung ke GitHub Actions: setiap push ke branch utama akan auto-deploy ke Firebase Hosting.

## Peringatan Penting
- **JANGAN upload file rahasia seperti `firebase-key.json` ke repo publik!**
- Tambahkan ke `.gitignore` agar tidak ikut ter-commit.

---

> Dibuat untuk Pengajian Akbar Poliwangi 2024