// --- BOOKS SECTION: ANTI-CHEAT MƏNTİQİ ---

let bookAdStartTime = 0;
let isBookAdRunning = false;
let pendingDriveLink = ""; // Hansı kitabın linkini verəcəyimizi yadda saxlayırıq
let activeStatusElement = null; // Hansı kitabın altında yazı çıxacaq
let activeButton = null; // Hansı düyməyə basılıb

// Bütün "Watch AD" düymələrini seçirik
const bookButtons = document.querySelectorAll('.watch-ad-book-btn');

bookButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 1. Adsterra Direct Linkini bura yazırsan
        const adsterraDirectLink = "https://www.profitableratecpmnetwork.com/fspm49jkm?key=88e5821febc3aed060a93ce3587926fc";
        window.open(adsterraDirectLink, "_blank");

        // 2. Hansı kitaba basıldığını yadda saxlayırıq
        activeButton = e.target;
        pendingDriveLink = activeButton.getAttribute('data-drive');
        activeStatusElement = activeButton.nextElementSibling; // Düymənin altındakı <p> teqi

        // 3. Düyməni dondurub statusu göstəririk
        activeButton.disabled = true;
        activeStatusElement.style.display = "block";
        activeStatusElement.innerText = "Watching Ad... Please wait 10s!";
        activeStatusElement.style.color = "#f59e0b"; // Narıncı

        // 4. Vaxtı başladırıq
        bookAdStartTime = Date.now();
        isBookAdRunning = true;
    });
});

// İstifadəçi səhifəyə qayıdanda yoxlayırıq
window.addEventListener('focus', () => {
    if (isBookAdRunning) {
        let timeSpentAway = (Date.now() - bookAdStartTime) / 1000;
        isBookAdRunning = false; // Prosesi bitiririk

        if (timeSpentAway >= 10) {
            // HALALDIR: 10 saniyə qaldı
            activeStatusElement.innerText = "🎉 Success! Opening your book...";
            activeStatusElement.style.color = "#10b981"; // Yaşıl
            
            // 1.5 saniyə sonra Drive linkini açırıq
            setTimeout(() => {
                window.open(pendingDriveLink, "_blank");
                
                // Düyməni "Read Again" edirik ki, istəsə yenə baxa bilsin
                activeButton.innerText = "📖 Read Again";
                activeButton.disabled = false;
                activeStatusElement.style.display = "none";
            }, 1500);

        } else {
            // FIRILDAQ: Tez qayıtdı
            activeStatusElement.innerText = "❌ You closed the ad too early!";
            activeStatusElement.style.color = "#ef4444"; // Qırmızı
            
            // 3 saniyə sonra düyməni bərpa edirik ki, təzədən cəhd etsin
            setTimeout(() => {
                activeButton.disabled = false;
                activeStatusElement.style.display = "none";
            }, 3000);
        }
    }
});
