let items = JSON.parse(localStorage.getItem("fridgeItems")) || [];

function saveItems() {
    localStorage.setItem("fridgeItems", JSON.stringify(items));
}

function renderItems() {
    const list = document.getElementById("itemList");
    list.innerHTML = "";
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 今日の日付の0時に設定

    items.forEach((item, index) => {
        const li = document.createElement("li");
        const expiry = new Date(item.expiry);
        expiry.setHours(0, 0, 0, 0); // 賞味期限の日付の0時に設定

        // 日数計算
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 端数繰り上げ

        if (diffDays < 3) { // 3日未満でdangerクラスを付与 (当日を含む)
            li.classList.add("danger");
        }

        li.innerHTML = `
            <span>${item.name}（賞味期限: ${item.expiry}）</span>
            <button class="delete-btn" onclick="deleteItem(${index})">削除</button>
        `;
        list.appendChild(li);
    });
}

function addItem() {
    const name = document.getElementById("itemName").value.trim();
    const expiry = document.getElementById("expiryDate").value;

    if (!name || !expiry) {
        alert("名前と賞味期限を入力してください");
        return;
    }

    items.push({ name, expiry });
    saveItems();
    renderItems();

    document.getElementById("itemName").value = "";
    document.getElementById("expiryDate").value = "";
}

function deleteItem(index) {
    items.splice(index, 1);
    saveItems();
    renderItems();
}

// アプリケーションがロードされたときにアイテムをレンダリング
document.addEventListener('DOMContentLoaded', renderItems);
