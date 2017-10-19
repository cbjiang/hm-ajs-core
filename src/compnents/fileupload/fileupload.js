/**
 * Created by cbjiang on 2017/6/19.
 */
angular.module('hm.fileupload',[
    "ngFileUpload"
]).filter('uriDecode',function(){
    return function(input){
        return decodeURI(input);
    }
}).filter('getFileType',function(){
    return function(input){
        return FileUploadUtil().getType(input).replace('.','')==""?' ':FileUploadUtil().getType(input).replace('.','').toUpperCase();
    }
}).filter('isImage',function(){
    return function(input){
        var imageType=['PNG','JPG','JPEG','BMP'];
        if(imageType.indexOf(FileUploadUtil().getType(input).replace('.','')==""?' ':FileUploadUtil().getType(input).replace('.','').toUpperCase())>=0){
            return true
        }
        return false;
    }
}).filter('backgroundUrl',['FILESERVICE',function(FILESERVICE){
    return function(file){
        return file.fileurl==null?(FILESERVICE+file.systemName+'/'+file.dir+'/'+file.saveName+'/'+file.fileName):file.fileurl;
    }
}]);

if(hmappSystemConfig!=null){
    angular.module('hm.fileupload')
        .constant('FILESERVICE',hmappSystemConfig.FILESERVICE)
        .constant('FILESYSTEMNAME',hmappSystemConfig.FILESYSTEMNAME)
        .constant('FILEDIRNAME',hmappSystemConfig.FILEDIRNAME);
}

angular.module('hm.fileupload').service('fileUploadService', fileUploadService);

fileUploadService.$inject = ['$http','$q','Upload','FILESERVICE'];

function fileUploadService ($http,$q,Upload,FILESERVICE) {
    var fileHost=FILESERVICE;

    var service= {
        uploadFile:uploadFile,
        deleteFile:deleteFile,
    };

    return service;

    function uploadFile(dirName,systemName,fileObj,cb1,cb2,cb3,zipParams){
        Upload.upload({
            url: fileHost+systemName+'/'+dirName+'/upload'+((zipParams==null||zipParams=="")?"":'/'+zipParams),
            method: 'POST',
            data: {
                file: fileObj, // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
            }
        }).then(
            function (response) {
                if(typeof cb1=='function'){
                    cb1(response);
                }
            },
            function (response) {
                if(typeof cb2=='function'){
                    cb2(response);
                }
            },
            function (evt) {
                if(typeof cb3=='function'){
                    cb3(evt);
                }
            }
        );
    }

    function deleteFile(file){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url:fileHost+'temp/delete',
            data:{
                dir: file.dir,
                saveNames: file.saveName,
                systemName: file.systemName
            }
        }).success(function(data,status,headers,config){
            deferred.resolve(data);
        }).error(function(data,status,headers,config){
            deferred.reject(data);
        })
        return deferred.promise;
    }
}

