const isteacher = localStorage.getItem('isTeacher');
const userId = localStorage.getItem('userid');

if(isteacher){
    document.getElementById('request-element').style.display = 'block';
}
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
document.addEventListener('DOMContentLoaded', function() {
    const eventsContainer = document.getElementById('eventsContainer');

    // Fetch events data from the API
    fetch('http://localhost:4000/api/v1/event')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            if (data.success) {
                const events = data.data.filter(event => !event.permission);
                await Promise.all(events.map(async event => {
                    const [venueName, clubName] = await Promise.all([
                        fetchName('venue', event.venueId),
                        fetchName('club', event.clubId)
                    ]);

                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('eventdata');

                    const eventName = document.createElement('span');
                    eventName.classList.add('event-name');
                    eventName.textContent = event.name;
                    eventDiv.appendChild(eventName);

                    const venue = document.createElement('span');
                    venue.classList.add('text');
                    venue.textContent=venueName;
                    eventDiv.appendChild(venue);

                    const club = document.createElement('span');
                    club.classList.add('text');
                    club.textContent=clubName;
                    eventDiv.appendChild(club);

                    const startingTime = event.startingTime;
                    const endingTime = event.endingTime;

                    const formattedStartingTime = formatDateTime(startingTime);
                    const formattedEndingTime = formatDateTime(endingTime);

                    const startTime = document.createElement('span');
                    startTime.classList.add('text');
                    startTime.textContent = `Start Time: ${formattedStartingTime}`;
                    eventDiv.appendChild(startTime);

                    const endTime = document.createElement('span');
                    endTime.classList.add('text');
                    endTime.textContent = `End Time: ${formattedEndingTime}`;
                    eventDiv.appendChild(endTime);

                    const acceptButton = document.createElement('button');
                    acceptButton.classList.add('acceptBtn');
                    acceptButton.setAttribute('data-event-id', event.id);
                    acceptButton.textContent = 'Allow';
                    eventDiv.appendChild(acceptButton);

                    const declineButton = document.createElement('button');
                    declineButton.classList.add('declineBtn');
                    declineButton.setAttribute('data-event-id', event.id);
                    declineButton.textContent = 'Decline';
                    eventDiv.appendChild(declineButton);

                    eventsContainer.appendChild(eventDiv);
                }));
                
            } else {
                console.error(data.message);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // Handle button click event
    eventsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('acceptBtn')) {
            // Code for handling "Accept" button click
            const eventId = event.target.getAttribute('data-event-id');
            // Fetch existing event data and update permission
            updateEventPermission(eventId, true, event);
        } else if (event.target.classList.contains('declineBtn')) {
            // Code for handling "Decline" button click
            const eventId = event.target.getAttribute('data-event-id');
            // Send DELETE request to remove the event
            fetch(`http://localhost:4000/api/v1/event/${eventId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Optionally, you can remove the event from the UI
                event.target.parentNode.remove();
                console.log(`Event ID ${eventId} deleted successfully`);
            })
            .catch(error => {
                console.error('There was a problem with the DELETE request:', error);
            });
        }
    });
    
    // Function to update event permission
    function updateEventPermission(eventId, permission, event) {
        // Fetch existing event data
        fetch(`http://localhost:4000/api/v1/event/${eventId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(eventData => {
                // Merge existing data with updated permission
                const updatedEventData = {
                    ...eventData,
                    permission: permission
                };
                // Send PATCH request with merged data
                fetch(`http://localhost:4000/api/v1/event/${eventId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedEventData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    // Optionally, you can remove the event from the UI
                    event.target.parentNode.remove();
                    console.log(`Event ID ${eventId} permission updated to ${permission}`);
                })
                .catch(error => {
                    console.error('There was a problem with the PATCH request:', error);
                });
            })
            .catch(error => {
                console.error('There was a problem with fetching event data:', error);
            });
    }
    
});
