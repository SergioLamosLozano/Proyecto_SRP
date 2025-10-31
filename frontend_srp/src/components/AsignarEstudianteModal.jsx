import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/Modal.css';
import { estudiantesAcudientesAPI, estudiantesAPI } from '../api/usuarios';

const AsignarEstudianteModal = ({ isOpen, onClose, acudienteId, onSaved }) => {
  const [allEstudiantes, setAllEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigned, setAssigned] = useState([]); // relaciones actuales [{id_estudiantes_acudientes, fk_numero_documento_estudiante}]
  const [selectedToAdd, setSelectedToAdd] = useState([]); // documentos seleccionados para agregar
  const [pendingRemovals, setPendingRemovals] = useState([]); // ids de relación a eliminar
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        const [estResp, relResp] = await Promise.all([
          estudiantesAPI.getAll(),
          estudiantesAcudientesAPI.por_acudiente(acudienteId)
        ]);
        setAllEstudiantes(estResp.data || []);
        setAssigned((relResp.data || []).map(r => ({ ...r })));
        setSelectedToAdd([]);
        setPendingRemovals([]);
      } catch (err) {
        console.error('Error cargando estudiantes/relaciones:', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la lista de estudiantes o relaciones.' });
      }
    };
    load();
  }, [isOpen, acudienteId]);

  if (!isOpen) return null;

  const filtered = allEstudiantes.filter(e => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return String(e.numero_documento_estudiante).includes(s) || (e.nombre1 && e.nombre1.toLowerCase().includes(s)) || (e.apellido1 && e.apellido1.toLowerCase().includes(s));
  });

  const isAlreadyAssigned = (doc) => assigned.some(a => String(a.fk_numero_documento_estudiante) === String(doc) && !pendingRemovals.includes(a.id_estudiantes_acudientes));

  const toggleSelectToAdd = (doc) => {
    setSelectedToAdd(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]);
  };

  const markRemove = (relId) => {
    setPendingRemovals(prev => prev.includes(relId) ? prev.filter(r => r !== relId) : [...prev, relId]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Crear nuevas relaciones para cada documento seleccionado que no esté ya asignado
      for (const doc of selectedToAdd) {
        // evitar duplicados
        if (isAlreadyAssigned(doc)) continue;
        const payload = { fk_numero_documento_acudiente: acudienteId, fk_numero_documento_estudiante: doc };
        await estudiantesAcudientesAPI.create(payload);
      }

      // Eliminar relaciones marcadas
      for (const relId of pendingRemovals) {
        await estudiantesAcudientesAPI.delete(relId);
      }

      Swal.fire({ icon: 'success', title: 'Guardado', text: 'Asignaciones actualizadas.' });
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error('Error guardando asignaciones:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron actualizar asignaciones.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900 }}>
        <div className="modal-header">
          <h3>Asignar Estudiantes</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ padding: '12px 18px' }}>
          <p>Acudiente: <strong>{acudienteId}</strong></p>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label>Buscar estudiante por documento o nombre</label>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Documento o nombre..." style={{ width: '100%', padding: 8 }} />

              <div style={{ maxHeight: 240, overflow: 'auto', marginTop: 8, border: '1px solid #eee', padding: 6 }}>
                {filtered.map(est => (
                  <div key={est.numero_documento_estudiante} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid #fafafa' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{est.nombre1} {est.apellido1}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{est.numero_documento_estudiante}</div>
                    </div>
                    <div>
                      <button className={`table-action-btn ${selectedToAdd.includes(est.numero_documento_estudiante) ? 'delete' : ''}`} onClick={() => toggleSelectToAdd(est.numero_documento_estudiante)}>
                        {selectedToAdd.includes(est.numero_documento_estudiante) ? 'Quitar' : 'Añadir'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ width: 360, borderLeft: '1px solid #eee', paddingLeft: 12 }}>
              <h4>Asignados</h4>
              <div style={{ maxHeight: 300, overflow: 'auto' }}>
                {assigned.length === 0 && <div style={{ color: '#666' }}>Sin estudiantes asignados.</div>}
                {assigned.map(rel => (
                  <div key={rel.id_estudiantes_acudientes} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid #fafafa' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{rel.estudiante_nombre || rel.fk_numero_documento_estudiante}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{rel.fk_numero_documento_estudiante}</div>
                    </div>
                    <div>
                      <button className={`table-action-btn ${pendingRemovals.includes(rel.id_estudiantes_acudientes) ? 'delete' : ''}`} onClick={() => markRemove(rel.id_estudiantes_acudientes)}>
                        {pendingRemovals.includes(rel.id_estudiantes_acudientes) ? 'Desmarcar' : 'Quitar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn-primary" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar asignaciones'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignarEstudianteModal;
