// export const SUMMARY_URLS = {
//     GET_SUMMARY_DETAILS_API: 'getSummaryDetails/',
//     GET_DATASET_LIST: 'getDataSetForJobType/'
// };

export const SUMMARY_URLS = {
    GET_DATASET_LIST: '/datasource/api/getDataSet',
    GET_IFRAME_LIST: '/datasource/api/iframeList',
    IFRAME_DETAILS: '/datasource/api/iframeDetails',
    GET_JOBTYPE_LIST: '/datasource/api/jobType'
};

export const CLUSTER_URLS = {

    GET_CLUSTER_TABLE_DATA_API: '/api/v1/profiling/asc/clusters/',
    GET_DATASET_LIST: '/datasource/api/getDataSet',
    GET_ANOMALY_MODEL_CONFIG_USING_NAME: '/api/v1/modelconfigs/',
    POST_CLUSTER_SCHEDULE_PROFILING_API: '/api/v1/profiling/asc/schedule/',
    GET_CLUSTER_PROFILING_RESULT_API: '/api/v1/profiling/asc/rootcause/',

    GET_ALARM_DETAILS_API: '/api/v1/profiling/asc/raw/',
    GET_SEQUENCE_DETAILS_API: '/api/v1/profiling/asc/sequence/',
    GET_AUTOCOMPLETE_RESOLUTION_API: '/api/v1/profiling/asc/autocomplete/',
    PUT_RESOLUTION_DETAILS_API: '/api/v1/profiling/asc/resolution/',
    PUT_CLUSTER_NAME_API: '/api/v1/profiling/asc/clusterName/',
    DELETE_CLUSTER_NAME_API: '/api/v1/profiling/asc/clusterName/',
};

export const DASHBOARDALARM_URLS = {

    GET_COUNT_API: '/api/v1/summary/counts/',
    GET_LINEGRAPH_API: '/api/v1/summary/linegraph/',
    GET_HISTOGRAM_API: '/api/v1/summary/histogram/'
};
