//import { token } from '../authentication/script.js';
//console.log(token);
var id="";
const token = localStorage.getItem('authToken');
//console.log(token);
const loaderWrapper = document.querySelector('.loader-wrapper');
function formatDateTime(dateTimeString) {
  const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'UTC' // Specify the time zone of the input date time string
  };

  const dateTime = new Date(dateTimeString);
  const formattedDateTime = dateTime.toLocaleString(undefined, options);
  return formattedDateTime;
}
//console.log(token); // Use the token as needed
const isteacher = localStorage.getItem('isTeacher');
const userId = localStorage.getItem('userid');
const clubSelect = document.getElementById('filter-select');
let clubIdMap = {};
if(isteacher){
    document.getElementById('request-element').style.display = 'block';
}
// Fetch events from API
fetchEventData(id);
fetch('http://localhost:4000/api/v1/club')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        data.data.forEach(club => {
          const option = document.createElement('option');
          option.value = club.id;
          option.textContent = club.name;
          clubSelect.appendChild(option);
          clubIdMap[club.name] = club.id; // Store club name to id mapping
        });
      } else {
        throw new Error(data.message || 'Failed to fetch club names');
      }
    })
    .catch(error => {
      console.error('Error fetching club names:', error);
    });
    //console.log(clubIdMap)
    document.getElementById('filter-select').addEventListener('change', function() {
      var selectedClubId = this.value;
      if (selectedClubId === 'all') {
        selectedClubId = '';
      }
      // Call your API endpoint to fetch events with the selected club ID
      document.getElementById('cardContainer').innerHTML = '';
      fetchEventData(selectedClubId);
      //console.log(selectedClubId);
    });
async function fetchEventData(id) {
  try {
    const response = await fetch(`http://localhost:4000/api/v1/event?`+`clubId=${id}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch event data');
    }

    const eventCardsContainer = document.getElementById('eventCards');

    await Promise.all(data.data.map(async event => {
      if (event.permission) {
        const venueName = await fetchName('venue', event.venueId);
        const clubName = await fetchName('club', event.clubId);
        const eventCard = createEventCard(event, venueName, clubName);
        eventCardsContainer.appendChild(eventCard);
      }
    }));
  } catch (error) {
    console.error('Error fetching event data:', error);
  }finally {
    loaderWrapper.style.display = 'none'; // Hide loader
  }
}

async function fetchName(entity, id) {
  try {
    const response = await fetch(`http://localhost:4000/api/v1/${entity}/${id}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(`Failed to fetch ${entity} name with ID ${id}`);
    }

    return data.data.name;
  } catch (error) {
    console.error(`Error fetching ${entity} name with ID ${id}:`, error);
    return 'Unknown';
  }
}

function createEventCard(event, venueName, clubName) {
  const card = document.createElement('div');
  card.classList.add('card');

  const imageBox = document.createElement('div');
  imageBox.classList.add('image-box');
  
  // Create an image element
  const image = document.createElement('img');
  // Set the image source to the provided URL
  image.src = '../images/' + event.name + '.jpg';
  // Append the image to the image box
  imageBox.appendChild(image);

  const contentBox = document.createElement('div');
  contentBox.classList.add('content-box');

  // Title
  const title = document.createElement('span');
  title.classList.add('card-title');
  title.textContent = event.name;
  
  const content = document.createElement('p');
  content.classList.add('card-content');

  const venue = document.createElement('p');
  venue.textContent = `Venue: ${venueName}`;
  content.appendChild(venue);

  const club = document.createElement('p');
  club.textContent = `Club: ${clubName}`;
  content.appendChild(club);

  const startingTime = event.startingTime;
  const endingTime = event.endingTime;

  const formattedStartingTime = formatDateTime(startingTime);
  const formattedEndingTime = formatDateTime(endingTime);

  const startTime = document.createElement('p');
  startTime.textContent = `Start Time: ${formattedStartingTime}`;
  content.appendChild(startTime);

  const endTime = document.createElement('p');
  endTime.textContent = `End Time: ${formattedEndingTime}`;
  content.appendChild(endTime);

  const price = document.createElement('p');
  price.textContent = `Price: ${event.price === 0 ? 'Free' : event.price}`;
  content.appendChild(price);

  const seeMore = document.createElement('span');
  seeMore.classList.add('see-more');
  seeMore.textContent = 'Register';
  
  contentBox.appendChild(title);
  contentBox.appendChild(content);
  contentBox.appendChild(seeMore);
  
  const dateBox = document.createElement('div');
    dateBox.classList.add('date-box');

    // Month
    var datestring = new Date(formattedStartingTime);
    var monthIndex = datestring.getMonth();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthName = months[monthIndex];
    const month = document.createElement('span');
    month.classList.add('month');
    month.textContent = monthName;

    // Date
    var datestring = new Date(formattedStartingTime);
    var dateNumber = datestring.getDate().toString();
    const date = document.createElement('span');
    date.classList.add('date');
    date.textContent = dateNumber;

    // Append elements to date box
    dateBox.appendChild(month);
    dateBox.appendChild(date);

    // Append content and date box to card
    card.appendChild(imageBox);
    card.appendChild(contentBox);
    card.appendChild(dateBox);

    // Append card to container
    document.getElementById('cardContainer').appendChild(card);
  return card;
}
