const DB = {
    init: function() {
        // Inicializa la DB con usuarios si no existen
        if (!localStorage.getItem('users')) {
            const users = [
                {
                    email: 'creditbusters2025@gmail.com',
                    password: '1.1Password1.1',
                    role: 'admin',
                    name: 'Super Admin'
                },
                {
                    email: 'cloudinary.projects@gmail.com',
                    password: '1.1Password1.1',
                    role: 'user',
                    name: 'Usuario Normal'
                }
            ];
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Inicializa el índice de solicitudes si no existe
        if (!localStorage.getItem('creditRequests_index')) {
            localStorage.setItem('creditRequests_index', JSON.stringify([]));
        }

        // Limpia la estructura de datos antigua si existe, para una transición limpia.
        if (localStorage.getItem('creditRequests')) {
            localStorage.removeItem('creditRequests');
        }
    },

    _getRequestsIndex: function() {
        return JSON.parse(localStorage.getItem('creditRequests_index')) || [];
    },

    _saveRequestsIndex: function(index) {
        localStorage.setItem('creditRequests_index', JSON.stringify(index));
    },

    getUsers: function() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },

    getCreditRequests: function() {
        const index = this._getRequestsIndex();
        const allRequests = [];
        
        index.forEach(id => {
            try {
                const requestData = localStorage.getItem(`creditRequest_${id}`);
                if (requestData) {
                    const request = JSON.parse(requestData);
                    // Asegurarse de que el objeto tiene la estructura esperada antes de añadirlo
                    if (request && request.fullData) {
                        allRequests.push(request);
                    }
                }
            } catch (e) {
                console.error(`Error al parsear la solicitud con ID ${id}:`, e);
                // Si hay un error, simplemente se ignora esta entrada, haciendo el sistema más robusto.
            }
        });
        return allRequests;
    },

    saveCreditRequest: function(request) {
        const newId = Date.now();
        request.id = newId;
        request.timestamp = new Date().toISOString();

        // Guardar la solicitud de forma independiente
        localStorage.setItem(`creditRequest_${newId}`, JSON.stringify(request));

        // Añadir el nuevo ID al índice
        const index = this._getRequestsIndex();
        index.push(newId);
        this._saveRequestsIndex(index);
    },

    updateCreditRequestStatus: function(requestId, newStatus) {
        const requestKey = `creditRequest_${requestId}`;
        try {
            const requestData = localStorage.getItem(requestKey);
            if (requestData) {
                const request = JSON.parse(requestData);
                request.status = newStatus;
                localStorage.setItem(requestKey, JSON.stringify(request));
            }
        } catch (e) {
            console.error(`Error al actualizar la solicitud con ID ${requestId}:`, e);
        }
    },

    getRequestById: function(requestId) {
        const requestKey = `creditRequest_${requestId}`;
        try {
            const requestData = localStorage.getItem(requestKey);
            if (requestData) {
                const request = JSON.parse(requestData);
                if (request && request.fullData) {
                    return request;
                }
            }
        } catch (e) {
            console.error(`Error al obtener la solicitud con ID ${requestId}:`, e);
        }
        return null; // Devuelve null si no se encuentra o hay un error
    }
};

// Inicializar la DB al cargar el script
DB.init();