/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()


/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */


/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */

let transactions = [];

function generateId() {
    return +new Date();
}

const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');
const transactionForm = document.getElementById('transactionForm');
const titleInput = document.getElementById('transactionFormTitleInput');
const amountInput = document.getElementById('transactionFormAmountInput');
const dateInput = document.getElementById('transactionFormDateInput');
const typeSelect = document.getElementById('transactionFormTypeSelect');

const balanceElement = document.querySelector('.tracker-summary__balance-amount');
const incomeElement = document.querySelector('.tracker-summary__stat-amount--income');
const expenseElement = document.querySelector('.tracker-summary__stat-amount--expense');

const searchInput = document.getElementById('searchTransactionFormTitleInput');
const searchForm = document.getElementById('searchTransactionForm');

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderTransactions() {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';

    const keyword = searchInput.value.trim().toLowerCase();
    let filteredTransactions = transactions;
    if (keyword !== '') {
        filteredTransactions = transactions.filter(function(t) {
            return t.title.toLowerCase().includes(keyword);
        });
    }

    filteredTransactions.forEach(function(transaction) {
        const card = document.createElement('div');
        card.setAttribute('data-testid', 'transactionItem');
        card.setAttribute('data-transactionid', transaction.id);

        const typeText = transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran';

        card.innerHTML = `
            <div>
                <h3 data-testid="transactionItemTitle" class="title-transaksi">${escapeHtml(transaction.title)}</h3>
                <p data-testid="transactionItemAmount">Rp ${transaction.amount.toLocaleString('id-ID')}</p>
                <p data-testid="transactionItemDate">${transaction.date}</p>
                <p data-testid="transactionItemType">${typeText}</p>
            </div>
            <div>
                <button data-testid="transactionItemEditTypeButton" class="btn-ubah">Ubah Tipe</button>
                <button data-testid="transactionItemDeleteButton" class="btn-hapus">Hapus</button>
            </div>
        `;

        card.querySelector('[data-testid="transactionItemDeleteButton"]').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteTransaction(transaction.id);
        });

        card.querySelector('[data-testid="transactionItemEditTypeButton"]').addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTransactionType(transaction.id);
        });

        if (transaction.type === 'income') {
            incomeList.appendChild(card);
        } else {
            expenseList.appendChild(card);
        }
    });
}

function updateDashboard() {
    let totalIncome = 0, totalExpense = 0;
    transactions.forEach(function(t) {
        if (t.type === 'income') totalIncome += t.amount;
        else totalExpense += t.amount;
    });
    const balance = totalIncome - totalExpense;
    incomeElement.textContent = 'Rp ' + totalIncome.toLocaleString('id-ID');
    expenseElement.textContent = 'Rp ' + totalExpense.toLocaleString('id-ID');
    balanceElement.textContent = 'Rp ' + balance.toLocaleString('id-ID');
}

function emitTransactionUpdated() {
    document.dispatchEvent(new Event('transaction:updated'));
}
document.addEventListener('transaction:updated', function() {
    renderTransactions();
    updateDashboard();
});

const STORAGE_KEY = 'tracker_transactions';
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        transactions = [];
        return;
    }
    const parsed = JSON.parse(stored);
    transactions = parsed.filter(function(t) {
        return t && typeof t.amount === 'number';
    });
    if (transactions.length !== parsed.length) saveData();
}

function deleteTransaction(id) {
    transactions = transactions.filter(function(t) { return t.id !== id; });
    saveData();
    emitTransactionUpdated();
}

function toggleTransactionType(id) {
    const transaction = transactions.find(function(t) { return t.id === id; });
    if (transaction) {
        transaction.type = transaction.type === 'income' ? 'expense' : 'income';
        saveData();
        emitTransactionUpdated();
    }
}

transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = titleInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const type = typeSelect.value;

    if (!title.trim()) {
        alert('Keterangan wajib diisi!');
        return;
    }
    if (amount < 1) {
        alert('Nominal minimal Rp 1!');
        return;
    }
    if (!date) {
        alert('Tanggal wajib diisi!');
        return;
    }

    const newTransaction = {
        id: generateId(),
        title: title.trim(),
        amount: amount,
        date: date,
        type: type
    };
    transactions.push(newTransaction);
    saveData();
    emitTransactionUpdated();

    titleInput.value = '';
    amountInput.value = '';
    dateInput.value = '';
    typeSelect.value = 'income';
});

searchInput.addEventListener('input', function() {
    renderTransactions();
    updateDashboard();
});
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    renderTransactions();
});

loadData();
renderTransactions();
updateDashboard();