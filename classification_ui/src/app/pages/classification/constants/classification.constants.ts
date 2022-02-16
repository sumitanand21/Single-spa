// export const CLASSIFICATION_URLS = {
//     GET_CLASSIFICATION_DATASETS_API: 'getClassificationDataSets/',
//     GET_CLASSIFICATION_DATASET_FEATURE_GROUPS_API: 'getClassificationGroups/',
//     GET_CLASSIFICATION_DATASET_FEATURE_MAPPINGS_API: 'getClassificationDataSetMappings/',
//     GET_CLASSIFICATION_DATASET_TIME_COLUMNS_API: 'getClassificationTimeColumns/',
//     POST_CLASSIFICATION_DATASET_GROUP_DETAILS_API: 'getClassificationFeatureGroupDetails/',
//     PUT_CLASSIFICATION_UPDATE_FEATURE_GROUP_API: 'updateClassificationFeatureGroup/',
//     PUT_SCHEDULE_PROFILER_API: 'scheduleProfiler/',
//     POST_CLASSIFICATION_CREATE_FEATURE_GROUP_API: 'createClassificationFeatureGroup/',
//     GET_PROFILER_RESULT: 'getProfilerResult/',
//     GET_DATASET_LIST: 'getDataSetForJobType/',
//     GET_DATA_SOURCE_DETAILS_API: 'getDataSource/',
//     DELETE_CLASSIFICATION_FEATURE_GROUP_API: 'deleteClassificationFeatureGroup/',
// };


export const CLASSIFICATION_URLS = {
    GET_PROFILER_RESULT: '/api/classification/v1/basicprofiling',
    GET_DATASET_LIST: '/datasource/api/getDataSet',
    GET_CLASSIFICATION_DATASET_FEATURE_GROUPS_API: '/api/classification/v1/groupnames',
    GET_CLASSIFICATION_DATASET_TIME_COLUMNS_API: '/db_features/api/get_time_columns',
    GET_CLASSIFICATION_DATASET_FEATURE_MAPPINGS_API: '/db_features/api/get_dataset_mapping',
    POST_CLASSIFICATION_DATASET_GROUP_DETAILS_API: '/api/classification/v1/groups',
    PUT_CLASSIFICATION_UPDATE_FEATURE_GROUP_API: '/api/classification/v1/groups',
    POST_CLASSIFICATION_CREATE_FEATURE_GROUP_API: '/api/classification/v1/groups',
    PUT_SCHEDULE_PROFILER_API: '/api/classification/v1/classificationschedulingapi',
    GET_DATA_SOURCE_DETAILS_API: '/datasource/api/getDataSource',
    DELETE_CLASSIFICATION_FEATURE_GROUP_API: '/api/classification/v1/groups',
    GET_CLASSIFICATION_DATASETS_API: 'getClassificationDataSets/',
};
