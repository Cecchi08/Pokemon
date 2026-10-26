import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export function DeleteConfirmModal({ name, pending, onClose, onConfirm }: { name: string; pending: boolean; onClose: () => void; onConfirm: () => void }) {
  return <Modal title="Eliminar de la coleccion" onClose={onClose}><div className="confirm-content"><p>Se eliminara a <strong>{name}</strong> y sus datos relacionados.</p><div className="form-actions"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button variant="danger" onClick={onConfirm} disabled={pending}>{pending ? 'Eliminando...' : 'Eliminar'}</Button></div></div></Modal>;
}