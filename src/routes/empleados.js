import { Router } from 'express';
import { autenticar } from '../middleware/auth.js';
import {
  actualizar,
  crear,
  eliminar,
  listar,
  obtener
} from '../controllers/empleadosController.js';

const router = Router();

router.use(autenticar);
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;
