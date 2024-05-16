function displayClubs(response) {
    const clubListDiv = document.getElementById('clubList');
    clubListDiv.innerHTML = ''; // Clear previous content

    if (!response.success) {
        console.error('Error: Failed to fetch clubs. Message:', response.message);
        return;
    }

    const clubs = response.data;

    if (!Array.isArray(clubs)) {
        console.error('Error: Expected an array of clubs, but received:', clubs);
        return;
    }

    clubs.forEach((club, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        // Set data-hover-color attribute based on index
        cardDiv.setAttribute('data-hover-color', index + 1);

        // Set custom CSS variables for each card
        cardDiv.style.setProperty('--hover-colors-' + (index + 1), club.hoverColor);

        const nameHeader = document.createElement('h2');
        nameHeader.textContent = club.name;

        const logoImg = document.createElement('img');
        logoImg.src = club.logo;
        logoImg.alt = `${club.name} Logo`;
        logoImg.classList.add('club-logo');

        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.textContent = club.description;

        const joinButton = document.createElement('button');
        joinButton.textContent = 'Join';
        joinButton.classList.add('join-button');

        cardDiv.appendChild(nameHeader);
        cardDiv.appendChild(logoImg);
        cardDiv.appendChild(descriptionParagraph);
        cardDiv.appendChild(joinButton);

        clubListDiv.appendChild(cardDiv);
    });
}
