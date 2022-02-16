export const APP = {
    BASE_URL: '/katana/vax/',
    SOCKET_URL: 'socketUrls/',
    SCHEDULES_URL: '/api/scheduler/v1/allschedules'
};
export const SESSION = {
    ID: 'sessionId',
    SC_NAME: 'scheduleName',
    TAB: 'tabPath',
    INTERVAL: 'interval',
    SES_EXP_TIME: 'sessionExpTime',
    SES_TIME: 'sessionTime',
    JOBTYPE: 'websocket',
    METHODS: 'methods',
    FORECAST_SOCKET_URL: 'forecastSocketUrl',
    ANOMALY_SOCKET_URL: 'anomalySocketUrl',
    PROFILER_SOCKET_URL: 'profilerSocketUrl',
    DTMNG_SOCKET_URL: 'dataManagementSocketUrl',
    FEATURE: 'feature'
};
export const SUBSCRIPTIONS = {
    FR_PROC_TABLE: 'forecastProcessingTable',
    FR_PROC_TABLE_VIEW_DETAILS: 'forecastProcessingTableViewDetails',
    ANMD_ALL_TASK: 'anomalyDetectionAllTaskTabe',
    ANMD_ALL_TASK_TRAINING_STATUS: 'anomalyDetectionAllTaskTrainigStatus',
    ANMD_ALL_TASK_TRAINED_MODELS: 'anomalyDetectionAllTaskTrainedModels',
    ANMD_ANMD_TABLE: 'anomalyDetectionTable',
    ANMD_ANMD_RESULT: 'anomalyDetectionResult',
    PROFILER_RESULT: 'profilerResult',
    PROFILER_RESULT_UID: 'profilerResultUid',
    ANMD_ANM_PROFILING: 'anomalyProfiling',
    DTMNG_JOBSTATUS : 'dataManagementJObStatus'
};
export const PATHS = {
    FR_PROCESSING: 'FORECAST/PROCESSING',
    ANMD_ALLTASK: 'ANOMALY/ALLTASK'
};
export enum SocketClientState {
    ATTEMPTING, CONNECTED
}
