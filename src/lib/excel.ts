import * as XLSX from 'xlsx';
import { Transaction, Category } from '../types';
import { format } from 'date-fns';

export const exportToExcel = (transactions: Transaction[], categories: Category[]) => {
  const data = transactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId);
    return {
      ID: t.id,
      Tanggal: format(new Date(t.date), 'yyyy-MM-dd HH:mm'),
      Kategori: category?.name || 'Tanpa Kategori',
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Jumlah: t.amount,
      Keterangan: t.description,
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
  XLSX.writeFile(wb, `Alif_CashFlow_Export_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
};

export const importFromExcel = (file: File, categories: Category[]): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const importedTransactions: Transaction[] = jsonData.map((row) => {
          const category = categories.find(c => c.name === row.Kategori) || categories[0];
          return {
            id: row.ID || crypto.randomUUID(),
            amount: parseFloat(row.Jumlah) || 0,
            type: row.Tipe === 'Pemasukan' ? 'income' : 'expense',
            categoryId: category.id,
            description: row.Keterangan || '',
            date: row.Tanggal ? new Date(row.Tanggal).toISOString() : new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };
        });

        resolve(importedTransactions);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
