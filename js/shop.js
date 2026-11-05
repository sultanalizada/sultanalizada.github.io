// Supabase-i birbaşa brauzerə çağırmaq üçün CDN linki
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
// --- 1. SUPABASE AYARLARI ---
// Bura öz Supabase URL və KEY-ini yapışdıracaqsan
const supabaseUrl = 'https://ezccynahgubalainoqkf.supabase.co';
const supabaseKey = 'sb_publishable_ipRtiX4xI1SYlMxU8YAWQw_D8txWLKX';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 2. HTML ELEMENTLƏRİNİ SEÇİRİK ---
const loginBtn = document.getElementById('loginBtn');
const userInput = document.getElementById('userInput');
const userPointsDisplay = document.getElementById('userPoints');
const watchAdBtn = document.getElementById('watchAdBtn');
const adStatus = document.getElementById('adStatus');
const productsGrid = document.getElementById('productsGrid');

let currentUser = null;
let currentSP = 0; // İstifadəçinin anlıq xalı

// --- 3. İSTİFADƏÇİ GİRİŞİ VƏ XALIN ÇƏKİLMƏSİ ---
loginBtn.addEventListener('click', async () => {
    const username = userInput.value.trim().toLowerCase();
    
    if(!username) {
        alert("Please enter a valid Email or Discord Username.");
        return;
    }

    // Bazada bu istifadəçini axtarırıq
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (data) {
        // Köhnə istifadəçi tapıldı
        currentUser = username;
        currentSP = data.sp;
        userPointsDisplay.innerText = currentSP;
        alert(`Welcome back, ${username}! Your balance is loaded.`);
    } else {
        // Yeni istifadəçidir, bazaya qeyd edirik
        const { data: newData, error: insertError } = await supabase
            .from('users')
            .insert([{ username: username, sp: 0 }])
            .select()
            .single();
            
        if (!insertError) {
            currentUser = username;
            currentSP = 0;
            userPointsDisplay.innerText = 0;
            alert("Account created successfully!");
        } else {
            console.error(insertError);
            alert("Database error!");
        }
    }
});

// --- 4. ANTI-CHEAT REKLAM SİSTEMİ (Brauzer izləmə) ---
let adStartTime = 0;
let isAdRunning = false;

watchAdBtn.addEventListener('click', () => {
    if(!currentUser) {
        alert("Please save your identity first to earn points!");
        return;
    }

    // Adsterra Linkin (Öz linkinlə dəyişə bilərsən)
    const adUrl = "https://www.profitableratecpmnetwork.com/jhvy5sad?key=f907035dcdac93e8ac9d29902c6def8d";
    window.open(adUrl, "_blank");

    watchAdBtn.disabled = true;
    adStatus.style.display = "block";
    adStatus.innerText = "Ad is open... Stay on the ad tab for at least 10 seconds!";
    adStatus.style.color = "#f59e0b"; // Narıncı rəng
    
    adStartTime = Date.now();
    isAdRunning = true;
});

// İstifadəçi bizim səhifəyə qayıdanda (Focus olanda)
window.addEventListener('focus', async () => {
    if (isAdRunning) {
        let timeSpentAway = (Date.now() - adStartTime) / 1000; 
        isAdRunning = false; 

        if (timeSpentAway >= 10) { // 10 saniyə qalıbsa
            adStatus.innerText = "Verifying...";
            
            // Xalı artırırıq
            currentSP += 10;
            const { error } = await supabase
                .from('users')
                .update({ sp: currentSP })
                .eq('username', currentUser);

            if (!error) {
                userPointsDisplay.innerText = currentSP;
                adStatus.innerText = "🎉 Success! 10 SP Added to your account!";
                adStatus.style.color = "#10b981";
            }
        } else {
            // Tez qayıdıbsa fırıldaq!
            adStatus.innerText = "❌ You closed the ad too early! No points awarded.";
            adStatus.style.color = "#ef4444"; // Qırmızı
        }

        // 4 saniyə sonra düyməni bərpa et
        setTimeout(() => {
            watchAdBtn.disabled = false;
            adStatus.style.display = "none";
        }, 4000);
    }
});

// --- 5. SHOP (MAĞAZA) MƏNTİQİ VƏ SIFIR YADDAŞ ---
async function loadShopItems() {
    // Bazadakı bütün məhsulları çəkirik
    const { data: items, error } = await supabase
        .from('shop_items')
        .select('*');

    if (error) {
        productsGrid.innerHTML = "<p class='loading-text'>Error loading items.</p>";
        return;
    }

    if (items.length === 0) {
        productsGrid.innerHTML = "<p class='loading-text'>Shop is currently empty.</p>";
        return;
    }

    productsGrid.innerHTML = ""; // Yüklənir yazısını təmizlə

    // Məhsulları HTML-ə düzürük
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${item.cover_img}" alt="Cover" class="product-image">
            <h3 class="product-title">${item.title}</h3>
            <p class="product-price">${item.price} SP</p>
            <button class="buy-btn" data-id="${item.id}" data-price="${item.price}" data-link="${item.drive_link}">
                Buy Item
            </button>
        `;
        productsGrid.appendChild(card);
    });

    // Satın Alma düymələrinə klik funksiyası əlavə edirik
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!currentUser) {
                alert("Please identify yourself at the top first!");
                return;
            }

            const price = parseInt(e.target.getAttribute('data-price'));
            const driveLink = e.target.getAttribute('data-link');

            if (currentSP >= price) {
                // Pulunu çıxırıq
                currentSP -= price;
                
                const { error } = await supabase
                    .from('users')
                    .update({ sp: currentSP })
                    .eq('username', currentUser);

                if (!error) {
                    userPointsDisplay.innerText = currentSP;
                    // Əsl material linkini göstəririk
                    alert("Purchase successful! The material will open in a new tab.");
                    window.open(driveLink, "_blank");
                    
                    // İstəsən düyməni "Purchased" edə bilərik
                    e.target.innerText = "Purchased (Open again)";
                    e.target.style.backgroundColor = "#10b981";
                }
            } else {
                alert(`Not enough SP! You need ${price - currentSP} more SP. Watch some ads!`);
            }
        });
    });
}

// Səhifə açılanda mağazanı yüklə
window.addEventListener('DOMContentLoaded', loadShopItems);
