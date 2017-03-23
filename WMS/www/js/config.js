'use strict';
var appConfig = angular.module('WMSAPP.config',[]);
appConfig.constant('ENV', {
    'website':      'www.sysfreight.net/app/wms/interglobo',
    'api':          'www.sysfreight.net/apis/wms/interglobo',
    //  'api':          'localhost:1813',
    'ssl':          '0', // 0 : false, 1 : true
    'port':         '8081', // http port no
    'debug':        true,
    'mock':         false,
    'fromWeb':      true,
    'appId':        '9CBA0A78-7D1D-49D3-BA71-C72E93F9E48F',
    'apkName':      'WMS-SingleSN',
    'updateFile':   'update.json',
    'rootPath':     'WMS',
    'configFile':   'config.txt',
    'version':      '1.0.13',
    websql : {
    name: 'SingleSNDB',
    version: '1.0',
    displayName: 'WMS Database',
    estimatedSize: 10 * 1024 * 1024
},
sqlite : {
    name: 'AppSingleSN.db',
    location: 'default'
},
});
