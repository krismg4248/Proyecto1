import { Router } from 'express';
import { autenticar, soloAdmin } from '../middleware/auth.js';
import {
  actualizar,
  crear,
  eliminar,
  listar,
  obtener
} from '../controllers/usuariosController.js';

const router = Router();

router.use(autenticar, soloAdmin);
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;
