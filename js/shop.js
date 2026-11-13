// Supabase-i birbaşa brauzerə çağırmaq üçün CDN linki
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- 1. SUPABASE AYARLARI ---
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

const loggedInUser = document.getElementById('loggedInUser');
const userNameText = document.getElementById('userNameText');
const loginBox = document.querySelector('.login-box');
const sectionDesc = document.querySelector('.section-desc');

let currentUser = null;
let currentSP = 0;

// --- 3. İSTİFADƏÇİ GİRİŞİ ---
loginBtn.addEventListener('click', async () => {
    const username = userInput.value.trim().toLowerCase();
    
    if(!username) {
        alert("Please enter a valid Username.");
        return;
    }

    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (data) {
        currentUser = username;
        currentSP = data.sp;
        userPointsDisplay.innerText = currentSP;
        alert(`Welcome back, ${username}! Your balance is loaded.`);
    } else {
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
            alert("Database error!");
            loginBtn.innerHTML = '<i class="fas fa-save"></i> Save Identity';
            return;
        }
    }

    if (currentUser) {
        loggedInUser.classList.remove('hidden');
        userNameText.innerText = currentUser;
        loginBox.classList.add('hidden');
        sectionDesc.innerText = "You are successfully logged in! Complete tasks below to earn SP.";
    }
});

// --- 4. ANTI-CHEAT REKLAM SİSTEMİ (POPUP CHECK FIX) ---
watchAdBtn.addEventListener('click', () => {
    if(!currentUser) {
        alert("Please save your identity first to earn points!");
        return;
    }

    const adUrl = "https://www.profitableratecpmnetwork.com/fspm49jkm?key=88e5821febc3aed060a93ce3587926fc";
    const adWindow = window.open(adUrl, "_blank");

    // Əgər telefonda pop-up bloklanıbsa:
    if (!adWindow || adWindow.closed || typeof adWindow.closed === 'undefined') {
        alert("⚠️ Pop-up Blocked!\nYour browser blocked the sponsor advertisement. Please allow pop-ups in your browser settings to earn SP points.");
        return; // XAL VERİLMİR!
    }

    watchAdBtn.disabled = true;
    adStatus.classList.remove('hidden');
    adStatus.style.color = "#f59e0b"; 
    
    let timeLeft = 10;
    watchAdBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Watching AD... ${timeLeft}s`;
    adStatus.innerText = "Please wait... Do not close the page!";

    const countdownTimer = setInterval(async () => {
        timeLeft--;
        
        if (timeLeft > 0) {
            watchAdBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Watching AD... ${timeLeft}s`;
        } else {
            clearInterval(countdownTimer);
            watchAdBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verifying...`;
            
            currentSP += 10;
            const { error } = await supabase
                .from('users')
                .update({ sp: currentSP })
                .eq('username', currentUser);

            if (!error) {
                userPointsDisplay.innerText = currentSP;
                adStatus.innerText = "🎉 Success! 10 SP Added to your account!";
                adStatus.style.color = "#10b981";
            } else {
                adStatus.innerText = "❌ Error saving points. Try again.";
                adStatus.style.color = "#ef4444";
            }

            watchAdBtn.innerHTML = `<i class="fas fa-play-circle"></i> Watch Sponsor Ad (+10 SP)`;
            watchAdBtn.disabled = false;
            
            setTimeout(() => {
                adStatus.classList.add('hidden');
            }, 4000);
        }
    }, 1000);
});

// --- 5. SHOP (MAĞAZA) MƏNTİQİ ---
async function loadShopItems() {
    const { data: items, error } = await supabase
        .from('shop_items')
        .select('*');

    if (error) {
        productsGrid.innerHTML = "<p class='loading-spinner'>Error loading items.</p>";
        return;
    }

    if (items.length === 0) {
        productsGrid.innerHTML = "<p class='loading-spinner'>Shop is currently empty.</p>";
        return;
    }

    productsGrid.innerHTML = ""; 

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${item.cover_img}" alt="Cover" class="product-image">
            <h3 class="product-title">${item.title}</h3>
            <p class="product-price">${item.price} SP</p>
            <button class="buy-btn" data-id="${item.id}" data-price="${item.price}" data-link="${item.drive_link}">
                <i class="fas fa-unlock"></i> Unlock Item
            </button>
        `;
        productsGrid.appendChild(card);
    });

    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!currentUser) {
                alert("Please identify yourself at the top first!");
                return;
            }

            const price = parseInt(e.target.getAttribute('data-price'));
            const driveLink = e.target.getAttribute('data-link');

            if (currentSP >= price) {
                currentSP -= price;
                
                const { error } = await supabase
                    .from('users')
                    .update({ sp: currentSP })
                    .eq('username', currentUser);

                if (!error) {
                    userPointsDisplay.innerText = currentSP;
                    alert("Purchase successful! The material will open in a new tab.");
                    window.open(driveLink, "_blank");
                    
                    e.target.innerHTML = '<i class="fas fa-check-circle"></i> Purchased';
                    e.target.style.background = "linear-gradient(135deg, #10b981, #059669)";
                }
            } else {
                alert(`Not enough SP! You need ${price - currentSP} more SP. Watch some ads!`);
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', loadShopItems);
