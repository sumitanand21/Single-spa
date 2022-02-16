export const FEATURES_VALUES = {
    SUMMARY: true,
    FORECAST: true,
    ANOMALY: true,
    CORRELATION: true,
    CLASSIFICATION: true,
    DATAMANAGEMENT: true,
    CLUSTERING: true
};
export const FEATURES = {
    SUMMARY: FEATURES_VALUES.SUMMARY,
    FORECAST: FEATURES_VALUES.FORECAST,
    ANOMALY: FEATURES_VALUES.ANOMALY,
    CORRELATION: FEATURES_VALUES.CORRELATION,
    CLASSIFICATION: FEATURES_VALUES.CLASSIFICATION,
    DATAMANAGEMENT: FEATURES_VALUES.DATAMANAGEMENT,
    CLUSTERING: FEATURES_VALUES.CLUSTERING,
    nSUMMARY: !FEATURES_VALUES.SUMMARY,
    nFORECAST: !FEATURES_VALUES.FORECAST,
    nANOMALY: !FEATURES_VALUES.ANOMALY,
    nCORRELATION: !FEATURES_VALUES.CORRELATION,
    nCLASSIFICATION: !FEATURES_VALUES.CLASSIFICATION,
    nDATAMANAGEMENT: !FEATURES_VALUES.DATAMANAGEMENT
};
export const SOCKET_FEATURE = {
    SUMMARY: '',
    FORECAST: 'forecast',
    ANOMALY: 'anomalydetection',
    CORRELATION: '',
    CLASSIFICATION: 'classification',
    DATAMANAGEMENT: 'forecast'
};
export const FEATURES_DETAILS = {
    SUMMARY: {
        Active: true,
        link: '/summary',
        linkActive: 'active',
        lable: 'Summary',
        feature: 'SUMMARY'
        },
    FORECAST: {
        Active: true,
        link: '/forecast',
        linkActive: 'active',
        lable: 'ForeCast',
        feature: 'FORECAST'
        },
    ANOMALY: {
        Active: true,
        link: '/anomaly',
        linkActive: 'active',
        lable: 'Anomaly',
        feature: 'ANOMALY'
        },
    CORRELATION: {
        Active: true,
        link: '/correlation',
        linkActive: 'active',
        lable: 'Correlation',
        feature: 'CORRELATION'
        },
    CLASSIFICATION: {
        Active: true,
        link: '/classification',
        linkActive: 'active',
        lable: 'Classification',
        feature: 'CLASSIFICATION'
        },
    DATAMANAGEMENT: {
        Active: true,
        link: '/datamanagement',
        linkActive: 'active',
        lable: 'DataManagement',
        feature: 'DATAMANAGEMENT'
        }
};
