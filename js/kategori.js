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
            method: "GET", // Metode HTTP yang digunakan, yaitu GET untuk mengambil data
            headers: { "Accept": "application/json" }, // Menetapkan header agar server mengirimkan data dalam format JSON
        };

        // Mengambil data dari API
        fetch(url, options) // Mengirim permintaan ke API menggunakan URL dan opsi yang ditentukan
            .then(response => response.json()) // Mengubah respons dari server menjadi format JSON
            .then(data => {
                // Mengambil elemen dropdown untuk kategori
                const categorySelect = document.getElementById('category-select');
                // Mengambil elemen container untuk menampilkan buku
                const booksContainer = document.getElementById('books');
                // Mengambil elemen container untuk menampilkan penulis
                const authorsContainer = document.getElementById('authors-container');
                // Mengambil daftar buku dari data yang diterima
                const lists = data.results.lists;

                // Membuat opsi kategori di dropdown
                lists.forEach(list => {
                    const option = document.createElement('option'); // Membuat elemen <option> untuk dropdown
                    option.value = list.list_name_encoded; // Menetapkan nilai opsi dengan nama kategori yang telah dienkode
                    option.textContent = list.list_name; // Menetapkan teks opsi dengan nama kategori
                    categorySelect.appendChild(option); // Menambahkan opsi ke dropdown kategori
                });

                // Menampilkan buku untuk kategori pertama secara default
                if (lists.length > 0) displayBooks(lists[0].books); // Jika ada daftar buku, tampilkan buku dari kategori pertama

                // Menampilkan buku untuk kategori yang dipilih
                categorySelect.addEventListener('change', event => {
                    const selectedList = lists.find(list => list.list_name_encoded === event.target.value); // Mencari daftar yang dipilih
                    displayBooks(selectedList.books); // Menampilkan buku dari daftar yang dipilih
                });

                // Mengumpulkan penulis unik
                const authors = new Map(); // Membuat Map untuk menyimpan penulis dan gambar buku
                lists.forEach(list => list.books.forEach(book => {
                    if (!authors.has(book.author)) { // Jika penulis belum ada di Map
                        authors.set(book.author, book.book_image); // Menambahkan penulis dan gambar buku ke Map
                    }
                }));

                // Membuat kartu penulis
                authors.forEach((image, name) => {
                    const authorCard = document.createElement('div'); // Membuat elemen <div> untuk kartu penulis
                    authorCard.className = 'author-card'; // Menetapkan kelas CSS untuk kartu penulis

                    const img = document.createElement('img'); // Membuat elemen <img> untuk gambar penulis
                    img.src = image; // Menetapkan sumber gambar penulis
                    img.alt = name; // Menetapkan teks alternatif untuk gambar
                    img.className = 'author-img';

                    const authorName = document.createElement('h3'); // Membuat elemen <h3> untuk nama penulis
                    authorName.textContent = name; // Menetapkan nama penulis
                    authorName.className = 'author-name';

                    authorCard.append(img, authorName); // Menambahkan gambar dan nama penulis ke kartu penulis
                    authorsContainer.appendChild(authorCard); // Menambahkan kartu penulis ke container penulis
                });
            })
            .catch(error => console.error('Error fetching data:', error)); // Menangani kesalahan jika permintaan gagal

            
            // Fungsi untuk menampilkan buku
            function displayBooks(books) {
            const booksContainer = document.getElementById('books'); // Mengambil elemen container untuk menampilkan buku
            clearContainer(booksContainer); // Membersihkan buku yang sudah ada di kontainer

            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';

                const bookCover = document.createElement('img');
                bookCover.src = book.book_image;
                bookCover.alt = book.title;
                bookCover.className = 'book-cover';

                const bookDetails = document.createElement('div');
                bookDetails.className = 'book-details';

                const bookTitle = document.createElement('h3');
                bookTitle.textContent = book.title;
                bookTitle.className = 'book-title';

                const bookAuthor = document.createElement('p');
                bookAuthor.textContent = book.author;
                bookAuthor.className = 'book-author';

                const buyButton = document.createElement('button');
                buyButton.textContent = 'Buy Now';
                buyButton.className = 'buy-btn';
                buyButton.onclick = () => window.open(book.buy_links[0].url, '_blank');

                bookDetails.append(bookTitle, bookAuthor, buyButton);
                bookCard.append(bookCover, bookDetails);
                booksContainer.appendChild(bookCard);
            });
        }

            // Fungsi untuk membersihkan kontainer 
            function clearContainer(container) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild); // Menghapus semua anak elemen dari kontainer
                }
            }