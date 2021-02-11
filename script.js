// NYTimes Books API
// drop down to choose category
// returns top in selected category

// future enhancements:
// look at rank for last week and this week, based on result use icons to indicate higher or lower position
// what to do if author field is empty? 
// style the select, at least a little bit
// do I want to limit the number of results, e.g. top 5?

// names of all the nyt best seller lists: https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=xkztA3nGhyVj5NIB3LzEAt1f9pbaLQ0f

const app = {};
app.baseUrl = 'https://api.nytimes.com/svc/books/v3';
app.key = 'xkztA3nGhyVj5NIB3LzEAt1f9pbaLQ0f';
app.categoryChoice = '';

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
		console.log(choice.results.books);
		app.displayBooks(choice.results.books);	
	});
}

app.populateDropdown = (categories) => {
	categories.forEach((category) => {
		let displayName = category.display_name; // what the user will see
		let listNameEncoded = category.list_name_encoded; // value of each dropdown choice
		dropdownToAppend = `<option value="${listNameEncoded}">${displayName}</option>`;
		$('#chooseCategory').append(dropdownToAppend);	
	});	
}

app.getCategories = () => {
	$.ajax({
		url: `https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${app.key}`,
		method: 'GET',
		dataType: 'json'
	}).then((data) => {
		app.populateDropdown(data.results); 
	});

}

app.init = () => {

	app.getCategories();

	// dropdown event listener
	$('#chooseCategory').on('change', function(){
		app.categoryChoice = $(this).val();	
		app.getBooks();  
	});
	
}

// document ready
$(() => {

	app.init();
	
});