
        async function addData(newData) {
            try {
                const response = await fetch('http://localhost:4000/api/v1/club', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newData)
                });
                const data = await response.json();
                console.log('Data added:', data);
                if (response.ok) {
                    document.getElementById('message').innerText = 'Club created successfully!';
                    document.getElementById('message').classList.add('show');
                } else {
                    document.getElementById('message').innerText = 'Failed to create club. Please try again.';
                    document.getElementById('message').classList.add('show');
                }
            } catch (error) {
                console.error('Error adding data:', error);
                document.getElementById('message').innerText = 'An error occurred while creating the club.';
                document.getElementById('message').classList.add('show');
            }
        }

        document.getElementById('createClubForm').addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent the default form submission
            const clubName = document.getElementById('clubName').value; // Get the club name from the input field
            
            // Check if the club name already exists
            const isExisting = await checkExistingClub(clubName);
            if (isExisting) {
                document.getElementById('message').innerText = 'Club name already exists. Please choose a different name.';
                document.getElementById('message').classList.add('show');
                return; // Exit the function if club name already exists
            }

            // If club name is unique, proceed to create the club
            const newData = {
                'name': clubName
            }
            addData(newData);
        });

        async function checkExistingClub(clubName) {
            // Simulated asynchronous function to check if club name already exists
            return new Promise(resolve => {
                setTimeout(() => {
                    // Simulate checking against a list of existing club names
                    const existingClubNames = ['Club A', 'Club B', 'Club C']; // Example list of existing club names
                    
                    // Check if the provided club name already exists in the list
                    const isExisting = existingClubNames.includes(clubName);
                    resolve(isExisting);
                }, 1000); // Simulate delay of 1 second
            });
        }