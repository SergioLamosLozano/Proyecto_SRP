import React, { useEffect, useState } from 'react';
import '../styles/Modal.css';
import Swal from 'sweetalert2';
import { estudiantesAPI, profesoresAPI, catalogoAPI, acudientesAPI, usersAPI, estudiantesAcudientesAPI } from '../api/usuarios';

const initialStateProfesor = {
  numero_documento_profesor: '',
  nombre1: '', nombre2: '', apellido1: '', apellido2: '',
  correo: '', direccion: '', telefono1: '', telefono2: '',
  fk_id_estado: null, fk_id_tipo_documento: null, fk_codigo_municipio: null,
};

const initialStateEstudiante = {
  numero_documento_estudiante: '',
  nombre1: '', nombre2: '', apellido1: '', apellido2: '',
  correo: '', direccion: '', telefono: '', religion: '',
  fk_tipo_estado: null, fk_id_tipo_documento: null, fk_codigo_municipio: null,
};

const initialStateAcudiente = {
  numero_documento_acudiente: '',
  fk_id_tipo_documento: null,
  nombre1: '', nombre2: '', apellido1: '', apellido2: '',
  correo: '', telefono1: '', telefono2: '', direccion: '', fk_codigo_municipio: null,
  _password: '',
  numero_documento_estudiante: ''
};

