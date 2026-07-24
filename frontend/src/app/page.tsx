// KELAS INI AKAN NGE-HIT KE KELAS DI /app/user/page
// kelas ini tidak dihapus karena akan ribet untuk konfigurasi ulang di kelas lain yang berhubungan dengan kelas ini
import HomePage from './user/page';

export const metadata = {
  title: "Vivien's Store — Katalog Produk",
  description: "Temukan koleksi produk terbaik di Vivien's Store",
};

export default function Page() {
  return <HomePage />;
}
