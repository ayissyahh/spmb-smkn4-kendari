
const BACKEND_URL = 'https://spmb-smkn4-kendari-production.up.railway.app';

const chatBox    = document.getElementById('chat-box');
const userInput  = document.getElementById('user-input');
const sendBtn    = document.getElementById('send-btn');
const clearBtn   = document.getElementById('clear-btn');
const quickBtns  = document.querySelectorAll('.quick-btn');

let conversationHistory = [];

const TOPIK_DIIZINKAN = [
    'spmb','daftar','pendaftaran','syarat','dokumen','berkas','ijazah',
    'rapor','raport','akta','kk','kartu keluarga','foto','prestasi',
    'buta warna','tes','seleksi','nilai','jurusan','program','keahlian',
    'kriya','tekstil','kayu','desain','komunikasi visual','dkv',
    'komputer','jaringan','tkj','broadcasting','perfilman',
    'perangkat lunak','rpl','smkn','smk negeri 4','kendari',
    'jadwal','pengumuman','daftar ulang','kursi kosong','pls','oksb',
    'afirmasi','prestasi','mutasi','perpindahan','zonasi','domisili',
    'biaya','gratis','online','offline','verifikasi','wundumbatu',
    'poasia','jl kijang','085255930144','spmb.sultraprov',
    'tka','ntka','semester','rapor','lulusan','smp','mts','ijazah',
    'pip','pkh','dtks','disabilitas','tidak mampu','ekonomi',
    'jalur','kuota','rombel','rombongan belajar','daya tampung',
    'juara','poin','point','lomba','kejuaraan','medali','sertifikat',
    'internasional','nasional','provinsi','kabupaten','kota','tingkat',
    'lolos','langsung diterima','otomatis','nilai akhir','akumulasi',
    'piagam','akademik','nonakademik','beregu','kelompok','individu',
    'sains','teknologi','riset','inovasi','robotik','olimpiade',
    'puisi','seni','budaya','tari','lukis','bahasa','pidato','debat',
    'olahraga','renang','atletik','karate','silat','futsal','voli',
    'basket','badminton','bulu tangkis','catur','sepak bola',
    'tahfiz','tahfidz','hafiz','kitab suci','keagamaan',
    'pramuka','kepramukaan','osis','organisasi','ketua',
    'kapan','dimana','bagaimana','apa','berapa','siapa',
    'halo','hai','hello','selamat','pagi','siang','sore','malam',
    'terima kasih','makasih','thanks','oke','ok','baik','map','map merah','map biru','map kuning','warna map','map pendaftaran',
    // Juknis SPMB Sultra 2026 — seleksi & pendaftaran SMK
    'juknis','petunjuk teknis','spmb 2026','2026/2027',
    'nilai rapor','nilai raport','rata-rata rapor','lima semester','5 semester',
    'nilai tka','tes kemampuan akademik','nilai kejuaraan',
    'rumus','hitung nilai','perhitungan nilai','surat keterangan peringkat','peringkat',
    'bahasa indonesia','matematika','bahasa inggris','ipa',
    'tes bakat','bakat','minat','tes bakat dan minat','seleksi khusus',
    'dunia usaha','dunia industri','dudi','asosiasi profesi',
    'kompetensi keahlian','pilihan jurusan','pilihan kedua','dua pilihan','2 pilihan',
    'surat keterangan dokter','surat dokter','keterangan sehat','tes buta warna',
    'legalisir','dilegalisir','skl','surat keterangan lulus','akta kelahiran',
    'batas usia','usia maksimal','21 tahun',
    'bdt','basis data terpadu','dtsen','kip','bpnt','kartu indonesia pintar',
    'keluarga tidak mampu','15 persen','10 persen',
    'domisili terdekat','jarak rumah','jarak sekolah',
    'pondok pesantren','pesantren','emis','panti asuhan',
    'surat pernyataan','komitmen orang tua',
    'verifikasi berkas','bukti pendaftaran','cetak bukti','unggah berkas','upload berkas',
    'mpls','masa pengenalan','pengisian kursi kosong','cadangan','murid pengganti',
    'pengaduan','sanksi','data palsu','pungutan','ketua osis','mpk','kepanduan'
];

