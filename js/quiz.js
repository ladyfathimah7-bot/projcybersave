function cekJawaban(tombol, benar){

    let feedback = document.getElementById("feedback");

    let semuaTombol =
        document.querySelectorAll(".answer-box button");

    semuaTombol.forEach(btn => {
        btn.disabled = true;
    });

    if(benar){

        tombol.classList.add("benar");

        feedback.innerHTML =
        "FEEDBACK : Benar! Pesan tersebut merupakan scam karena menawarkan hadiah dan menggunakan link mencurigakan.";

    }else{

        tombol.classList.add("salah");

        feedback.innerHTML =
        "FEEDBACK : Salah. Jawaban yang benar adalah Scam.";

        semuaTombol.forEach(btn => {

            if(btn.innerText === "Scam"){
                btn.classList.add("benar");
            }

        });

    }

}