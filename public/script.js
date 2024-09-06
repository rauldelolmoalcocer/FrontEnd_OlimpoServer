let panelIdCounter = 1; // Inicializamos el contador de paneles

const panelContainer = document.getElementById('panelContainer');
const addPanelBtn = document.getElementById('addPanelBtn');

// Cargar los paneles guardados al cargar la página
window.onload = () => {
    fetch('/api/panels')
        .then(response => response.json())
        .then(panels => {
            panels.forEach(panel => {
                addPanelToDOM(panel.id, panel.name, panel.link);
            });
            if (panels.length > 0) {
                panelIdCounter = panels.length + 1; // Ajustar el contador de ID según el número de paneles
            }
        })
        .catch(err => console.error('Error al cargar los paneles:', err));
};

// Añadir un nuevo panel
addPanelBtn.addEventListener('click', () => {
    const panelId = `panel-${panelIdCounter++}`;
    const panelName = document.getElementById('panelName').value;
    const panelLink = document.getElementById('panelLink').value;

    if (!panelName || !panelLink) {
        alert('Por favor ingresa un nombre descriptivo y un enlace.');
        return;
    }

    const newPanel = {
        id: panelId,
        name: panelName,
        link: panelLink
    };

    // Enviar el panel al servidor para guardarlo
    fetch('/api/panels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPanel),
    })
    .then(response => response.json())
    .then(savedPanel => {
        addPanelToDOM(savedPanel.id, savedPanel.name, savedPanel.link);
        document.getElementById('panelName').value = ''; // Limpiar el formulario
        document.getElementById('panelLink').value = ''; // Limpiar el formulario
    })
    .catch(err => console.error('Error al añadir el panel:', err));
});

// Función para añadir un panel al DOM
function addPanelToDOM(panelId, panelName, panelLink) {
    const newPanel = document.createElement('div');
    newPanel.classList.add('col-md-4', 'panel');
    newPanel.setAttribute('id', panelId); // Asignar el ID único al panel

    newPanel.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${panelName}</h5>
                <a href="${panelLink}" class="btn btn-success" target="_blank">Ir a la página</a>
                <button class="btn btn-primary mt-2" onclick="panelClicked('${panelId}')">Opciones</button>
            </div>
        </div>
    `;
    panelContainer.appendChild(newPanel);
}

// Función para manejar el clic en los botones de los paneles
function panelClicked(panelId) {
    alert('Opciones para el panel con ID: ' + panelId);
}
