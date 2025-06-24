// NYTimes Books API
// drop down to choose category
// returns top in selected category

// names of all the nyt best seller lists: https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=xkztA3nGhyVj5NIB3LzEAt1f9pbaLQ0f

const app = {};
app.baseUrl = 'https://api.nytimes.com/svc/books/v3';
app.key = 'xkztA3nGhyVj5NIB3LzEAt1f9pbaLQ0f';
app.categoryChoice = '';
// Try this CORS proxy
// app.corsProxy = 'https://api.allorigins.win/raw?url=';

app.displayBooks = (books) => {
	$('.resultsWrapper').empty();

	books.forEach((book) => {
		let rank = book.rank;
		let title = book.title;
		let author = book.author;
		let cover = book.book_image;
		let description = book.description;
		
		displayToAppend = `
			<div class="results">
				<div class="bookRankWrapper">
					<p class="bookRank">${rank}</p>
				</div>
				<img class="bookCover" src="${cover}">
				<div class="bookInfo">
					<p class="bookTitle">${title}</p>
					<p class="bookAuthor">${author}</p>
					<p class="bookDescription">${description}</p>
				</div>
			</div>
		`;
		$('#resultsWrapper').append(displayToAppend);
	});
}

app.getBooks = () => {
	$.ajax({
		url: `${app.baseUrl}/lists/current/${app.categoryChoice}.json?api-key=${app.key}`,
		method: 'GET',
		dataType: 'json'
	}).then(function(choice){
		console.log('Books response:', choice.results.books);
		if (choice.results && choice.results.books) {
			console.log('Books found:', choice.results.books.length);
			app.displayBooks(choice.results.books);
		} else {
			console.error('No books found in response');
		}
	}).fail((error) => {
		console.error('Error fetching books:', error);
	});
}

app.populateDropdown = (categories) => {
	console.log('Populating dropdown with categories:', categories.length);
	// Clear the dropdown first
	$('#chooseCategory').empty();
	// Add default option
	$('#chooseCategory').append('<option value="" disabled selected>Choose a category</option>');
	
	categories.forEach((category) => {
		let displayName = category.display_name; // what the user will see
		let listNameEncoded = category.list_name_encoded; // value of each dropdown choice
		console.log('Adding category:', displayName, 'with value:', listNameEncoded);
		dropdownToAppend = `<option value="${listNameEncoded}">${displayName}</option>`;
		$('#chooseCategory').append(dropdownToAppend);	
	});	
}

app.getCategories = () => {
	$.ajax({
		url: `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${app.key}`,
		method: 'GET',
		dataType: 'json'
	}).then((data) => {
		console.log('Categories data:', data.results.lists);
		console.log('Results length:', data.results.lists ? data.results.lists.length : 'No results');
		if (data.results.lists && data.results.lists.length > 0) {
			app.populateDropdown(data.results.lists); 
		} else {
			console.error('No categories found in API response');
		}
	}).fail((error) => {
		console.error('Error fetching categories:', error);
	});
}

app.init = () => {
	// Show loading state
	$('#chooseCategory').html('<option value="" disabled selected>Loading categories...</option>');
	
	app.getCategories();

	// dropdown event listener
	$('#chooseCategory').on('change', function(){
		const selectedValue = $(this).val();
		if (selectedValue && selectedValue !== '') {
			app.categoryChoice = selectedValue;	
			app.getBooks();  
		}
	});
	
}

// document ready
$(() => {

	app.init();
	
});