const quiz = [

{
    soal: `Pesan berikut aman atau scam?

"Selamat! Anda mendapatkan hadiah uang tunai,
klik link berikut untuk klaim sekarang!

bit.ly/hadiah123"`,

    pilihan: [
        "A. Aman",
        "B. Scam",
        "C. Mungkin Aman",
        "D. Tidak Tahu"
    ],

    benar: "B. Scam",

    feedbackBenar:
    "Pesan ini memiliki ciri-ciri penipuan (phishing), menawarkan hadiah tiba-tiba, mendesak pengguna bertindak cepat, dan menggunakan tautan pendek yang menyembunyikan alamat asli. Jangan pernah klik tautan dari sumber tidak terpercaya.",

    feedbackSalah:
    "Pesan dengan iming-iming hadiah mendadak dan tautan mencurigakan adalah tanda umum scam. Selalu verifikasi informasi sebelum mengklik tautan apapun."
},

{
    soal: `Anda menerima file bernama

"Undangan_Nikah.apk"

dari nomor tidak dikenal via WhatsApp.

File tersebut termasuk kategori apa?`,

    pilihan: [
        "A. Aman",
        "B. Malware",
        "C. Mungkin Aman",
        "D. Tidak Tahu"
    ],

    benar: "B. Malware",

    feedbackBenar:
    "File APK dari sumber tidak dikenal sangat berisiko mengandung malware yang dapat mencuri data pribadi atau merusak perangkat Anda.",

    feedbackSalah:
    "Jangan pernah menginstal file APK dari nomor yang tidak dikenal. File tersebut bisa menyamar sebagai undangan biasa namun menyimpan program berbahaya di dalamnya."
},

{
    soal: `Anda menerima pesan WhatsApp:

"Akun WhatsApp Anda akan dinonaktifkan.
Verifikasi sekarang di wa-security-login.xyz"

Pesan ini termasuk?`,

    pilihan: [
        "A. Phishing",
        "B. Aman",
        "C. Mungkin Aman",
        "D. Tidak Tahu"
    ],

    benar: "A. Phishing",

    feedbackBenar:
    "Domain wa-security-login.xyz bukan domain resmi WhatsApp. Pesan ini dirancang untuk mencuri kredensial akun Anda.",

    feedbackSalah:
    "Situs resmi WhatsApp hanya menggunakan domain resminya. Jika ada pesan meminta verifikasi lewat link asing, abaikan dan laporkan."
},

{
    soal: `Anda mendapat email dari

support@paypa1.com

yang meminta Anda login dan memperbarui data kartu kredit.

Ini termasuk?`,

    pilihan: [
        "A. Aman",
        "B. Phishing",
        "C. Mungkin Aman",
        "D. Tidak Tahu"
    ],

    benar: "B. Phishing",

    feedbackBenar:
    "Alamat email menggunakan angka 1 menggantikan huruf l pada paypal. Teknik ini disebut typosquatting dan sering digunakan dalam phishing.",

    feedbackSalah:
    "Selalu perhatikan ejaan domain pengirim email. Penipu sering mengganti satu karakter untuk meniru alamat resmi."
},

{
    soal: `Teman Anda mengirim pesan:

"Bro, download app ini buat nonton film gratis,
aku udah pakai aman kok"

disertai link ke situs tidak dikenal.

Apa yang sebaiknya Anda lakukan?`,

    pilihan: [
        "A. Langsung download karena teman sendiri",
        "B. Tolak dan abaikan link tersebut",
        "C. Download asal tidak bayar",
        "D. Minta teman install dulu"
    ],

    benar: "B. Tolak dan abaikan link tersebut",

    feedbackBenar:
    "Akun teman bisa saja sudah disusupi atau dimanfaatkan pelaku. Link ke situs tidak dikenal berpotensi menyebarkan malware meski dikirim orang yang dikenal.",

    feedbackSalah:
    "Social engineering sering memanfaatkan kepercayaan antar kenalan. Selalu cek keaslian sumber unduhan meski datang dari teman."
}

];

let current = 0;
let skor = 0;

loadQuestion();

function loadQuestion(){

    document.getElementById("nomor").innerText =
    "Pertanyaan " + (current + 1);

    document.getElementById("soal").innerText =
    quiz[current].soal;

    document.getElementById("feedback").innerText =
    "FEEDBACK : Jawaban Anda akan muncul di sini...";

    document.getElementById("nextBtn").disabled = true;

    const jawaban =
    document.getElementById("jawaban");

    jawaban.innerHTML = "";

    quiz[current].pilihan.forEach(p => {

        const btn =
        document.createElement("button");

        btn.innerText = p;

        btn.onclick = () => cekJawaban(btn,p);

        jawaban.appendChild(btn);

    });

}

function cekJawaban(button,pilihan){

    const data = quiz[current];

    const semuaButton =
    document.querySelectorAll(".answer-box button");

    semuaButton.forEach(btn => {

        btn.disabled = true;

        if(btn.innerText === data.benar){

            btn.classList.add("benar");

        }

    });

    if(pilihan === data.benar){

        skor++;

        document.getElementById("feedback").innerText =
        "FEEDBACK : " + data.feedbackBenar;

    }else{

        button.classList.add("salah");

        document.getElementById("feedback").innerText =
        "FEEDBACK : " + data.feedbackSalah;
    }

    document.getElementById("nextBtn").disabled = false;
}

function nextQuestion(){

    current++;

    if(current < quiz.length){

        loadQuestion();

    }else{

        let nilai =
        Math.round((skor / quiz.length) * 100);

        document.querySelector(".quiz-content").innerHTML =

        `<div class="question-box">

            <h2>Quiz Selesai</h2>

            <br>

            <h3>Skor Anda : ${skor}/${quiz.length}</h3>

            <br>

            <h3>Nilai : ${nilai}%</h3>

        </div>`;

        document.getElementById("feedback").style.display = "none";
        document.querySelector(".next-container").style.display = "none";
    }
}