angular.module('hm.fileupload').directive( "hmUploadFile", ['$compile','$http','$window','fileUploadService','FILESERVICE','FILEDIRNAME','FILESYSTEMNAME',
    function( $compile,$http,$window,fileUploadService,FILESERVICE,FILEDIRNAME,FILESYSTEMNAME ) {
    return {
        scope:{
            ngModel: '='
        },
        require: '?ngModel',
        link:function( scope, element, attrs, ngModel ){
            if (!ngModel) {
                return;
            }

            var changeIndex=null;
            var changeFile=null;
            var fileHost=FILESERVICE;
            var fileSystemName=(attrs['system']==null||attrs['system']=="")?((FILESYSTEMNAME==null||FILESYSTEMNAME=="")?"tempSystem":FILESYSTEMNAME):attrs['system'];
            var fileDirName=(attrs['dir']==null||attrs['dir']=="")?((FILEDIRNAME==null||FILEDIRNAME=="")?"tempFileDir":FILEDIRNAME):attrs['dir'];

            var fileListSize=parseInt(attrs['size']);
            var typeList=FileUploadUtil().getTypeList(attrs['accept']);
            var fileSizeStr=attrs['filesize'];
            var fileSize=FileUploadUtil().fileSizeToBytes(fileSizeStr);
            var editFuncName="fileupload_edit";
            var downloadFuncName="fileupload_download";
            var delFuncName="fileupload_delete";

            var tmp='<div class="file-upload-bar"><div ng-repeat="file in ngModel" class="file-upload-info"><div ng-if="file.saveName==null" class="file-upload-ing"><div class="file-progress"><div style="margin-top: 30px"><span>{{file.progress}}</span></div><div class="progress progress-striped active "><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: {{file.progress}}"></div></div></div></div><div ng-if="file.saveName!=null"><div ng-if="(file.fileName | isImage)" class="file-type-img" style="background: url(\'{{file | backgroundUrl }}\') #000 center no-repeat;"><span class="ng-binding">&nbsp;</span><div class="file-upload-menu file"><div class="arrow"></div><div class="menu-btn edit" ng-click="{editFuncName}(file)"></div><div class="menu-btn download" ng-click="{downloadFuncName}(file)"></div><div class="menu-btn del" ng-click="{delFuncName}(file)"></div></div></div><div ng-if="!(file.fileName | isImage)" class="file-type-file"><span ng-if="(file.fileName | getFileType)!=\' \'" class="ng-binding">{{file.fileName | getFileType}}</span><span ng-if="(file.fileName | getFileType)==\' \'" class="ng-binding">&nbsp;</span><div class="file-upload-menu file"><div class="arrow"></div><div class="menu-btn edit" ng-click="{editFuncName}(file)"></div><div class="menu-btn download" ng-click="{downloadFuncName}(file)"></div><div class="menu-btn del" ng-click="{delFuncName}(file)"></div></div><div class="file-name">{{file.fileName | uriDecode}}</div></div></div></div><div class="file-upload-add"></div></div>';
            tmp=tmp.replace('{fileHost}',fileHost)
                .replace(/\{editFuncName}/g,editFuncName).replace(/\{downloadFuncName}/g,downloadFuncName).replace(/\{delFuncName}/g,delFuncName);

            var input='<input class="hide" type="file" accept="{accept}">';
            if(typeList!=null){
                input=input.replace("{accept}",typeList);
            }else{
                input=input.replace("{accept}","");
            }
            var inputObj=$(input).appendTo(element);
            inputObj.on('click',function(e){
                inputObj.val('');
                e.stopPropagation();
            })
            element.append($compile(tmp)(scope));
            inputObj.on('change',function(e){
                if(ngModel.$modelValue!=null && ngModel.$modelValue.length>0){

                }else{
                    ngModel.$setViewValue([]);
                }

                var _changeIndex=changeIndex;
                var _changeFile=changeFile;
                changeIndex=null;
                changeFile=null;

                if(_changeIndex==null && _changeFile==null && ngModel.$modelValue.length>=fileListSize){
                    toastr.error('最多上传'+fileListSize+'个附件!', '添加附件-失败');
                    return;
                }
                var fileList=e.target.files;
                for(var i=0;i<fileList.length;i++){
                    var fileObj=fileList[i];
                    if(typeList!=null && typeList!=""){
                        if(typeList.split(',').indexOf(FileUploadUtil().getType(fileObj.name))==-1){
                            toastr.error('请上传'+typeList.replace(/,/g,' ')+'类型的附件!', '添加附件-失败');
                            return;
                        }
                    }
                    if(fileSize!=null && fileSize!=""){
                        if(fileObj.size>fileSize){
                            toastr.error('上传的附件大小不能超过'+fileSizeStr+'!', '添加附件-失败');
                            return;
                        }
                    }
                    doUpload(fileObj,_changeIndex,_changeFile);
                }

            })
            element.find('.file-upload-add').on('click',function(){
                inputObj.click();
            })

            if(typeof scope[delFuncName] == 'undefined'){
                scope[delFuncName]=function(file){
                    for(var i=0;i<ngModel.$modelValue.length;i++){
                        if(file.saveName==ngModel.$modelValue[i].saveName){
                            if(file.fileurl!=null){
                                fileUploadService.deleteFile(file).then(function(){
                                    ngModel.$modelValue.splice(i,1);
                                    console.log('临时文件 删除成功');
                                },function(){
                                    console.log('临时文件 删除失败');
                                })
                            }else{
                                ngModel.$modelValue.splice(i,1);
                            }
                            break;
                        }
                    }
                }
            }

            if(typeof scope[downloadFuncName] == 'undefined'){
                scope[downloadFuncName]=function(file){
                    var url=''
                    for(var i=0;i<ngModel.$modelValue.length;i++){
                        if(file.saveName==ngModel.$modelValue[i].saveName){
                            if(file.fileurl!=null){
                                url = file.fileurl;
                            }else{
                                url = fileHost+file.systemName+'/'+file.dir+'/'+file.saveName+'/'+file.fileName;
                            }
                            break;
                        }
                    }
                    var elemIF = document.createElement("iframe");
                    elemIF.src = url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }
            }

            if(typeof scope[editFuncName] == 'undefined'){
                scope[editFuncName]=function(file){
                    for(var i=0;i<ngModel.$modelValue.length;i++){
                        if(file.saveName==ngModel.$modelValue[i].saveName){
                            changeIndex=i;
                            changeFile=file;
                            inputObj.click();
                            break;
                        }
                    }
                }
            }



            function doUpload(fileObj,_changeIndex,_changeFile){
                var fileInfo={};
                fileInfo.fileName=fileObj.name;
                if(_changeIndex!=null && _changeFile!=null){
                    ngModel.$modelValue.splice(_changeIndex,1,fileInfo);
                }else{
                    ngModel.$modelValue.push(fileInfo);
                }
                fileUploadService.uploadFile(
                    fileDirName,
                    fileSystemName,
                    fileObj,
                    function(response){
                        if(response.data!=null){
                            var fileList=response.data.result.content.list;
                            if(fileList!=null){
                                for(var i=0;i<fileList.length;i++){
                                    fileInfo.dir=fileList[i].dir;
                                    fileInfo.fileName=fileList[i].fileName;
                                    fileInfo.fileType=fileList[i].fileType;
                                    fileInfo.fileurl=fileList[i].fileurl;
                                    fileInfo.saveName=fileList[i].saveName;
                                    fileInfo.systemName=fileList[i].systemName;
                                }
                            }
                            if(_changeFile!=null){
                                if(_changeFile.fileurl!=null){
                                    fileUploadService.deleteFile(_changeFile).then(function(){
                                        console.log('临时文件 删除成功');
                                    },function(){
                                        console.log('临时文件 删除失败');
                                    })
                                }
                            }
                        }
                    },
                    function(response){
                        console.log('临时文件 上传失败');
                    },
                    function(evt){
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        fileInfo.progress=progressPercentage+'%';
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    }
                )
            }
        }
    }
}]);

