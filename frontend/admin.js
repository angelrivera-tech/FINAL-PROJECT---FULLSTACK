// admin.js - Panel de administración

document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemsTableBody = document.getElementById('itemsTableBody');

    // Cambia esta URL según la ruta de tu API en el backend (ej. http://localhost:3000/api/items)
    const API_URL = 'http://localhost:3000/api/items';

    // Función para obtener y mostrar los elementos
    async function fetchItems() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al conectar con el servidor');
            const items = await response.json();
            renderTable(items);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Renderizar los datos en la tabla del panel
    function renderTable(items) {
        if (!itemsTableBody) return;
        itemsTableBody.innerHTML = '';
        
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id || ''}</td>
                <td>${item.name || item.titulo || 'Sin nombre'}</td>
                <td>
                    <button onclick="deleteItem('${item.id}')" class="btn-delete">Eliminar</button>
                </td>
            `;
            itemsTableBody.appendChild(row);
        });
    }

    // Registrar nuevo elemento desde el formulario del panel
    if (itemForm) {
        itemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const itemName = document.getElementById('itemName').value;

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: itemName }),
                });

                if (response.ok) {
                    itemForm.reset();
                    fetchItems(); // Actualizar la lista
                } else {
                    alert('No se pudo guardar el registro');
                }
            } catch (error) {
                console.error('Error al enviar:', error);
            }
        });
    }

    // Función global para eliminar un elemento
    window.deleteItem = async function(id) {
        if (!confirm('¿Estás seguro de eliminar este elemento?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchItems(); // Actualizar la lista
            } else {
                alert('No se pudo eliminar el registro');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    // Cargar los elementos al iniciar
    fetchItems();
});