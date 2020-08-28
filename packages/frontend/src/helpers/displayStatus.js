import constants from 'common/lib/constants'

const status = constants.task.status
export default {
  [status.NEW]: 'New task',
  // [status.NEXRENDER_IN_QUEUE]: 'Task in queue',
  [status.RENDER_PROCESS]: 'Task process',
  [status.RENDER_ERROR]: 'Task error',
  [status.RENDER_SUCCESSFUL]: 'Task rendered',
  [status.CLOUD_PROCESS]: 'Task process',
  [status.CLOUD_ERROR]: 'Task error',
  [status.CLOUD_SUCCESSFUL]: 'Task ready',
  [status.SUCCESSFUL]: 'Task ready'
  // [status.FFMPEG_NEW]: 'Task process',
  // [status.FFMPEG_IN_QUEUE]: 'Task process',
  // [status.FFMPEG_PROCESS]: 'Task process',
  // [status.FFMPEG_ERROR]: 'Task error',
  // [status.FFMPEG_SUCCESS]: 'Task process',
  // [status.CLOUD_STORAGE_NEW]: 'Task process',
  // [status.CLOUD_STORAGE_IN_QUEUE]: 'Task process',
  // [status.CLOUD_STORAGE_PROCESS]: 'Task process',
  // [status.CLOUD_STORAGE_ERROR]: 'Task error',
  // [status.CLOUD_STORAGE_SUCCESS]: 'Task ready'
}
