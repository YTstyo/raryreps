document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#itemsTable tbody');
    let itemsData = []; // Store all items from items.json
    let batchIndex = 0; // To keep track of the current batch
    const batchSize = 50; // Number of items to load per batch
    const maxRetries = 15; // Maximum retries for failed images
    let failedImages = []; // To store images that failed to load

    // Function to render a batch of rows
    const renderTableRowsBatch = (startIndex) => {
        const endIndex = Math.min(startIndex + batchSize, itemsData.length);
        for (let i = startIndex; i < endIndex; i++) {
            const item = itemsData[i];
            const { name, link, img, price, brand, category } = item;

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${name}</td>
                <td><a href="${link}" target="_blank">Link</a></td>
                <td><img src="${img}?t=${new Date().getTime()}" alt="${name}" width="100"></td>
                <td>${price}</td>
                <td>${brand}</td>
                <td>${category}</td>
            `;

            // Append the row to the table body
            tableBody.appendChild(row);

            // Handle image load errors
            const imageElement = row.querySelector('img');
            imageElement.onerror = () => {
                failedImages.push({ img: imageElement, imageUrl: img, retries: 0 });
            };
        }
    };

    // Function to load the next batch of products
    const loadNextBatch = () => {
        renderTableRowsBatch(batchIndex);
        batchIndex += batchSize;
    };

    // Retry failed images every 3 seconds
    const retryFailedImages = () => {
        failedImages.forEach((failedImage, index) => {
            const { img, imageUrl, retries } = failedImage;

            if (retries >= maxRetries) {
                console.log(`Stopping retries for image: ${imageUrl} after ${retries} attempts`);
                failedImages.splice(index, 1); // Stop retrying after maxRetries
                return;
            }

            img.src = `${imageUrl}?t=${new Date().getTime()}`; // Retry with a timestamp
            failedImage.retries += 1; // Increment retry count

            // Remove from the failedImages list on successful load
            img.onload = () => {
                failedImages.splice(index, 1);
            };
        });
    };

    // Fetch the items.json file
    fetch('items.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(items => {
            itemsData = items; // Store the fetched items data
            loadNextBatch(); // Load the first batch
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));

    // Load the next batch every 10 seconds
    setInterval(() => {
        if (batchIndex < itemsData.length) {
            loadNextBatch();
        }
    }, 9000);

    // Retry failed images every 3 seconds
    setInterval(retryFailedImages, 3000);
});