angular.module('hm.fileupload').directive( "hmUploadFileDetail", ['$compile','$http','$window','fileUploadService','FILESERVICE','FILEDIRNAME',
    function( $compile,$http,$window,fileUploadService,FILESERVICE,FILEDIRNAME ) {
        return {
            scope:{
                ngModel: '='
            },
            require: '?ngModel',
            link:function( scope, element, attrs, ngModel ){
                if (!ngModel) {
                    return;
                }

                var fileHost=FILESERVICE;
                var downloadFuncName="fileupload_download";

                var tmp='<div class="file-upload-bar"><div ng-repeat="file in ngModel" class="file-upload-info detail"><div ng-if="file.saveName!=null"><div ng-if="(file.fileName | isImage)" class="file-type-img" style="background: url(\'{{file | backgroundUrl }}\') #000 center no-repeat;"><span class="ng-binding">&nbsp;</span><div class="file-upload-menu file"><div class="arrow"></div><div class="menu-btn download" ng-click="{downloadFuncName}(file)"></div></div></div><div ng-if="!(file.fileName | isImage)" class="file-type-file"><span ng-if="(file.fileName | getFileType)!=\' \'" class="ng-binding">{{file.fileName | getFileType}}</span><span ng-if="(file.fileName | getFileType)==\' \'" class="ng-binding">&nbsp;</span><div class="file-upload-menu file"><div class="arrow"></div><div class="menu-btn download" ng-click="{downloadFuncName}(file)"></div></div><div class="file-name">{{file.fileName | uriDecode}}</div></div></div></div></div>';
                tmp=tmp.replace('{fileHost}',fileHost).replace(/\{downloadFuncName}/g,downloadFuncName);
                element.append($compile(tmp)(scope));

                if(typeof scope[downloadFuncName] == 'undefined'){
                    scope[downloadFuncName]=function(file){
                        if(ngModel.$modelValue!=null && ngModel.$modelValue.length>0){
                            var url=''
                            for(var i=0;i<ngModel.$modelValue.length;i++){
                                if(file.saveName==ngModel.$modelValue[i].saveName){
                                    if(file.fileurl!=null){
                                        url = file.fileurl;
                                    }else{
                                        url = fileHost+file.systemName+'/'+file.dir+'/'+file.saveName+'/'+file.fileName;
                                    }
                                    break;
                                }
                            }
                            var elemIF = document.createElement("iframe");
                            elemIF.src = url;
                            elemIF.style.display = "none";
                            document.body.appendChild(elemIF);
                        }
                    }
                }
            }
        }
    }]);

