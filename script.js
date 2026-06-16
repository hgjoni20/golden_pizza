let allMenuItems = [];
let currentLang = 'sq'; // Ruajmë gjuhën aktuale

// Objekt me përkthimet
const translations = {
    'sq': { normal: 'Normale', family: 'Familjare' },
    'en': { normal: 'Regular', family: 'Family' }
};

async function fetchMenu(lang) {
    try {
        currentLang = lang; // Ruajmë gjuhën e zgjedhur
        const response = await fetch(`data/menu-${lang}.json`);
        if (!response.ok) throw new Error("Skedari nuk u gjet");
        const data = await response.json();
        
        allMenuItems = data.items;
        document.getElementById('category-name').textContent = data.categoryTitle;
        
        renderCategories(data.categories);
        renderMenu(allMenuItems); 
    } catch (error) {
        console.error("Gabim:", error);
        document.getElementById('menu-container').innerHTML = "<p>Gabim gjatë ngarkimit të menusë.</p>";
    }
}

function renderCategories(categories) {
    const filterContainer = document.getElementById('category-filters');
    filterContainer.innerHTML = ''; 

    categories.forEach((cat, index) => {
        const button = document.createElement('button');
        button.className = `cat-btn ${index === 0 ? 'active' : ''}`;
        button.textContent = cat.label;
        button.setAttribute('data-category', cat.id);
        
        button.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            const categoryId = cat.id;
            const filtered = categoryId === 'te-gjitha' 
                ? allMenuItems 
                : allMenuItems.filter(item => item.category === categoryId);
            
            renderMenu(filtered);
        };

        filterContainer.appendChild(button);
    });
}

function renderMenu(items) {
    const container = document.getElementById('menu-container');
    container.innerHTML = ''; 
    
    // Marrim përkthimet për gjuhën aktuale
    const t = translations[currentLang] || translations['sq'];

    const menuHTML = items.map(item => {
        let priceSection = '';

        if (item.price_family && item.price_normal) {
            priceSection = `
                <div class="price-item">
                    <span class="price-label">${t.normal}</span>
                    <span class="price-value">${item.price_normal}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">${t.family}</span>
                    <span class="price-value">${item.price_family}</span>
                </div>
            `;
        } else {
            const singlePrice = item.price_normal || item.price || "---";
            priceSection = `
                <div class="price-item single">
                    <span class="price-value">${singlePrice}</span>
                </div>
            `;
        }

        return `
            <article class="pizza-card">
                <div class="pizza-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="pizza-info">
                    <h3>${item.name}</h3>
                    <p>${item.description || ''}</p>
                    <div class="price-container">
                        ${priceSection}
                    </div>
                </div>
            </article>
        `;
    }).join('');

    container.innerHTML = menuHTML;
}

document.querySelectorAll('input[name="lang"]').forEach(input => {
    input.addEventListener('change', (e) => fetchMenu(e.target.value));
});

window.addEventListener('DOMContentLoaded', () => fetchMenu('sq'));
const scrollButton = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
    // Shfaq butonin vetëm nëse kemi bërë scroll më shumë se 300px
    if (window.scrollY > 300) {
        scrollButton.style.display = "block";
    } else {
        scrollButton.style.display = "none";
    }
});

// Funksioni për t'u kthyer në krye kur klikon butonin
scrollButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Ky efekt e bën kthimin të butë, jo kërcim
    });
});