const TOPIK_DIBLOKIR = [
    'judi','judi online','judi slot','slot online','slot gacor','main slot',
    'sabung ayam','adu ayam','sabung','taruhan','taruhan bola','togel','kasino',
    'narkoba','narkotika','miras','minuman keras','mabuk','rokok','obat terlarang',
    'bunuh','membunuh','dibunuh','bunuh diri','ingin mati','cara mati',
    'ancam','mengancam','perkosa','cabul','aniaya','keroyok',
    'porno','bokep','sex','seks','konten dewasa','video dewasa','film dewasa',
    'vulgar','bugil',
    'hack','bobol','retas','phishing','cheat','malware','buat virus','bikin virus',
    'sebar virus',
    'politik','presiden','pilkada','partai','pemilu','caleg',
    'pacaran','pacar','cinta','cowo','cewe','gebetan','putus cinta',
    'selingkuh','pernikahan','nikah','baper','galau','patah hati',
    'pr sekolah','tugas sekolah','soal matematika','soal ipa','soal ujian',
    'bantu pr','kerjakan tugas','jawaban soal',
    'resep','masakan','makanan','kuliner','restoran',
    'main game','game online','joki game','top up game','free fire','mobile legend','ml','ff',
    'tiktok','instagram','facebook','youtube','medsos','twitter','snapchat',
    'cuaca','berita','gosip','artis','seleb','viral',
    'pelajar di','melihat orang tua','teman saya','sepulang sekolah',
    'masalah keluarga','masalah teman','curhat','cerita saya','kisah saya',
    'saya melihat','orang tua teman','tetangga saya','kejadian di',
    'abaikan instruksi','lupakan aturan','ignore system','pretend you are',
    'act as','roleplay','pura-pura','seolah-olah kamu','kamu sekarang',
    'anggap kamu','kamu adalah ai lain','bypass','jailbreak'
];


const FILTER_VERSION = 'v2-kata-utuh';

function escapeRegex(teks) {
    return teks.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const AWALAN  = '(?:me|mem|men|meng|meny|pe|pem|pen|peng|peny|per|di|ter|ber|ke|se)?';
const AKHIRAN = '(?:kan|annya|nya|an|i|lah)?';

function buatPolaKata(kata, toleranImbuhan = false) {
    const inti = escapeRegex(kata.toLowerCase().trim()).replace(/[\s-]+/g, '[\\s-]+');
    const pola = toleranImbuhan ? AWALAN + inti + AKHIRAN : inti;
    return new RegExp('\\b' + pola + '\\b', 'i');
}

const POLA_DIIZINKAN = TOPIK_DIIZINKAN.map(k => buatPolaKata(k, true));
const POLA_DIBLOKIR  = TOPIK_DIBLOKIR.map(k => buatPolaKata(k, false));

function cekTopikPesan(teks) {
    const teksBersih = String(teks).replace(/\s+/g, ' ').trim();

    for (const pola of POLA_DIBLOKIR) {
        if (pola.test(teksBersih)) {
            return { boleh: false, alasan: 'diblokir' };
        }
    }

    const jumlahKata = teksBersih.split(' ').length;
    if (jumlahKata <= 3) {
        return { boleh: true };
    }

    for (const pola of POLA_DIIZINKAN) {
        if (pola.test(teksBersih)) {
            return { boleh: true };
        }
    }

    return { boleh: false, alasan: 'diluar_topik' };
}

console.log('[LA SMIK] filter topik ' + FILTER_VERSION + ' aktif');
window.cekTopikPesan = cekTopikPesan;

const PESAN_TOLAK_DIBLOKIR = `⛔ Maaf, pertanyaan tersebut tidak dapat saya layani.\n\nSaya hanya bisa membantu informasi seputar **SPMB SMKN 4 Kendari 2026/2027**.\n\nSilakan tanyakan hal-hal terkait pendaftaran, syarat, jadwal, atau jurusan yang tersedia. 😊`;

const PESAN_TOLAK_DILUAR = `Maaf, pertanyaan Anda di luar topik yang bisa saya bantu. 🙏\n\nSaya adalah asisten khusus **SPMB SMKN 4 Kendari**. Saya siap menjawab pertanyaan seputar:\n- 📋 Syarat & dokumen pendaftaran\n- 📅 Jadwal SPMB (pendaftaran 22 Juni – 1 Juli 2026)\n- 🏫 Program keahlian (boleh pilih 2 dalam 1 sekolah)\n- 🎯 Seleksi: nilai rapor + TKA, prestasi, tes bakat & minat\n\nAda yang ingin ditanyakan tentang pendaftaran?`;

sendBtn.addEventListener('click', handleSend);

userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

userInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});