angular.module('hm.fileupload').directive( "hmUploadImage", ['$compile','$http','$window','fileUploadService','FILESERVICE','FILEDIRNAME','FILESYSTEMNAME',
    function( $compile,$http,$window,fileUploadService,FILESERVICE,FILEDIRNAME,FILESYSTEMNAME ) {
    return {
        scope:{
            ngModel: '='
        },
        require: '?ngModel',
        link:function( scope, element, attrs, ngModel ){
            if (!ngModel) {
                return;
            }

            var zipParams=attrs['hmUploadImage'];
            var dpiStr='';
            if(zipParams!=null && zipParams!=''){
                dpiStr=zipParams.split(',')[0].split(':')[0].replace('*','_')+'_';
            }
            var changeIndex=null;
            var changeFile=null;
            var fileHost=FILESERVICE;
            var fileSystemName=(attrs['system']==null||attrs['system']=="")?((FILESYSTEMNAME==null||FILESYSTEMNAME=="")?"tempSystem":FILESYSTEMNAME):attrs['system'];
            var fileDirName=(attrs['dir']==null||attrs['dir']=="")?((FILEDIRNAME==null||FILEDIRNAME=="")?"tempImgDir":FILEDIRNAME):attrs['dir'];

            var fileListSize=parseInt(attrs['size']);
            var typeList=FileUploadUtil().getTypeList('image');
            var fileSizeStr=attrs['filesize'];
            var fileSize=FileUploadUtil().fileSizeToBytes(fileSizeStr);
            var coverFuncName="fileupload_cover";
            var editFuncName="fileupload_edit";
            var downloadFuncName="fileupload_download";
            var delFuncName="fileupload_delete";


            var tmp='<div class="file-upload-bar"><div ng-repeat="file in ngModel" class="file-upload-info"><div ng-if="file.saveName==null" class="file-upload-ing"><div class="file-progress"><div style="margin-top: 30px"><span>{{file.progress}}</span></div><div class="progress progress-striped active "><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: {{file.progress}}"></div></div></div></div><div ng-if="file.saveName!=null"><div class="file-type-img" style="background: url(\'{{file | backgroundUrl }}\') #000 center no-repeat;"><span class="ng-binding">&nbsp;</span><div class="file-upload-menu"><div class="arrow"></div><div class="menu-btn cover" ng-class="{\'active\':file.isCover==1}" ng-click="{coverFuncName}(file)"></div><div class="menu-btn edit" ng-click="{editFuncName}(file)"></div><div class="menu-btn download" ng-click="{downloadFuncName}(file)"></div><div class="menu-btn del" ng-click="{delFuncName}(file)"></div></div><div ng-if="file.isCover==1" class="cover-tab"></div></div></div></div><div class="file-upload-add image"></div></div>';
            tmp=tmp.replace('{fileHost}',fileHost)
                .replace(/\{coverFuncName}/g,coverFuncName).replace(/\{editFuncName}/g,editFuncName).replace(/\{downloadFuncName}/g,downloadFuncName)
                .replace(/\{delFuncName}/g,delFuncName).replace(/\{dpiStr}/g,dpiStr);

            var input='<input class="hide" type="file" accept="{accept}">';
            if(typeList!=null){
                input=input.replace("{accept}",typeList);
            }else{
                input=input.replace("{accept}","");
            }
            var inputObj=$(input).appendTo(element);
            inputObj.on('click',function(e){
                inputObj.val('');
                e.stopPropagation();
            })
            element.append($compile(tmp)(scope));
            inputObj.on('change',function(e){
                if(ngModel.$modelValue!=null && ngModel.$modelValue.length>0){

                }else{
                    ngModel.$setViewValue([]);
                }

                var _changeIndex=changeIndex;
                var _changeFile=changeFile;
                changeIndex=null;
                changeFile=null;

                if(_changeIndex==null && _changeFile==null && ngModel.$modelValue.length>=fileListSize){
                    toastr.error('最多上传'+fileListSize+'个附件!', '添加附件-失败');
                    return;
                }
                var fileList=e.target.files;
                for(var i=0;i<fileList.length;i++){
                    var fileObj=fileList[i];
                    if(typeList!=null && typeList!=""){
                        if(typeList.split(',').indexOf(FileUploadUtil().getType(fileObj.name))==-1){
                            toastr.error('请上传'+typeList.replace(/,/g,' ')+'类型的附件!', '添加附件-失败');
                            return;
                        }
                    }
                    if(fileSize!=null && fileSize!=""){
                        if(fileObj.size>fileSize){
                            toastr.error('上传的附件大小不能超过'+fileSizeStr+'!', '添加附件-失败');
                            return;
                        }
                    }
                    doUpload(fileObj,_changeIndex,_changeFile);
                }

            })
            element.find('.file-upload-add').on('click',function(){
                inputObj.click();
            })

            if(typeof scope[delFuncName] == 'undefined'){
                scope[delFuncName]=function(file){
                    for(var i=0;i<ngModel.$modelValue.length;i++){
                        if(file.saveName==ngModel.$modelValue[i].saveName){
                            if(file.fileurl!=null){
                                fileUploadService.deleteFile(file).then(function(){
                                    ngModel.$modelValue.splice(i,1);
                                    console.log('临时文件 删除成功');
                                },function(){
                                    console.log('临时文件 删除失败');
                                })
                            }else{
                                ngModel.$modelValue.splice(i,1);
                            }
                            break;
                        }
                    }
                }
            }

            if(typeof scope[downloadFuncName] == 'undefined'){
                scope[downloadFuncName]=function(file){
                    var url=''
                    for(var i=0;i<ngModel.$modelValue.length;i++){
                        if(file.saveName==ngModel.$modelValue[i].saveName){
                            if(file.fileurl!=null){
                                url = file.fileurl;
                            }else{
                                url = fileHost+file.systemName+'/'+file.dir+'/'+file.saveName+'/'+file.fileName;
                            }
                            break;
                        }
                    }
                    var elemIF = document.createElement("iframe");
                    elemIF.src = url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }
            }

            if(typeof scope[editFuncName] == 'undefined'){
                scope[editFuncName]=function(file){
                    for(var i=0;i<ngModel.$modelValue.length;i++){
                        if(file.saveName==ngModel.$modelValue[i].saveName){
                            changeIndex=i;
                            changeFile=file;
                            inputObj.click();
                            break;
                        }
                    }
                }
            }
            if(typeof scope[coverFuncName] == 'undefined'){
                scope[coverFuncName]=function(file){
                    for(var i=0;i<ngModel.$modelValue.length;i++){
                        if(file.saveName==ngModel.$modelValue[i].saveName && ngModel.$modelValue[i].isCover!=1){
                            ngModel.$modelValue[i].isCover=1;
                        }else{
                            ngModel.$modelValue[i].isCover=0;
                        }
                    }
                }
            }

            function doUpload(fileObj,_changeIndex,_changeFile){
                var fileInfo={};
                fileInfo.fileName=fileObj.name;
                if(_changeIndex!=null && _changeFile!=null){
                    ngModel.$modelValue.splice(_changeIndex,1,fileInfo);
                }else{
                    ngModel.$modelValue.push(fileInfo);
                }
                fileUploadService.uploadFile(
                    fileDirName,
                    fileSystemName,
                    fileObj,
                    function(response){
                        if(response.data!=null){
                            var fileList=response.data.result.content.list;
                            if(fileList!=null){
                                for(var i=0;i<fileList.length;i++){
                                    fileInfo.dir=fileList[i].dir;
                                    fileInfo.fileName=fileList[i].fileName;
                                    fileInfo.fileType=fileList[i].fileType;
                                    fileInfo.fileurl=fileList[i].fileurl;
                                    fileInfo.saveName=fileList[i].saveName;
                                    fileInfo.systemName=fileList[i].systemName;
                                    if(fileList[i].comSaveNames!=null){
                                        fileInfo.comSaveNames=fileList[i].comSaveNames
                                    }
                                    fileInfo.isCover=0;
                                }
                            }
                            if(_changeFile!=null){
                                if(_changeFile.fileurl!=null){
                                    fileUploadService.deleteFile(_changeFile).then(function(){
                                        console.log('临时文件 删除成功');
                                    },function(){
                                        console.log('临时文件 删除失败');
                                    })
                                }
                            }
                        }
                    },
                    function(response){
                        console.log('临时文件 上传失败');
                    },
                    function(evt){
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        fileInfo.progress=progressPercentage+'%';
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    },
                    zipParams
                )
            }
        }
    }
}]);

