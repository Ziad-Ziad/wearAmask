//get the btn from the html c
var mybutton = document.getElementById("myBtn");

// show the btn when the screen is scrolled 20px
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// the fixed btn onclick  
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


//the form submitted data
let formSubmitted = () =>{

	

	const userName = document.getElementById("name-submitted").value;
	const useremail = document.getElementById("email-submitted").value;
	const userPhone = document.getElementById("phone-submitted").value;
	const userMessage = document.getElementById("message-submitted").value;
	
	if(userName === '' || useremail === '' || userPhone === '' || userMessage === ''){
		console.log('please fill in the form');
		document.getElementById("data-submitted-status").innerHTML = `<div class="alert alert-danger" role="alert">
		Please, fill in the form.</div>`
	} else {
		console.log(`The submitted name is: ${userName}`);
		console.log(`The submitted email is: ${useremail}`);
		console.log(`The submitted phone is: ${userPhone}`);
		console.log(`The submitted message is: ${userMessage}`);
		document.getElementById("data-submitted-status").innerHTML = `<div class="alert alert-success" 
		role="alert">Thank you,</div>`;
		clearForm();
		
	}

	function clearForm(){
		document.querySelector("#name-submitted").value = ""
		document.querySelector("#email-submitted").value = ""
		document.querySelector("#phone-submitted").value = ""
		document.querySelector("#message-submitted").value = ""
	}

}


//get the countries and chart data classes and IDs
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");
const ctx = document.getElementById("axes_line_chart").getContext("2d"); 


//app variables
let app_data = [],
	cases_list = [],
	recovered_list = [],
	deaths_list = [],
	formatedDates = [];


//get the user country via his IP address
let user_country = geoplugin_countryName();
console.log(`the client's country is ${user_country}`)


// fetch data from API
function fetchData(country) {
	user_country = country;
	country_name_element.innerHTML = "Loading...";
  
	(cases_list = []),
	  (recovered_list = []),
	  (deaths_list = []),
	  (dates = []),
	  (formatedDates = []);
  
	var requestOptions = {
	  method: "GET",
	  redirect: "follow",
	};
  
	const api_fetch = async (country) => {
	  await fetch(
		"https://api.covid19api.com/total/country/" +
		  country +
		  "/status/confirmed",
		requestOptions
	  )
		.then((res) => {
		  return res.json();
		})
		.then((data) => {
		  data.forEach((entry) => {
			dates.push(entry.Date);
			cases_list.push(entry.Cases);
		  });
		});
  
	  await fetch(
		"https://api.covid19api.com/total/country/" +
		  country +
		  "/status/recovered",
		requestOptions
	  )
		.then((res) => {
		  return res.json();
		})
		.then((data) => {
		  data.forEach((entry) => {
			recovered_list.push(entry.Cases);
		  });
		});
  
	  await fetch(
		"https://api.covid19api.com/total/country/" + country + "/status/deaths",
		requestOptions
	  )
		.then((res) => {
		  return res.json();
		})
		.then((data) => {
		  data.forEach((entry) => {
			deaths_list.push(entry.Cases);
		  });
		});
  
	  updateUI();
	};
  
	api_fetch(country);
}
  
fetchData(user_country);

//update the country, stats and the chart when the func is invoked
  function updateUI(){
	updateStats();
	axesLinearChart();
}


function updateStats(){
    //total cases and new cases got from the API database 
	const total_cases = cases_list[cases_list.length - 1];
	const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];
	console.log(`the total cases are ${total_cases} and the new confirmed cases are ${new_confirmed_cases}`);

    //total recovered and new recovered got from the API database 
	const total_recovered = recovered_list[recovered_list.length - 1];
	const new_recovered_cases = total_recovered - recovered_list[recovered_list.length - 2];
	console.log(`the total recoverd cases are ${total_recovered} and the new recovered cases are ${new_recovered_cases}`);

    //total deaths and new deaths got from the API database 
	const total_deaths = deaths_list[deaths_list.length -1 ];
	const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];
	console.log(`the total deaths cases are ${total_deaths} and the new deaths cases are ${new_deaths_cases}`);

    //put the client country got from the IP address in the html page
	country_name_element.innerHTML = user_country;

    //put the stats in the html page
	total_cases_element.innerHTML = total_cases;
	new_cases_element.innerHTML = `+${new_confirmed_cases}`;

	recovered_element.innerHTML = total_recovered;
	new_recovered_element.innerHTML = `+${new_recovered_cases}`;

	deaths_element.innerHTML = total_deaths;
	new_deaths_element.innerHTML = `${new_deaths_cases}`;

	//format Dates
	dates.forEach( (date) =>{
		formatedDates.push(formatDate(date));
	});
}
let my_chart;
function axesLinearChart() {

//???how will the condition work
	if(my_chart) {
		my_chart.destroy();
	}

	my_chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [
			{
				label: "Cases",
				data: cases_list,
				fill: false,
				borderColor: "#FFF",
				backgroundColor: "#FFF",
				borderWidth: 1,
			},
			{
				label: "Recovered",
				data: recovered_list,
				fill: false,
				borderColor: "#009688",
				backgroundColor: "#009688",
				borderWidth: 1,
			  },
			  {
				label: "Deaths",
				data: deaths_list,
				fill: false,
				borderColor: "#f44336",
				backgroundColor: "#f44336",
				borderWidth: 1,
			  },
		],
			labels: formatedDates,
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
		}
	});
}

//format dates
const monthsNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

function formatDate(dataString) {
	let date = new Date(dataString);

	return `${date.getDate()} ${monthsNames [date.getMonth() - 1]}`;
}

