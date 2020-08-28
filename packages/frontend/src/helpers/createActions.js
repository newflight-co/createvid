import { defineAction } from 'redux-define'
import { INIT, SUCCESS, ERROR } from '../constants/stateConstants'

export const createApiAction = (baseName) => {
  return defineAction(baseName, [INIT, SUCCESS, ERROR])
}
