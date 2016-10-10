type FileEventHandlers = {
  onAbort: ?Function,
  onError: ?Function,
  onProgress: ?Function,
  onWrite: ?Function,
  onWriteStart: ?Function,
  onWriteEnd: ?Function
};

type Options = {
  onAfterSave: ?Function,
  onBeforeSave: ?Function,
  shouldAutoBom: ?boolean,
  type: string
} | FileEventHandlers;

type Savery = {
  _createObjectUrlFromData: Function,
  _onAfterSave: Function,
  _onBeforeSave: Function,
  _onError: Function,
  _onSave: Function,
  _onWriteStart: Function,
  _onWriteEnd: Function,
  abort: Function,
  data: ?Blob,
  error: ?Error,
  filename: string,
  onAbort: Function,
  onAfterSave: Function,
  onBeforeSave: Function,
  onError: Function,
  onWriteStart: Function,
  onWriteEnd: Function,
  save: Function,
  status: string,
  type: string
};

type Statuses = {
  CANCELLED: string,
  COMPLETE: string,
  ERROR: string,
  PENDING: string,
  PROCESSING: string
};

export {FileEventHandlers};
export {Options};
export {Savery};
export {Statuses};
