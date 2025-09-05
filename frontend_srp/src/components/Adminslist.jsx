import {useEffect, useState} from 'react';

import { getAdministradores } from '../api/administrador.api';

export function AdminsList() {

    const [admins, setAdmins] = useState([]);

    // Se ejecuta apenas cargue la pagina
    useEffect(() => {

        async function loadAdmins() {

            const res = await getAdministradores();
            setAdmins(res.data);       
        }
        loadAdmins();
        
    }   , []);  
    return (
        <div>
            {admins.map((admin) => (
                <div key={admin.id}>
                    <p>Nombre: {admin.nombres} {admin.apellidos}</p>
                    <p>Correo: {admin.correo}</p>
                </div>
            ))}
        </div>
    )
}