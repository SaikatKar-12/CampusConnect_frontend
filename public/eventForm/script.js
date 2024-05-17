// script.js
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
function parseDateTimeAsUTC(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  return new Date(Date.UTC(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      dateTime.getHours(),
      dateTime.getMinutes(),
      dateTime.getSeconds()
  ));
}
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('eventForm');
  const errorMessage = document.getElementById('errorMessage');
  const clubSelect = document.getElementById('eventClub');
  const venueSelect = document.getElementById('eventVenue');
  const imageInput = document.getElementById('eventImage');

  let responseData;
  let clubIdMap = {}; // Map to store club name to id mapping
  let venueIdMap = {}; // Map to store venue name to id mapping

  // Fetch club names from API and populate select options
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

  // Fetch venue names from API and populate select options
  fetch('http://localhost:4000/api/v1/venue')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        data.data.forEach(venue => {
          const option = document.createElement('option');
          option.value = venue.id;
          option.textContent = venue.name;
          venueSelect.appendChild(option);
          venueIdMap[venue.name] = venue.id; // Store venue name to id mapping
        });
      } else {
        throw new Error(data.message || 'Failed to fetch venue names');
      }
    })
    .catch(error => {
      console.error('Error fetching venue names:', error);
    });

    async function getEventsByVenue(venueName) {
      const url = `http://localhost:4000/api/v1/event?venueId=${encodeURIComponent(venueName)}`;
  
      try {
          const response = await fetch(url);
          const data = await response.json();
  
          if (response.ok && data.success) {
              return data.data;
          } else {
              console.error(`Failed to fetch events for venue '${venueName}'`);
              return [];
          }
      } catch (error) {
          console.error(`An error occurred: ${error}`);
          return [];
      }
  }

  function checkEventConflicts(events, start, end) {
    // Convert start and end to Date objects for comparison
    start = new Date(start);
    end = new Date(end);

    // Loop through each event in the array
    for (const event of events) {
        // Convert event starting and ending times to Date objects
        const a =formatDateTime(event.startingTime);
        const b =formatDateTime(event.endingTime)
        const eventStart = new Date(a);
        const eventEnd = new Date(b);
        //console.log(eventStart);
        //console.log(start);
        // Check if the event overlaps with the specified time range
        if (start >= eventStart && start < eventEnd) {
            // Conflict found, return false
            return false;
        }
        if(end>eventStart && end<=eventEnd){
          return false;
        }
        if(start< eventStart && end >eventEnd){
          return false;
        }
    }

    // No conflicts found, return true
    return true;
}

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const eventData = {
      name: formData.get('name'),
      venueId: formData.get('venue'), // Get venue id from map
      clubId: formData.get('club'), // Get club id from map
      startingTime: parseDateTimeAsUTC(formData.get('startingTime')), // Parse as UTC
      endingTime: parseDateTimeAsUTC(formData.get('endingTime')), // Parse as UTC
      price: formData.get('price') || 0 // Ensure price is null if not provided
    };

    // if (imageInput.files.length > 0) {
    //   const imageFile = imageInput.files[0];
    //   formData.append('image', imageFile); // Append the image file to the FormData object
    //   const uploadResponse = await fetch('http://localhost:3001/upload', {
    //     method: 'POST',
    //     body: formData
    //   });
    // }

    const eventByVenue = await getEventsByVenue(eventData.venueId);
    console.log(eventByVenue);
    //console.log(eventData);
    const conflict = checkEventConflicts(eventByVenue,formData.get('startingTime'),formData.get('endingTime'));
    //console.log(conflict);
    if(conflict==false){
      errorMessage.textContent = 'Event with same place and time is already registered';
      return;
    }
    
    //console.log(clubIdMap[formData.get('club')]);
    //console.log(formData.get('club'));
    const imageData = new FormData();
      imageData.append('image', imageInput.files[0]);

      try {
        const response = await fetch('http://localhost:7000/upload', {
          method: 'POST',
          body: imageData,
        });
        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.error(error);
      }
    try {
      const response = await fetch('http://localhost:4000/api/v1/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      responseData = await response.json();
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      console.log(responseData);
      //alert('Event created successfully!');
      window.location.href = '../eventpage/index.html';
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof TypeError) {
        errorMessage.textContent = 'An error occurred while communicating with the server.';
      } else if (responseData && responseData.err && responseData.err.error) {
        errorMessage.textContent = responseData.err.error.error;
      } else {
        errorMessage.textContent = 'An error occurred while creating the event.';
      }
    
    }
  });
});
