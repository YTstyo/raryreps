fetch('items.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(items => {
        const tableBody = document.querySelector("#itemsTable tbody");

        items.forEach(item => {
            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td><a href="${item.link}">Link</a></td>
                <td><img src="${item.img}" alt="${item.name}" width="100"></td>
                <td>${item.price}</td>
                <td>${item.brand}</td>
                <td>${item.category}</td>
            `;
            
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
