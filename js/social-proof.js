// --- SULTAN ACADEMY SPONTAN DONATION & PURCHASE FEED ---

// 1. SƏNİN DƏSTƏKÇİ VƏ ALICI SİYAHIN (Buraya istədiyin adı artıra bilərsən):
const supportersList = [
    { name: "Eldar M.", action: "bought Dental Assistant Guide", time: "2 minutes ago", initial: "E" },
    { name: "Sarah K.", action: "donated $15 via Wise", time: "8 minutes ago", initial: "S" },
    { name: "Murad R.", action: "bought Russian Language Guide", time: "18 minutes ago", initial: "M" },
    { name: "Aysel T.", action: "donated $20 via Patreon", time: "34 minutes ago", initial: "A" },
    { name: "Lukas W.", action: "joined German Classroom", time: "1 hour ago", initial: "L" },
    { name: "Kamran B.", action: "bought TELC C1 Preparation", time: "2 hours ago", initial: "K" },
    { name: "Farid H.", action: "donated $10 via Patreon", time: "3 hours ago", initial: "F" }
];

// 2. Spontan və Parlaq Rənglər Qalereyası
const vibrantGradients = [
    "linear-gradient(135deg, #FF416C, #FF4B2B)", // Alovlu Qırmızı/Çəhrayı
    "linear-gradient(135deg, #10b981, #059669)", // Zümrüd Yaşılı
    "linear-gradient(135deg, #38bdf8, #6366f1)", // Neon Mavi/İndiqo
    "linear-gradient(135deg, #f59e0b, #ef4444)", // Qızılı Narıncı
    "linear-gradient(135deg, #8b5cf6, #ec4899)", // Bənövşəyi/Magenta
    "linear-gradient(135deg, #06b6d4, #3b82f6)"  // Okean Mavisi
];

const container = document.getElementById("social-proof-container");
let currentIndex = 0;

function showNextNotification() {
    if (!container) return;

    const data = supportersList[currentIndex];
    
    // Təsadüfi bir spontan rəng seçirik
    const randomGradient = vibrantGradients[Math.floor(Math.random() * vibrantGradients.length)];

    // Kart elementini yaradırıq
    const card = document.createElement("div");
    card.className = "sp-card";
    card.innerHTML = `
        <div class="sp-avatar" style="background: ${randomGradient};">
            ${data.initial}
        </div>
        <div class="sp-details">
            <span class="sp-name">${data.name}</span>
            <span class="sp-action">${data.action}</span>
            <span class="sp-time"><i class="fas fa-check-circle" style="color: #10b981;"></i> ${data.time}</span>
        </div>
    `;

    container.appendChild(card);

    // 1. Zərif şəkildə altdan daxil olur
    setTimeout(() => {
        card.classList.add("show");
    }, 100);

    // 2. 4 saniyə ekranda qalır, sonra yuxarı qalxaraq buxarlanır
    setTimeout(() => {
        card.classList.remove("show");
        card.classList.add("exit");

        // 3. Animasiya bitəndən sonra DOM-dan tam silirik
        setTimeout(() => {
            card.remove();
        }, 600);
    }, 4500);

    // Növbəti dəstəkçiyə keç (dövr edir)
    currentIndex = (currentIndex + 1) % supportersList.length;

    // 4. Növbəti bildiriş 7 ilə 11 saniyə arasında təsadüfi vaxtda çıxır (çox təbii görünür)
    const nextInterval = Math.floor(Math.random() * 4000) + 7000;
    setTimeout(showNextNotification, nextInterval);
}

// Sayt açılandan 4 saniyə sonra ilk bildiriş başlasın
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(showNextNotification, 4000);
});
