
        // Theme toggle functionality
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = themeToggleBtn.querySelector('i');
        
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
        
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('nav ul');
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            });
        });

        // URL untuk mengambil data dari API The New York Times
        const url = 'https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=Pb0ua8srT5GWCP17mTRGC7vNXld0YNze';

        // Opsi untuk permintaan fetch, termasuk metode HTTP dan header yang diterima
        const options = {
            method: "GET", // Menggunakan metode GET untuk mengambil data
            headers: { "Accept": "application/json" }, // Menyatakan bahwa respons yang diharapkan adalah dalam format JSON
        };

        // Mengambil data dari API menggunakan fetch
        fetch(url, options)
            .then(response => response.ok ? response.json() : Promise.reject({
                status: response.status, // Mengambil status respons jika tidak ok
                statusText: response.statusText, // Mengambil teks status respons jika tidak ok
                errorMessage: response.json(), // Mengambil pesan error dalam format JSON
            }))
            .then(data => {
                // Menampilkan novel dari data yang diterima, memisahkan antara novel dalam rentang 0-12 dan 12-24
                displayNovels(data.results.lists, 'novel-list', 0, 12);
                displayNovels(data.results.lists, 'novel-new', 12, 24);
            })
            .catch(err => console.error(err)); // Menangani dan mencetak error jika terjadi masalah

        // Fungsi untuk menampilkan novel di elemen dengan ID tertentu
        function displayNovels(lists, elementId, startIndex, endIndex) {
            // Mengambil elemen HTML berdasarkan ID
            const container = document.getElementById(elementId);
            // Mengosongkan konten elemen tersebut sebelum menambahkan novel baru
            container.textContent = '';

            let index = 0; // Indeks untuk melacak posisi buku dalam daftar

            // Iterasi melalui setiap daftar buku
            lists.forEach(list => {
                // Iterasi melalui buku dalam rentang yang ditentukan (startIndex hingga endIndex)
                list.books.slice(startIndex, endIndex).forEach(book => {
                    if (index >= startIndex && index < endIndex) {
                        // Membuat elemen div untuk item novel
                        const bookCard = document.createElement('div');
                        bookCard.className = 'book-card';

                        // Membuat elemen gambar untuk cover buku
                        const bookImage = document.createElement('img');
                        bookImage.src = book.book_image; // Mengatur sumber gambar dari API
                        bookImage.alt = book.title; // Mengatur teks alternatif gambar
                        bookImage.className = 'book-cover';

                        // Membuat div untuk detail buku
                        const bookDetails = document.createElement('div');
                        bookDetails.className = 'book-details';

                        // Membuat elemen untuk judul buku
                        const bookTitle = document.createElement('h3');
                        bookTitle.textContent = book.title;
                        bookTitle.className = 'book-title';

                        // Membuat tombol 'Buy Now'
                        const buyButton = document.createElement('button');
                        buyButton.textContent = 'Buy Now'; // Menetapkan teks tombol
                        buyButton.className = 'buy-btn';
                        // Menambahkan aksi klik tombol untuk membuka tautan pembelian buku
                        buyButton.onclick = () => window.open(book.buy_links[0].url, '_blank');

                        // Menambahkan elemen ke dalam card
                        bookDetails.appendChild(bookTitle);
                        bookDetails.appendChild(buyButton);
                        
                        bookCard.appendChild(bookImage);
                        bookCard.appendChild(bookDetails);
                        
                        // Menambahkan item novel ke kontainer
                        container.appendChild(bookCard);
                    }
                    index++;
                });
            });
        }
  