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

// --- ADSTERRA ANTI-CHEAT & POPUP BLOCKER FIX ---

document.addEventListener("DOMContentLoaded", () => {
    const adButtons = document.querySelectorAll('.watch-ad-btn');

    adButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetLink = this.getAttribute('data-link');
            const originalHTML = this.innerHTML;
            
            const adsterraDirectLink = "https://www.profitableratecpmnetwork.com/fspm49jkm?key=88e5821febc3aed060a93ce3587926fc";
            
            // Reklamı açırıq
            const adWindow = window.open(adsterraDirectLink, "_blank");
            
            // TELEFONLARDA POPUP BLOKLANIB-BLOKLANMADIĞINI YOXLAYIRIQ:
            if (!adWindow || adWindow.closed || typeof adWindow.closed === 'undefined') {
                alert("⚠️ Pop-up Blocked!\nYour browser blocked the sponsor advertisement. Please enable pop-ups in your browser settings to verify the sponsor ad and unlock the material.");
                return; // Reklam açılmadısa, TAYMER İŞƏ DÜŞMÜR VƏ LİNK VERİLMİR!
            }
            
            // Reklam uğurla açıldısa:
            this.style.pointerEvents = 'none'; 
            this.style.opacity = '0.7';
            
            let timeLeft = 10;
            this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verifying AD... ${timeLeft}s`;
            
            const countdownTimer = setInterval(() => {
                timeLeft--;
                
                if (timeLeft > 0) {
                    this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verifying AD... ${timeLeft}s`;
                } else {
                    clearInterval(countdownTimer);
                    
                    if (targetLink && !targetLink.includes("YOUR_")) {
                        window.location.href = targetLink; 
                    } else {
                        alert("Sultan, bu düyməyə hələ əsl linki qoymamısan! HTML-də data-link hissəsini yenilə."); 
                        this.innerHTML = originalHTML;
                        this.style.pointerEvents = 'auto';
                        this.style.opacity = '1';
                    }
                }
            }, 1000);
        });
    });
});