angular.module('hm.fileupload').directive( "hmUploadImageDetail", ['$compile','$http','$window','fileUploadService','FILESERVICE','FILEDIRNAME',
    function( $compile,$http,$window,fileUploadService,FILESERVICE,FILEDIRNAME ) {
        return {
            scope:{
                ngModel: '='
            },
            require: '?ngModel',
            link:function( scope, element, attrs, ngModel ){
                if (!ngModel) {
                    return;
                }

                var dpiParams=attrs['hmUploadImageDetail'];
                var dpiStr='';
                if(dpiParams!=null && dpiParams!=''){
                    dpiStr=dpiParams.replace('*','_')+'_';
                }
                var fileHost=FILESERVICE;
                var downloadFuncName="fileupload_download";

                var tmp='<div class="file-upload-bar"><div ng-repeat="file in ngModel" class="file-upload-info detail"><div ng-if="file.saveName!=null"><div class="file-type-img" style="background: url(\'{{file | backgroundUrl }}\') #000 center no-repeat;"><span class="ng-binding">&nbsp;</span><div class="file-upload-menu"><div class="arrow"></div><div class="menu-btn download" ng-click="{downloadFuncName}(file)"></div></div><div ng-if="file.isCover==1" class="cover-tab"></div></div></div></div></div>';
                tmp=tmp.replace('{fileHost}',fileHost).replace(/\{downloadFuncName}/g,downloadFuncName)
                    .replace(/\{dpiStr}/g,dpiStr);
                element.append($compile(tmp)(scope));

                if(typeof scope[downloadFuncName] == 'undefined'){
                    scope[downloadFuncName]=function(file){
                        if(ngModel.$modelValue!=null && ngModel.$modelValue.length>0){
                            var url=''
                            for(var i=0;i<ngModel.$modelValue.length;i++){
                                if(file.saveName==ngModel.$modelValue[i].saveName){
                                    if(file.fileurl!=null){
                                        url = file.fileurl;
                                    }else{
                                        url = fileHost+file.systemName+'/'+file.dir+'/'+file.saveName+'/'+file.fileName;
                                    }
                                    break;
                                }
                            }
                            var elemIF = document.createElement("iframe");
                            elemIF.src = url;
                            elemIF.style.display = "none";
                            document.body.appendChild(elemIF);
                        }
                    }
                }
            }
        }
    }]);

