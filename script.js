let allMenuItems = []; 

async function fetchMenu(lang) {
    try {
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

    // Përdorim .map().join('') për një renderim më të pastër dhe pa "undefined"
    const menuHTML = items.map(item => {
        // --- LOGJIKA E RE E ÇMIMEVE ---
        let priceSection = '';

        // Kontrollojmë nëse produkti ka çmim familjar (si pica)
        if (item.price_family && item.price_normal) {
            priceSection = `
                <div class="price-item">
                    <span class="price-label">Normale</span>
                    <span class="price-value">${item.price_normal}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Familjare</span>
                    <span class="price-value">${item.price_family}</span>
                </div>
            `;
        } else {
            // Rasti për pije ose produkte me vetëm 1 çmim
            // Përdorim çmimin që gjejmë (price_normal ose thjesht price)
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

// Ndryshimi i Gjuhes
document.querySelectorAll('input[name="lang"]').forEach(input => {
    input.addEventListener('change', (e) => fetchMenu(e.target.value));
});

window.addEventListener('DOMContentLoaded', () => fetchMenu('sq'));