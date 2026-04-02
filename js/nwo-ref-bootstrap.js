/**
 * Standalone reference page only: exposes New Work Order modal handlers on window
 * so onclick attributes work when opening pages/new-work-order.html directly.
 */
import {
  closeNewWorkOrderModal,
  nwoApptMoveLeft,
  nwoApptMoveRight,
  nwoBackToType,
  nwoContinueFromType,
  saveNewWorkOrder,
} from './pages/forms.js';

Object.assign(window, {
  closeNewWorkOrderModal,
  saveNewWorkOrder,
  nwoContinueFromType,
  nwoBackToType,
  nwoApptMoveRight,
  nwoApptMoveLeft,
});