function FileUploadUtil(){
    var IMG_TYPE=['.png','.jpg','.jpeg','.bmp'];
    var VIDEO_TYPE=['.mp4','.rmvb','.avi','.flv'];
    var ZIP_TYPE=['.zip','.rar'];
    var DOC_TYPE=['.doc','.docx','.pdf','.xls','.xlsx','.ppt','.pptx'];

    var MIMETYPE={
        "image/png":".png",
        "image/jpeg":".jpg",
        "image/jpeg":".jpeg",
        "application/x-MS-bmp":".bmp",
        "video/mp4":".mp4",
        "audio/x-pn-realaudio":".rmvb",
        "video/x-msvideo":".avi",
        "video/x-flv":".flv",
        "application/zip":".zip",
        "application/x-rar-compressed":".rar",
        "application/msword":".doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":".docx",
        "application/pdf":".pdf",
        "application/vnd.ms-excel":".xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":".xlsx",
        "application/vnd.ms-powerpoint":".ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":".pptx",
    }

    function getTypeList(str){
        if(str!=null){
            var list=str.split(',');
            var typeList=[];
            for(var i=0;i<list.length;i++){
                switch(list[i]){
                    case "image":typeList=typeList.concat(IMG_TYPE);break;
                    case "video":typeList=typeList.concat(VIDEO_TYPE);break;
                    case "document":typeList=typeList.concat(DOC_TYPE);break;
                    case "package":typeList=typeList.concat(ZIP_TYPE);break;
                }
            }
            return typeList.join(',');
        }else{
            return "";
        }

    }

    function getType(str){
        if(str!=null && str.lastIndexOf('.')>=0){
            return '.'+str.substring(str.lastIndexOf('.') + 1);
        }else{
            return '';
        }
    }

    function fileSizeToBytes(str){
        if(str!=null){
            var c=str.split(' ');
            var k=1000;
            var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i=sizes.indexOf(c[1]);
            if(i!=-1){
                return c[0] * Math.pow(k, i);
            }else{
                return "";
            }
        }else{
            return "";
        }
    }

    return {
        getTypeList:getTypeList,
        getType:getType,
        fileSizeToBytes:fileSizeToBytes,
    }
}