clearBtn.addEventListener('click', function () {
    if (confirm('Hapus semua riwayat percakapan?')) {
        clearChat();
    }
});

quickBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const question = this.getAttribute('data-question');
        userInput.value = question;
        handleSend();
    });
});

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    const cek = cekTopikPesan(text);
    if (!cek.boleh) {
        appendMessage(text, 'user-message');
        userInput.value = '';
        userInput.style.height = 'auto';
        const pesan = cek.alasan === 'diblokir' ? PESAN_TOLAK_DIBLOKIR : PESAN_TOLAK_DILUAR;
        setTimeout(() => appendMessage(pesan, 'ai-message'), 300);
        return;
    }

    appendMessage(text, 'user-message');
    userInput.value = '';
    userInput.style.height = 'auto';

    setLoading(true);

    conversationHistory.push({ role: 'user', content: text });

    const loadingId = appendLoadingMessage();

    try {
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `HTTP Error ${response.status}`);
        }

        const data = await response.json();

        if (data.reply) {
            conversationHistory.push({ role: 'assistant', content: data.reply });
            updateLoadingMessage(loadingId, data.reply);
        } else {
            throw new Error('Format respons tidak dikenali.');
        }

    } catch (error) {
        console.error('Error Groq API:', error);
        
        conversationHistory.pop();
        
        let pesanError = '❌ Terjadi kesalahan. ';
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            pesanError += 'API Key tidak valid. Periksa kembali API Key Anda.';
        } else if (error.message.includes('429') || error.message.includes('Rate limit')) {
            pesanError += 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            pesanError += 'Tidak ada koneksi internet. Periksa jaringan Anda.';
        } else {
            pesanError += error.message;
        }
        
        updateLoadingMessage(loadingId, pesanError, true);
    } finally {
        setLoading(false);
        userInput.focus();
    }
}

function clearChat() {
    chatBox.innerHTML = `
        <div class="message ai-message">
            <div class="message-content">
                Halo! 👋 Selamat datang di asisten virtual <strong>SPMB SMKN 4 Kendari</strong> 2026/2027.<br><br>
                Saya siap membantu informasi seputar:
                <ul>
                    <li>📋 Syarat & Dokumen Pendaftaran</li>
                    <li>📅 Jadwal SPMB 2026/2027</li>
                    <li>🏫 Program Keahlian yang Tersedia (maks. 2 pilihan)</li>
                    <li>🎯 Seleksi: Nilai Rapor + TKA, Prestasi, Tes Bakat & Minat</li>
                    <li>💙 Kuota Keluarga Tidak Mampu/Disabilitas & Domisili Terdekat</li>
                    <li>📞 Info Kontak & Pendaftaran Online</li>
                </ul>
                Ada yang ingin Anda tanyakan?
            </div>
        </div>`;
    
    conversationHistory = [];
}

function appendMessage(text, className) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', className);

    const content = document.createElement('div');
    content.classList.add('message-content');

    if (className === 'ai-message') {
        content.innerHTML = marked.parse(text);
    } else {
        content.textContent = text;
    }

    const time = document.createElement('div');
    time.classList.add('timestamp');
    time.textContent = getTime();

    wrapper.appendChild(content);
    wrapper.appendChild(time);
    chatBox.appendChild(wrapper);
    scrollToBottom();

    return null;
}

function appendLoadingMessage() {
    const id = 'loading-' + Date.now();
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', 'ai-message');
    wrapper.id = id;

    wrapper.innerHTML = `
        <div class="loading-dots">
            <span></span><span></span><span></span>
        </div>`;

    chatBox.appendChild(wrapper);
    scrollToBottom();
    return id;
}

function updateLoadingMessage(id, text, isError = false) {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;

    const content = document.createElement('div');
    content.classList.add('message-content');

    if (isError) {
        content.style.color = '#c0392b';
        content.textContent = text;
    } else {
        content.innerHTML = marked.parse(text);
    }

    const time = document.createElement('div');
    time.classList.add('timestamp');
    time.textContent = getTime();

    wrapper.innerHTML = '';
    wrapper.appendChild(content);
    wrapper.appendChild(time);
    scrollToBottom();
}

function setLoading(isLoading) {
    sendBtn.disabled  = isLoading;
    userInput.disabled = isLoading;
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getTime() {
    return new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