const UsuarioModal = ({ isOpen, onClose, mode = 'view', tipo = 'profesor', initialData = null, onSaved }) => {
  const [form, setForm] = useState(
    tipo === 'profesor' ? initialStateProfesor : (tipo === 'acudiente' ? initialStateAcudiente : initialStateEstudiante)
  );
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [estados, setEstados] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [tiposSangre, setTiposSangre] = useState([]);
  const [sisbenTipos, setSisbenTipos] = useState([]);
  const religionesList = ['Católica','Cristiana','Evangélica','Judía','Musulmana','Budista','Ateo','Agnóstico','Otra'];
  const readOnly = mode === 'view';

  useEffect(() => {
    if (!isOpen) return;
    // Cargar catálogos
    const fetchCatalogs = async () => {
      try {
        const results = await Promise.allSettled([
          catalogoAPI.getTiposDocumento(),
          catalogoAPI.getEstados(),
          catalogoAPI.getCiudades(),
          catalogoAPI.getGeneros(),
          catalogoAPI.getTiposSangre(),
          catalogoAPI.getSisben(),
        ]);

        // Tipos de documento
        if (results[0].status === 'fulfilled') {
          setTiposDocumento(results[0].value.data || []);
        } else {
          console.error('Error cargando tipos de documento', results[0].reason);
        }

        // Estados
        if (results[1].status === 'fulfilled') {
          setEstados(results[1].value.data || []);
        } else {
          console.error('Error cargando estados', results[1].reason);
        }

        // Ciudades
        if (results[2].status === 'fulfilled') {
          setCiudades(results[2].value.data || []);
        } else {
          console.error('Error cargando ciudades', results[2].reason);
        }

        // Géneros
        if (results[3].status === 'fulfilled') {
          setGeneros(results[3].value.data || []);
        } else {
          console.error('Error cargando géneros', results[3].reason);
        }

        // Tipos de sangre
        if (results[4].status === 'fulfilled') {
          setTiposSangre(results[4].value.data || []);
        } else {
          console.error('Error cargando tipos de sangre', results[4].reason);
        }

        // Sisben
        if (results[5].status === 'fulfilled') {
          setSisbenTipos(results[5].value.data || []);
        } else {
          console.error('Error cargando sisben', results[5].reason);
        }
      } catch (e) {
        console.error('Error cargando catálogos', e);
      }
    };
    fetchCatalogs();
  }, [isOpen]);

  useEffect(() => {
    // Cargar datos iniciales
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }));
    } else {
      if (tipo === 'profesor') setForm(initialStateProfesor);
      else if (tipo === 'acudiente') setForm(initialStateAcudiente);
      else setForm(initialStateEstudiante);
    }
  }, [initialData, tipo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tipo === 'profesor') {
        if (mode === 'create') {
          // requerir contraseña para crear el usuario del profesor
          if (!form._password || String(form._password || '').trim() === '') {
            Swal.fire({ icon: 'warning', title: 'Contraseña requerida', text: 'Debes pedir una contraseña para el acceso del profesor.' });
            return;
          }
          // crear profesor en la tabla de profesores
          await profesoresAPI.create(form);
          // intentar crear user en core users
          try {
            const username = String(form.numero_documento_profesor || form.correo || '').trim();
            // Enviar también nombre, apellidos y correo para que el serializer los guarde
            const payload = {
              username,
              password: form._password,
              rol: 'docente',
              email: form.correo || '',
              first_name: form.nombre1 || '',
              last_name: `${form.apellido1 || ''} ${form.apellido2 || ''}`.trim()
            };
            await usersAPI.create(payload);
          } catch (userErr) {
            console.warn('No se pudo crear core user:', userErr);
            Swal.fire({ icon: 'warning', title: 'Usuario no creado', text: 'El profesor fue creado, pero no se pudo crear la cuenta de acceso. Revisa el servidor.' });
          }
        } else if (mode === 'edit') {
          await profesoresAPI.update(form.numero_documento_profesor, form);
        }
      } else {
        if (tipo === 'acudiente') {
          if (mode === 'create') {
            // requerir contraseña para crear cuenta de acceso del acudiente
            if (!form._password || String(form._password || '').trim() === '') {
              Swal.fire({ icon: 'warning', title: 'Contraseña requerida', text: 'Debes pedir una contraseña para el acceso del acudiente.' });
              return;
            }
            await acudientesAPI.create(form);
            // intentar crear user en core users
            try {
              const username = String(form.numero_documento_acudiente || '').trim();
              const payload = {
                username,
                password: form._password,
                rol: 'padres',
                email: form.correo || '',
                first_name: form.nombre1 || '',
                last_name: `${form.apellido1 || ''} ${form.apellido2 || ''}`.trim()
              };
              await usersAPI.create(payload);
            } catch (userErr) {
              console.warn('No se pudo crear core user para acudiente:', userErr);
              Swal.fire({ icon: 'warning', title: 'Usuario no creado', text: 'El acudiente fue creado, pero no se pudo crear la cuenta de acceso. Revisa el servidor.' });
            }
            // Crear relación estudiante-acudiente si se proporcionó el documento del estudiante
            try {
              const docEst = String(form.numero_documento_estudiante || '').trim();
              const docAcu = String(form.numero_documento_acudiente || '').trim();
              if (docEst) {
                await estudiantesAcudientesAPI.create({
                  fk_numero_documento_estudiante: docEst,
                  fk_numero_documento_acudiente: docAcu,
                });
              }
            } catch (relErr) {
              console.warn('No se pudo crear relación estudiante-acudiente automáticamente:', relErr);
              Swal.fire({ icon: 'warning', title: 'Relación no creada', text: 'El acudiente fue creado, pero no se pudo asociar automáticamente al estudiante.' });
            }
          } else if (mode === 'edit') {
            // acuidente PK is numero_documento_acudiente
            await acudientesAPI.update(form.numero_documento_acudiente, form);
          }
        } else {
          if (mode === 'create') {
            await estudiantesAPI.create(form);
          } else if (mode === 'edit') {
            await estudiantesAPI.update(form.numero_documento_estudiante, form);
          }
        }
      }
      Swal.fire({ icon: 'success', title: 'Guardado', text: 'Datos guardados correctamente' });
      if (onSaved) onSaved();
      onClose();
    } catch (error) {
      console.error('Error guardando usuario', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar. Revisa los datos.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'create' ? (tipo === 'profesor' ? 'Añadir Profesor' : tipo === 'acudiente' ? 'Añadir Acudiente' : 'Añadir Estudiante') : mode === 'edit' ? 'Editar' : 'Ver Detalles'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {tipo === 'profesor' && (
            <>
              <div className="form-row">
                <label>Tipo Documento</label>
                <select name="fk_id_tipo_documento" value={form.fk_id_tipo_documento||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {tiposDocumento.map(td => (
                    <option key={td.id_tipo_documento||td.id} value={td.id_tipo_documento||td.id}>{td.descripcion||td.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Documento</label>
                <input name="numero_documento_profesor" value={form.numero_documento_profesor} onChange={handleChange} disabled={readOnly || mode==='edit'} required />
              </div>
              <div className="form-row">
                <label>Primer Nombre</label>
                <input name="nombre1" value={form.nombre1} onChange={handleChange} disabled={readOnly} required />
              </div>
              <div className="form-row">
                <label>Segundo Nombre</label>
                <input name="nombre2" value={form.nombre2||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Primer Apellido</label>
                <input name="apellido1" value={form.apellido1} onChange={handleChange} disabled={readOnly} required />
              </div>
              <div className="form-row">
                <label>Segundo Apellido</label>
                <input name="apellido2" value={form.apellido2||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Correo</label>
                <input type="email" name="correo" value={form.correo} onChange={handleChange} disabled={readOnly} required />
              </div>
              <div className="form-row">
                <label>Teléfono</label>
                <input name="telefono1" value={form.telefono1||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Dirección</label>
                <input name="direccion" value={form.direccion||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Estado</label>
                <select name="fk_id_estado" value={form.fk_id_estado||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {estados.map(es => (
                    <option key={es.id_tipo_estado||es.id} value={es.id_tipo_estado||es.id}>{es.descripcion||es.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Ciudad</label>
                <select name="fk_codigo_municipio" value={form.fk_codigo_municipio||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {ciudades.map(ci => (
                    <option key={ci.codigo_municipio||ci.id} value={ci.codigo_municipio||ci.id}>{ci.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Tipo de Sangre</label>
                <select name="fk_id_tipo_sangre" value={form.fk_id_tipo_sangre||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {tiposSangre.map(ts => (
                    <option key={ts.id_tipo_sangre||ts.id} value={ts.id_tipo_sangre||ts.id}>{ts.descripcion||ts.nombre}</option>
                  ))}
                </select>
              </div>
              {mode === 'create' && (
                <div className="form-row">
                  <label>Contraseña de acceso</label>
                  <input type="password" name="_password" value={form._password||''} onChange={handleChange} disabled={readOnly} required />
                </div>
              )}
            </>
          )}

          {tipo === 'acudiente' && (
            <>
              <div className="form-row">
                <label>Tipo Documento</label>
                <select name="fk_id_tipo_documento" value={form.fk_id_tipo_documento||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {tiposDocumento.map(td => (
                    <option key={td.id_tipo_documento||td.id} value={td.id_tipo_documento||td.id}>{td.descripcion||td.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Documento</label>
                <input name="numero_documento_acudiente" value={form.numero_documento_acudiente} onChange={handleChange} disabled={readOnly || mode==='edit'} required />
              </div>
              <div className="form-row">
                <label>Documento Estudiante (opcional)</label>
                <input name="numero_documento_estudiante" value={form.numero_documento_estudiante||''} onChange={handleChange} disabled={readOnly} placeholder="Para asociar automáticamente" />
              </div>
              <div className="form-row">
                <label>Correo</label>
                <input type="email" name="correo" value={form.correo||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Primer Nombre</label>
                <input name="nombre1" value={form.nombre1} onChange={handleChange} disabled={readOnly} required />
              </div>
              <div className="form-row">
                <label>Segundo Nombre</label>
                <input name="nombre2" value={form.nombre2||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Primer Apellido</label>
                <input name="apellido1" value={form.apellido1} onChange={handleChange} disabled={readOnly} required />
              </div>
              <div className="form-row">
                <label>Segundo Apellido</label>
                <input name="apellido2" value={form.apellido2||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Teléfono 1</label>
                <input name="telefono1" value={form.telefono1||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Teléfono 2</label>
                <input name="telefono2" value={form.telefono2||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Dirección</label>
                <input name="direccion" value={form.direccion||''} onChange={handleChange} disabled={readOnly} />
              </div>
              {mode === 'create' && (
                <div className="form-row">
                  <label>Contraseña de acceso</label>
                  <input type="password" name="_password" value={form._password||''} onChange={handleChange} disabled={readOnly} required />
                </div>
              )}
              <div className="form-row">
                <label>Ciudad</label>
                <select name="fk_codigo_municipio" value={form.fk_codigo_municipio||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {ciudades.map(ci => (
                    <option key={ci.codigo_municipio||ci.id} value={ci.codigo_municipio||ci.id}>{ci.nombre}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {tipo !== 'profesor' && tipo !== 'acudiente' && (
            <>
              <div className="form-row">
                <label>Tipo Documento</label>
                <select name="fk_id_tipo_documento" value={form.fk_id_tipo_documento||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {tiposDocumento.map(td => (
                    <option key={td.id_tipo_documento||td.id} value={td.id_tipo_documento||td.id}>{td.descripcion||td.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Documento</label>
                <input name="numero_documento_estudiante" value={form.numero_documento_estudiante} onChange={handleChange} disabled={readOnly || mode==='edit'} required />
              </div>
              <div className="form-row">
                <label>Primer Nombre</label>
                <input name="nombre1" value={form.nombre1} onChange={handleChange} disabled={readOnly} required />
              </div>
              <div className="form-row">
                <label>Segundo Nombre</label>
                <input name="nombre2" value={form.nombre2||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Primer Apellido</label>
                <input name="apellido1" value={form.apellido1} onChange={handleChange} disabled={readOnly} required />
              </div>
              <div className="form-row">
                <label>Segundo Apellido</label>
                <input name="apellido2" value={form.apellido2||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Correo</label>
                <input type="email" name="correo" value={form.correo||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Teléfono</label>
                <input name="telefono" value={form.telefono||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Dirección</label>
                <input name="direccion" value={form.direccion||''} onChange={handleChange} disabled={readOnly} />
              </div>
              <div className="form-row">
                <label>Estado</label>
                <select name="fk_tipo_estado" value={form.fk_tipo_estado||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {estados.map(es => (
                    <option key={es.id_tipo_estado||es.id} value={es.id_tipo_estado||es.id}>{es.descripcion||es.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Ciudad</label>
                <select name="fk_codigo_municipio" value={form.fk_codigo_municipio||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {ciudades.map(ci => (
                    <option key={ci.codigo_municipio||ci.id} value={ci.codigo_municipio||ci.id}>{ci.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Género</label>
                <select name="fk_id_genero" value={form.fk_id_genero||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {generos.map(ge => (
                    <option key={ge.id_genero||ge.id} value={ge.id_genero||ge.id}>{ge.descripcion||ge.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Religión</label>
                <select name="religion" value={form.religion||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {religionesList.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Tipo de Sangre</label>
                <select name="fk_id_tipo_sangre" value={form.fk_id_tipo_sangre||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {tiposSangre.map(ts => (
                    <option key={ts.id_tipo_sangre||ts.id} value={ts.id_tipo_sangre||ts.id}>{ts.descripcion||ts.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Sisben</label>
                <select name="fk_id_tipo_sisben" value={form.fk_id_tipo_sisben||''} onChange={handleChange} disabled={readOnly}>
                  <option value="">Seleccione...</option>
                  {sisbenTipos.map(sb => (
                    <option key={sb.id_tipo_sisben||sb.id} value={sb.id_tipo_sisben||sb.id}>{sb.descripcion||sb.nombre}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {mode !== 'view' && (
            <div className="modal-actions">
              <button type="submit" className="btn-primary">Guardar</button>
              <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            </div>
          )}

          {mode === 'view' && (
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cerrar</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UsuarioModal;