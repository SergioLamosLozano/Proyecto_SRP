import { useForm } from 'react-hook-form';
import axios from 'axios';      
import { createAdministrador } from '../api/administrador.api';




export function SettingsPage() {
    
    const {register, handleSubmit, formState: {errors}} = useForm();

// 2. La función `onSubmit` ahora recibe los datos del formulario
    //    y `handleSubmit` la envuelve en el <form>.
    const onSubmit = async (data) => {
        console.log(data);
        await createAdministrador(data);
        alert('Administrador creado con éxito');
    };

    return (
        <div>
            <h1>Crear administrador</h1>
            {/* 3. Corregido: Se usa `handleSubmit(onSubmit)` para manejar el envío */}
            <form onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <label htmlFor="identificacion">ID:</label>
                    <input type="text" id="identificacion" name="identificacion" required {...register("identificacion", {required: true})} />
                    {errors.identificacion && <span>Este campo es obligatorio</span>}
                </div>

                <div>
                    <label htmlFor="nombres">Nombres:</label>
                    <input type="text" id="nombres" name="nombres" required {...register("nombres", {required: true})} />
                    {errors.nombres && <span>Este campo es obligatorio</span>}
                    
                </div>
                <div>
                    <label htmlFor="apellidos">Apellidos:</label>
                    <input type="text" id="apellidos" name="apellidos" required {...register("apellidos", {required: true})} />
                    {errors.apellidos && <span>Este campo es obligatorio</span>}
                </div>
                <div>
                    <label htmlFor="correo">Correo:</label>
                    <input type="email" id="correo" name="correo" required {...register("correo", {required: true})}/>
                    {errors.correo && <span>Este campo es obligatorio</span>}
                </div>

                <div>
                    <label htmlFor="celular">Teléfono:</label>
                    <input type="tel" id="celular" name="celular" required {...register("celular", {required: true})} />
                    {errors.celular && <span>Este campo es obligatorio</span>}
                </div>

                <div>
                    <label htmlFor="contrasena">Contraseña:</label>
                    <input type="password" id="contrasena" name="contrasena" required {...register("contrasena", {required: true})} />
                    {errors.contrasena && <span>Este campo es obligatorio</span>}
                </div>

                <div>
                    <label htmlFor="direccion">Dirección:</label>
                    <input type="text" id="direccion" name="direccion" required {...register("direccion", {required: true})} />
                    {errors.direccion && <span>Este campo es obligatorio</span>}
                </div>

                <button type="submit">Crear administrador</button>
            </form>
        </div>
    );
}
