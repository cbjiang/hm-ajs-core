# hm-ajs-core 0.9.22
>这是一个用于搭建管理类系统的前端组件。该组件基于angularjs、jquery、bootstrap等控件，实现了接口调用、页面跳转、文件上传、分页查询等功能。

## 使用方法

###安装组件

```
bower install cbjiang/hm-ajs-core
```

###文件结构

* css --样式
* demo --示例
* img --图片
* libs --第三方组件
* src --js源码

###文件引用

1. 基本第三方组件需要都引用

	```
	  <link rel="stylesheet" href="../libs/bootstrap/css/bootstrap.min.css">
	  <link rel="stylesheet" href="../libs/bootstrap/css/daterangepicker.css">
	  <link rel="stylesheet" href="../libs/bootstrap/css/bootstrap-datetimepicker.css">
	  <link rel="stylesheet" href="../libs/toastr/css/toastr.min.css">
	  <link rel="stylesheet" href="../libs/jquery/css/jquery-accordion-menu.css">
	  
	  <script src="../libs/jquery/jquery.min.js"></script>
	  <script src="../libs/jquery/jquery.ba-resize.min.js"></script>
	  <script src="../libs/jquery/jquery-accordion-menu.js"></script>
	  
	  <script src="../libs/bootstrap/bootstrap.min.js"></script>
	  <script src="../libs/bootstrap/daterangepicker.js"></script>
	  <script src="../libs/bootstrap/bootstrap-datetimepicker.js"></script>
	
	  <script src="../libs/angular/angular.min.js"></script>
	  <script src="../libs/angular/angular-sanitize.min.js"></script>
	  <script src="../libs/angular/angular-ui-router.min.js"></script>
	  <script src="../libs/angular/ui-bootstrap.min.js"></script>
	  <script src="../libs/angular/ocLazyLoad.min.js"></script>
	  <script src="../libs/angular/ngStorage.min.js"></script>
	  <script src="../libs/angular/ng-file-upload.min.js"></script>
	  <script src="../libs/angular/ng-file-upload-shim.min.js"></script>
	  
	  <script src="../libs/toastr/toastr.min.js"></script>
	  <script src="../libs/moment.js"></script>
	```
	
2. js源码 核心引用

	```
	  <script src="../src/hmapp.js" type="text/javascript"></script>
	  <script src="../src/constant.js" type="text/javascript"></script>
	  <script src="../src/hmapp.configs.js" type="text/javascript"></script>
	  <script src="../src/hmapp.directives.js" type="text/javascript"></script>
	  <script src="../src/hmapp.service.js" type="text/javascript"></script>
	  <script src="../src/Layout.js" type="text/javascript"></script>
	  <script src="../src/interceptor/interceptor.config.js" type="text/javascript"></script>
	  <script src="../src/interceptor/auth.interceptor.js" type="text/javascript"></script>
	```

3. js源码 组件引用 (可选)

	```
	  <link rel="stylesheet" href="../css/fileupload.css">
	  <script src="../src/compnents/fileupload/fileupload.js" type="text/javascript"></script>
	```

###文件上传组件

1. 添加系统常量

	```
	HMApp.constant('FILESERVICE',"http://localhost:8080/rest/v1/file/");
	HMApp.constant('FILESYSTEMNAME',"tempSystem");
	HMApp.constant('FILEDIRNAME',"tempDir");
	```
	FILESERVICE 文件服务地址
	
	FILESYSTEMNAME 文件保存的系统目录 默认tempSystem
	
	FILEDIRNAME 文件保存的文件目录 默认tempFileDir tempImgDir

1. 添加引用

	```
	<link rel="stylesheet" href="../css/fileupload.css">
	<script src="../src/compnents/fileupload/fileupload.js" type="text/javascript"></script>
	```

2. 表单中使用时只需添加如下代码

	```
	<-- 上传文件 -->
	<div hm-upload-file data-list="fileInfos" data-size="3" data-filesize="10 MB" data-accept="image,document" data-dir="abcd">
	</div>
	
	<-- 上传图片 -->
	<div hm-upload-image data-list="imageInfos" data-size="3" data-filesize="10 MB" data-dir="abcd">
	</div>
	```

3. 参数说明

	* data-list 结果数据对象名
	* data-size 允许上传的最大文件数
	* data-filesize 文件大小限制 格式 '数字[空格]单位'
	* data-accept 允许上传的文件类型 image、video、document、package
	* data-dir 文件保存目录 如果不设置，默认使用FILEDIRNAME的值

	说明：
	
	```
	data-list: 页面中存在多个上传控件时，改字段的值必须不同
	
	filesize 单位: 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'
	
	data-accept: 只有hm-upload-file可以使用这个参数，hm-upload-image默认为image
	
	image: .png .jpg .jpeg .bmp
	video: .mp4 .rmvb .avi .flv
	document: .doc .docx .pdf .xls .xlsx .ppt .pptx
	package: .zip .rar
	```

4. 数据结构说明

	数据示例
	
	```
	[{
	    "fileName": "000.png",
	    "progress": "100%",
	    "dir": "test",
	    "fileType": ".png",
	    "fileurl": "http://192.168.8.59:8080/rest/v1/file/temp/testSystem/test/788d2ae1-94ec-4bff-b607-ed4d56d5310a.png/000.png",
	    "saveName": "788d2ae1-94ec-4bff-b607-ed4d56d5310a.png",
	    "systemName": "testSystem",
	    "isCover": 0
	}, {
	    "fileName": "1.0+%E5%AE%A2%E6%88%B7-%E8%B4%A6%E6%88%B7%E4%BF%A1%E6%81%AF.jpg",
	    "progress": "100%",
	    "dir": "test",
	    "fileType": ".jpg",
	    "fileurl": "http://192.168.8.59:8080/rest/v1/file/temp/testSystem/test/c6defff7-f59e-41fd-a34b-29e4a89484f1.jpg/1.0+%E5%AE%A2%E6%88%B7-%E8%B4%A6%E6%88%B7%E4%BF%A1%E6%81%AF.jpg",
	    "saveName": "c6defff7-f59e-41fd-a34b-29e4a89484f1.jpg",
	    "systemName": "testSystem",
	    "isCover": 1
	}, {
	    "fileName": "005IXpqDgw1f3zx461u1fj310t0th4qp+1.jpg",
	    "progress": "100%",
	    "dir": "test",
	    "fileType": ".jpg",
	    "fileurl": "http://192.168.8.59:8080/rest/v1/file/temp/testSystem/test/aa1849e7-eb67-43d9-a3fb-651899295022.jpg/005IXpqDgw1f3zx461u1fj310t0th4qp+1.jpg",
	    "saveName": "aa1849e7-eb67-43d9-a3fb-651899295022.jpg",
	    "systemName": "testSystem",
	    "isCover": 0
	}]
	```
	
	上传文件后data-list内填写的对象会被赋值，数值结构如上所示。
	
	isCover字段代表是否被设为封面，其中hm-upload-file获取到的数据中没有isCover字段，hm-upload-image则会有这个字段，0表示不是封面，1表示是封面。

5. 数据的保存

	各自系统根据控件提供的jsonArray来保存数据，其中hm-upload-file必须要保存的字段为dir、fileName、saveName、systemName，如果是hm-upload-image，则还需要保存isCover字段，图片的顺序为jsonArray中jsonObject的顺序。
	
	此外，在保存好数据后，需要调用文件服务的接口，将文件从临时文件目录转存至正式文件目录，具体见文件服务的接口文档

