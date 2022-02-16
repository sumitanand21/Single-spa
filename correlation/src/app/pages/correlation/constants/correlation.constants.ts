
// export const CORRELATION_URLS = {
//     GET_CORRELATION_DATASETS_API: 'getCorrelationDataSets/',
//     GET_CORRELATION_DATASET_FEATURE_GROUPS_API: 'getCorrelationGroups/',
//     GET_CORRELATION_DATASET_FEATURE_MAPPINGS_API: 'getCorrelationDataSetMappings/',
//     GET_CORRELATION_DATASET_TIME_COLUMNS_API: 'getCorrelationTimeColumns/',
//     POST_CORRELATION_DATASET_GROUP_DETAILS_API: 'getFeatureGroupDetails/',
//     PUT_CORRELATION_UPDATE_FEATURE_GROUP_API: 'updateFeatureGroup/',
//     GET_CORRELATION_TABLE_VIEW_DATA : 'getCorrelationTableViewData/',
//     POST__HEATMAP_API: 'getcorrelationheatmap/',
//     POST__SCATTERPLOTTER_API: 'getcorrelationplotdata/',
//     POST__PARTIONEDCHART_API: 'getpartionedchartdata/',
//     GET_CORRELATION_LIST_DATA: 'getcorrelationlistdata/',
//     GET_POSITIVE_GROUPS: 'getPositiveGroups/',
//     GET_NEGATIVE_GROUPS: 'getNegativeGroups/',
//     GET_GROUP_DETAILS: 'getGroupDetails/',
//     GET_DATASET_LIST: 'getDataSetForJobType/',
//     GET_DATA_SOURCE_DETAILS_API: 'getDataSource/',
//     POST_CORRELATION_DELETE_GROUP_API: 'deleteFeatureGroup/',
// };


export const CORRELATION_URLS = {
    GET_CORRELATION_TABLE_VIEW_DATA : '/correlation/api/get_table_view',
    POST__SCATTERPLOTTER_API: '/correlation/api/get_plot_data',
    POST__HEATMAP_API: '/correlation/api/get_correlation',
    POST__PARTIONEDCHART_API: '/correlation/api/get_correlated_features',
    GET_DATASET_LIST: '/datasource/api/getDataSet',
    GET_CORRELATION_DATASET_FEATURE_GROUPS_API: '/db_features/api/get_group_list',
    GET_CORRELATION_DATASET_TIME_COLUMNS_API: '/db_features/api/get_time_columns',
    GET_CORRELATION_DATASET_FEATURE_MAPPINGS_API: '/db_features/api/get_dataset_mapping',
    POST_CORRELATION_DATASET_GROUP_DETAILS_API: '/db_features/api/get_feature_group',
    PUT_CORRELATION_UPDATE_FEATURE_GROUP_API: '/db_features/api/put_feature_group',
    GET_CORRELATION_LIST_DATA: '/correlation/api/get_columns_list',
    GET_POSITIVE_GROUPS: '/correlation/api/get_positive_groups',
    GET_NEGATIVE_GROUPS: '/correlation/api/get_negative_groups',
    GET_GROUP_DETAILS: '/correlation/api/get_group_details',
    GET_DATA_SOURCE_DETAILS_API: '/datasource/api/getDataSource',
    POST_CORRELATION_DELETE_GROUP_API: '/db_features/api/delete_feature_group',

    GET_CORRELATION_DATASETS_API: 'getCorrelationDataSets/',
};
